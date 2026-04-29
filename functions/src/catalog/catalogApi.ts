/**
 * Catalog Program API — 회의 ζ-5 (2026-04-30) Phase 3.
 * 러닝 generateRunningProgram 패턴 미러 — N주 분량 SavedPlan 한 번에 생성.
 *
 * 흐름:
 * 1. 클라가 catalogId + weeklyMatrix 전달
 * 2. 서버가 각 MatrixSession 마다 ExerciseStep[] 생성 (catalogPools 슬롯 풀에서 결정적 시드 랜덤)
 * 3. SavedPlan 배열 반환 (programId 로 묶음)
 * 4. 클라가 saveProgramSessions + remoteSaveProgram 으로 저장
 */
import { onRequest } from "firebase-functions/v2/https";
import { verifyAuth } from "../helpers";
import { buildWarmup, formatCountKo, type WorkoutSessionData, type ExerciseStep, type ExerciseType, type ExercisePhase, type UserCondition } from "../workoutEngine";
import { CATALOG_SLOT_POOLS, pickFromSlot, getSlotMeta, getSlotCount } from "./catalogPools";

interface MatrixSessionPayload {
  week: number;
  dayOfWeek: number;
  chapter: number;
  slotType: string;
  slots?: number;
  sets: number;
  reps: string;
  rpe: number;
  wendlerWave?: "A" | "B" | "C" | "deload";
  linearProgression?: boolean;
  finisher?: { rounds: number; workSec: number; restSec: number };
  firstSetWarmup?: boolean;
}

interface GenerateCatalogProgramBody {
  catalogId: string;
  catalogName: string;
  weeklyMatrix: MatrixSessionPayload[];
  condition: UserCondition;
}

/** reps 문자열에서 숫자 추출. "8-12" → 10 (중간값), "30s" → 30 */
function parseRepsToNumber(reps: string): number {
  // "30s 유지" or "30초 유지" 등
  if (/\d+\s*s\b|\d+\s*초/.test(reps)) {
    const m = reps.match(/(\d+)\s*(s|초)/);
    return m ? parseInt(m[1], 10) : 30;
  }
  // "8-12" 또는 "12-15회"
  const m = reps.match(/(\d+)\s*-\s*(\d+)/);
  if (m) return Math.round((parseInt(m[1], 10) + parseInt(m[2], 10)) / 2);
  // "12회"
  const single = reps.match(/(\d+)/);
  return single ? parseInt(single[1], 10) : 10;
}

/** role 별 무게 가이드 (간략) */
function weightGuideForRole(role: string, gender?: "male" | "female"): string {
  const isFemale = gender === "female";
  switch (role) {
    case "compound": return isFemale ? "빈바 15kg → 본격 무게" : "빈바 20kg → 본격 무게";
    case "accessory": return isFemale ? "(여 2kg) 덤벨 → 본격 무게" : "(남 3kg) 덤벨 → 본격 무게";
    case "isolation": return isFemale ? "(여 2kg) → 타깃 무게" : "(남 3kg) → 타깃 무게";
    case "light": return "가벼운 부하 또는 맨몸";
    case "bodyweight": return "맨몸";
    default: return "본격 무게";
  }
}

