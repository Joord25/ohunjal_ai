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

/** slotType → 사용자 친화 부위 라벨 (회의 ζ-5 정정 2026-04-30: RPE 표시 X, 부위·세트 표시) */
function slotTypeBodyLabel(slotType: string): string {
  if (slotType.startsWith("upper_push") || slotType.startsWith("push_") || slotType.startsWith("chest_safe") || slotType === "wendler_bench_day" || slotType === "wendler_ohp_day") return "가슴";
  if (slotType.startsWith("upper_pull") || slotType.startsWith("pull_") || slotType.startsWith("back_") || slotType === "posture_thoracic_pull" || slotType === "posture_thoracic_rotation") return "등";
  if (slotType.startsWith("lower_squat") || slotType.startsWith("legs_squat") || slotType === "wendler_squat_day" || slotType === "lower_compound" || slotType === "lower_full") return "하체";
  if (slotType.startsWith("lower_hinge") || slotType.startsWith("legs_hinge") || slotType === "wendler_deadlift_day") return "하체";
  if (slotType === "lower_volume" || slotType === "lower_low") return "하체";
  if (slotType.startsWith("arms_")) return "팔";
  if (slotType === "shoulder_rehab" || slotType === "posture_scap_rotator") return "어깨";
  if (slotType === "posture_core_glute") return "코어";
  if (slotType === "starter_fullbody" || slotType === "senior_fullbody" || slotType === "fullbody_a_squat" || slotType === "fullbody_b_hinge" || slotType === "metcon_circuit") return "전신";
  if (slotType === "hiit_long_interval" || slotType === "hiit_medium_interval") return "HIIT";
  if (slotType === "upper_low_intensity" || slotType === "upper_volume" || slotType === "upper_compound") return "상체";
  return "운동";
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

      // 회의 ζ-5 정정 (2026-04-30): 등척 hold 슬롯은 holdSeconds 사용 (시간 표기 + reps=초). 그 외는 matrix.reps.
      const holdSec = meta.holdSeconds ?? 30;
      const slotReps = isStaticHold ? `${holdSec}초 유지` : matrix.reps;
      const slotRepsVal = isStaticHold ? holdSec : repsVal;
      const count = formatCountKo(matrix.sets, slotReps);

      const weight = isStaticHold || role === "bodyweight" ? "맨몸" : weightGuideForRole(role, condition.gender);

      exercises.push({
        type,
        phase,
        name: exerciseName,
        count,
        weight,
        sets: matrix.sets,
        reps: slotRepsVal,
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

  // 회의 ζ-5 정정 (2026-04-30): RPE/챕터 표시 X. 부위·종 수·세트 표시.
  const bodyLabel = slotTypeBodyLabel(matrix.slotType);
  const slotPool = CATALOG_SLOT_POOLS[matrix.slotType];
  const slotCount = matrix.slots ?? (slotPool ? slotPool.length : 0);
  return {
    title: `${catalogName} W${matrix.week} D${matrix.dayOfWeek}`,
    description: `${bodyLabel} ${slotCount}종 · ${matrix.sets}세트`,
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
