import { onRequest } from "firebase-functions/v2/https";
import { verifyAdmin, db } from "../helpers";

/**
 * 회의 64 후속 (2026-04-19): 플랜 세션 완료 상태 소급 반영 admin 함수
 *
 * 배경: `markSessionCompleted` 호출이 `page.tsx` onComplete에 추가되기 이전 완료한
 * 장기 프로그램 세션들은 `SavedPlan.completedAt`이 비어있음. 이로 인해 내 플랜 화면의
 * 체크마크/진행률이 실제 완료 이력을 반영 못 함.
 *
 * 로직: 각 유저의 `saved_plans`(programId 보유) vs `workout_history` 교차 매칭.
 * - 매칭 기준: 운동명 세트(name 정렬 join)가 동일 + history.date >= plan.createdAt
 * - 1:1 매칭 (이미 매칭된 history는 재사용 금지 — 반복 세션 구분)
 *
 * POST /adminBackfillSessionCompletion
 * Body: { dryRun?: boolean }
 * Admin only.
 */

interface BackfillReport {
  scannedUsers: number;
  scannedPlans: number;
  alreadyCompleted: number;
  matched: number;
  unmatched: number;
  errors: string[];
}

function exerciseNameSet(exs: Array<{ name?: string }> | undefined): string {
  if (!exs || exs.length === 0) return "";
  return exs
    .map(e => (e.name ?? "").trim())
    .filter(n => n.length > 0)
    .sort()
    .join("|");
}

function toMillis(v: unknown): number {
  if (typeof v === "number" && isFinite(v)) return v;
  if (typeof v === "string") {
    const t = new Date(v).getTime();
    if (isFinite(t)) return t;
  }
  // Firestore Timestamp 객체 호환 (toMillis 메서드)
  if (v && typeof v === "object" && "toMillis" in v) {
    try {
      const ms = (v as { toMillis: () => number }).toMillis();
      if (isFinite(ms)) return ms;
    } catch { /* ignore */ }
  }
  return 0;
}

export const adminBackfillSessionCompletion = onRequest(
  { cors: true },
  async (req, res) => {
    if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

    try {
      await verifyAdmin(req.headers.authorization);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unauthorized";
      res.status(msg.includes("Forbidden") ? 403 : 401).json({ error: msg });
      return;
    }

    const dryRun = req.body?.dryRun === true;
    const report: BackfillReport = {
      scannedUsers: 0,
      scannedPlans: 0,
      alreadyCompleted: 0,
      matched: 0,
      unmatched: 0,
      errors: [],
    };

    try {
      const usersSnap = await db.collection("users").get();
      for (const userDoc of usersSnap.docs) {
        report.scannedUsers += 1;

        const plansSnap = await userDoc.ref.collection("saved_plans").get();
        if (plansSnap.empty) continue;

        const programPlans = plansSnap.docs.filter(d => {
          const data = d.data();
          return data.programId && !data.completedAt;
        });
        const alreadyDone = plansSnap.docs.filter(d => d.data().programId && d.data().completedAt).length;
        report.alreadyCompleted += alreadyDone;

        if (programPlans.length === 0) continue;

        const histSnap = await userDoc.ref.collection("workout_history").get();
        const histories = histSnap.docs.map(d => ({ id: d.id, data: d.data() }));
        const matchedHistoryIds = new Set<string>();

        for (const planDoc of programPlans) {
          report.scannedPlans += 1;
          const plan = planDoc.data();
          const planExSet = exerciseNameSet(plan.sessionData?.exercises);
          if (!planExSet) { report.unmatched += 1; continue; }

          const createdAtMs = toMillis(plan.createdAt);

          // 가장 오래된 미매칭 history 선택 (세션 순서 보존)
          const candidates = histories
            .filter(h => !matchedHistoryIds.has(h.id))
            .filter(h => toMillis(h.data.date) >= createdAtMs)
            .filter(h => exerciseNameSet(h.data.sessionData?.exercises) === planExSet)
            .sort((a, b) => toMillis(a.data.date) - toMillis(b.data.date));

          if (candidates.length === 0) {
            report.unmatched += 1;
            continue;
          }

          const match = candidates[0];
          matchedHistoryIds.add(match.id);
          report.matched += 1;

          if (!dryRun) {
            try {
              const completedAtMs = toMillis(match.data.date);
              await planDoc.ref.update({
                completedAt: completedAtMs,
                lastUsedAt: completedAtMs,
              });
            } catch (e) {
              report.errors.push(`${userDoc.id}/${planDoc.id}: ${(e as Error).message}`);
            }
          }
        }
      }

      res.status(200).json({ ok: true, dryRun, report });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      res.status(500).json({ error: msg, report });
    }
  }
);
