import { onRequest } from "firebase-functions/v2/https";
import { verifyAdmin, db } from "../helpers";
import type { ExerciseStep } from "../workoutEngine";

/**
 * 회의 64-Y (2026-04-19): Firestore 과거 workout_history 레코드 소급 재태깅
 * - runningStats.runningType "fartlek" → "vo2_interval"
 * - runningStats.runningType "sprint" → 개별 exercises name/count 기반 3-way 분기:
 *     "2km 전력"/"5km 전력"/"Time Trial"/"All-out"/"Dress Rehearsal" → "time_trial"
 *     "Norwegian"/"4×4"/"1000m"/"1600m"/"1마일" → "vo2_interval"
 *     그 외 → "sprint_interval"
 * - sessionData.exercises[].runType도 동일 로직으로 재태깅
 *
 * POST /adminMigrateRunTypeV2
 * Body: { dryRun?: boolean }
 * Admin only.
 */

interface MigrationReport {
  scannedUsers: number;
  scannedDocs: number;
  updatedDocs: number;
  fartlekToVo2: number;
  sprintToTimeTrial: number;
  sprintToVo2: number;
  sprintToSprintInterval: number;
  errors: string[];
}

function reclassifySprintBlob(blob: string): "time_trial" | "vo2_interval" | "sprint_interval" {
  if (/2km\s*전력|5km\s*전력|Time\s*Trial|All-?out|Dress\s*Rehearsal/i.test(blob)) return "time_trial";
  if (/Norwegian|4\s*×\s*4|4x4|1000m|1600m|1마일|1\s*mile/i.test(blob)) return "vo2_interval";
  return "sprint_interval";
}

function reclassifySprintFromExercises(exercises: ExerciseStep[]): "time_trial" | "vo2_interval" | "sprint_interval" {
  const blob = exercises.map(e => `${e.name ?? ""} ${e.count ?? ""}`).join(" ");
  return reclassifySprintBlob(blob);
}

export const adminMigrateRunTypeV2 = onRequest(
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

    const report: MigrationReport = {
      scannedUsers: 0,
      scannedDocs: 0,
      updatedDocs: 0,
      fartlekToVo2: 0,
      sprintToTimeTrial: 0,
      sprintToVo2: 0,
      sprintToSprintInterval: 0,
      errors: [],
    };

    try {
      const usersSnap = await db.collection("users").get();
      for (const userDoc of usersSnap.docs) {
        report.scannedUsers += 1;
        const historySnap = await userDoc.ref.collection("workout_history").get();
        for (const histDoc of historySnap.docs) {
          report.scannedDocs += 1;
          const data = histDoc.data();
          const rs = data.runningStats as { runningType?: string } | undefined;
          const exercises: ExerciseStep[] = data.sessionData?.exercises ?? [];

          let newRunningStatsType: string | null = null;
          if (rs?.runningType === "fartlek") {
            newRunningStatsType = "vo2_interval";
            report.fartlekToVo2 += 1;
          } else if (rs?.runningType === "sprint") {
            newRunningStatsType = reclassifySprintFromExercises(exercises);
            if (newRunningStatsType === "time_trial") report.sprintToTimeTrial += 1;
            else if (newRunningStatsType === "vo2_interval") report.sprintToVo2 += 1;
            else report.sprintToSprintInterval += 1;
          }

          // exercises[].runType 재태깅 — 개별 운동별로도 판정
          const updatedExercises = exercises.map(ex => {
            if (ex.runType === "fartlek") return { ...ex, runType: "vo2_interval" as const };
            if (ex.runType === "sprint") {
              const blob = `${ex.name ?? ""} ${ex.count ?? ""}`;
              return { ...ex, runType: reclassifySprintBlob(blob) };
            }
            return ex;
          });

          const hasExerciseChange = updatedExercises.some((ex, i) => ex.runType !== exercises[i]?.runType);
          if (!newRunningStatsType && !hasExerciseChange) continue;

          if (dryRun) {
            report.updatedDocs += 1;
          } else {
            try {
              const updates: Record<string, unknown> = {};
              if (newRunningStatsType) updates["runningStats.runningType"] = newRunningStatsType;
              if (hasExerciseChange) updates["sessionData.exercises"] = updatedExercises;
              await histDoc.ref.update(updates);
              report.updatedDocs += 1;
            } catch (e) {
              report.errors.push(`${userDoc.id}/${histDoc.id}: ${(e as Error).message}`);
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
