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
  reset: number;
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
    // 회의 64 후속 (2026-04-19 v2): reset=true 시 기존 programId 플랜의 completedAt 모두 제거 후 재매칭
    // 동일 운동 구성 세션이 여러 번 나오는 프로그램에서 잘못 매칭된 경우 교정용
    const reset = req.body?.reset === true;
    const report: BackfillReport = {
      scannedUsers: 0,
      scannedPlans: 0,
      alreadyCompleted: 0,
      matched: 0,
      unmatched: 0,
      reset: 0,
      errors: [],
    };

    try {
      const usersSnap = await db.collection("users").get();
      for (const userDoc of usersSnap.docs) {
        report.scannedUsers += 1;

        const plansSnap = await userDoc.ref.collection("saved_plans").get();
        if (plansSnap.empty) continue;

        const allProgramPlanDocs = plansSnap.docs.filter(d => !!d.data().programId);
        if (allProgramPlanDocs.length === 0) continue;

        // reset 모드: 기존 completedAt 모두 제거 (재매칭용)
        if (reset) {
          for (const planDoc of allProgramPlanDocs) {
            if (planDoc.data().completedAt != null) {
              report.reset += 1;
              if (!dryRun) {
                try {
                  await planDoc.ref.update({
                    completedAt: null,
                  });
                } catch (e) {
                  report.errors.push(`reset ${userDoc.id}/${planDoc.id}: ${(e as Error).message}`);
                }
              }
            }
          }
        }

        // 프로그램별 × sessionNumber ASC 정렬 — 동일 운동 구성이 여러 번 나올 때 순서대로 매칭
        // Firestore 문서 순서는 랜덤이므로 반드시 sessionNumber 기준 정렬 필수
        const programGroups = new Map<string, Array<{ doc: typeof allProgramPlanDocs[number]; sessionNumber: number }>>();
        for (const planDoc of allProgramPlanDocs) {
          const data = planDoc.data();
          const programId: string = data.programId;
          const sessionNumber: number = typeof data.sessionNumber === "number" ? data.sessionNumber : 0;
          if (!programGroups.has(programId)) programGroups.set(programId, []);
          programGroups.get(programId)!.push({ doc: planDoc, sessionNumber });
        }
        for (const group of programGroups.values()) {
          group.sort((a, b) => a.sessionNumber - b.sessionNumber);
        }

        // 이미 완료된 세션 카운트 (reset 모드가 아닐 때만 유효)
        const alreadyDone = reset ? 0 : allProgramPlanDocs.filter(d => d.data().completedAt).length;
        report.alreadyCompleted += alreadyDone;

        const histSnap = await userDoc.ref.collection("workout_history").get();
        const histories = histSnap.docs.map(d => ({ id: d.id, data: d.data() }));
        const matchedHistoryIds = new Set<string>();

        for (const group of programGroups.values()) {
          // 각 프로그램 내 sessionNumber 순서대로 매칭 시도
          for (const { doc: planDoc } of group) {
            const plan = planDoc.data();
            // reset 모드에서는 모든 플랜 재매칭, 아닐 땐 이미 완료된 건 skip
            if (!reset && plan.completedAt) continue;
            report.scannedPlans += 1;

            const planExSet = exerciseNameSet(plan.sessionData?.exercises);
            if (!planExSet) { report.unmatched += 1; continue; }

            const createdAtMs = toMillis(plan.createdAt);

            // 가장 오래된 미매칭 history 선택 (해당 세션의 chronological 1:1)
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
      }

      res.status(200).json({ ok: true, dryRun, report });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      res.status(500).json({ error: msg, report });
    }
  }
);