/** 단일 MatrixSession → WorkoutSessionData 생성 */
function generateSessionFromMatrix(matrix: MatrixSessionPayload, condition: UserCondition, catalogName: string): WorkoutSessionData {
  const exercises: ExerciseStep[] = [];

  // 1. Warmup (재활용)
  exercises.push(...buildWarmup(condition));

  // 2. Main — 슬롯 풀 운동
  const pool = CATALOG_SLOT_POOLS[matrix.slotType];
  if (pool && pool.length > 0) {
    const slotCount = matrix.slots ?? Math.min(getSlotCount(matrix.slotType), pool.length);
    const repsVal = parseRepsToNumber(matrix.reps);

    for (let i = 0; i < slotCount; i++) {
      const exerciseName = pickFromSlot(matrix.slotType, i, matrix.week, matrix.dayOfWeek);
      const meta = getSlotMeta(matrix.slotType, i);
      if (!exerciseName || !meta) continue;

      const isStaticHold = meta.isStaticHold === true;
      const role = meta.role;

      // type/phase 결정
      const type: ExerciseType = isStaticHold ? "core" : (role === "bodyweight" ? "strength" : "strength");
      const phase: ExercisePhase = isStaticHold ? "core" : "main";

      // count 표기 — hold 면 시간, 아니면 sets/reps
      const count = isStaticHold
        ? formatCountKo(matrix.sets, matrix.reps)
        : formatCountKo(matrix.sets, matrix.reps);

      const weight = isStaticHold || role === "bodyweight" ? "맨몸" : weightGuideForRole(role, condition.gender);

      exercises.push({
        type,
        phase,
        name: exerciseName,
        count,
        weight,
        sets: matrix.sets,
        reps: repsVal,
      });
    }
  }

  // 3. Finisher (있으면)
  if (matrix.finisher) {
    const { rounds, workSec, restSec } = matrix.finisher;
    exercises.push({
      type: "cardio",
      phase: "cardio",
      name: `Finisher ${rounds}R × ${workSec}s/${restSec}s`,
      count: `${rounds} 라운드 × ${workSec}s on / ${restSec}s off`,
      sets: rounds,
      reps: workSec,
    });
  }

  const waveLabel = matrix.wendlerWave ? ` (${matrix.wendlerWave})` : "";
  const lpLabel = matrix.linearProgression ? " · Linear" : "";
  return {
    title: `${catalogName} W${matrix.week} D${matrix.dayOfWeek}${waveLabel}`,
    description: `RPE ${matrix.rpe}${lpLabel} · 챕터 ${matrix.chapter}`,
    exercises,
    sessionMode: "balanced",
  };
}

/**
 * POST /generateCatalogProgram
 * Body: { catalogId, catalogName, weeklyMatrix, condition }
 * Returns: { ok: true, programId, programName, totalSessions, totalWeeks, sessions: SavedPlan[] }
 */
export const generateCatalogProgram = onRequest(
  { cors: true, timeoutSeconds: 120 },
  async (req, res): Promise<void> => {
    if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }
    try { await verifyAuth(req.headers.authorization); }
    catch { res.status(401).json({ error: "Unauthorized" }); return; }

    const body = (req.body ?? {}) as GenerateCatalogProgramBody;
    if (!body.catalogId || !Array.isArray(body.weeklyMatrix) || body.weeklyMatrix.length === 0) {
      res.status(400).json({ error: "catalogId and weeklyMatrix required" }); return;
    }
    if (!body.condition) {
      res.status(400).json({ error: "condition required" }); return;
    }

    try {
      const programId = `${body.catalogId}_${Date.now()}`;
      const totalSessions = body.weeklyMatrix.length;
      const totalWeeks = Math.max(...body.weeklyMatrix.map((m) => m.week));

      const sessions = body.weeklyMatrix.map((matrix, idx) => {
        const sessionData = generateSessionFromMatrix(matrix, body.condition, body.catalogName);
        return {
          id: `${programId}_w${matrix.week}d${matrix.dayOfWeek}`,
          name: `${body.catalogName} W${matrix.week} D${matrix.dayOfWeek}`,
          sessionData,
          createdAt: Date.now(),
          lastUsedAt: null,
          useCount: 0,
          programId,
          sessionNumber: idx + 1,
          totalSessions,
          programName: body.catalogName,
          completedAt: null,
          programCategory: "strength" as const,
          programGoal: body.catalogId,
          weekIndex: matrix.week,
          chapterIndex: matrix.chapter as 1 | 2 | 3,
          dayOfWeek: matrix.dayOfWeek,
          slotType: matrix.slotType,
        };
      });

      res.status(200).json({
        ok: true,
        programId,
        programName: body.catalogName,
        totalSessions,
        totalWeeks,
        sessions,
      });
    } catch (err) {
      console.error("generateCatalogProgram error:", err);
      res.status(500).json({ error: err instanceof Error ? err.message : "unknown" });
    }
  }
);
