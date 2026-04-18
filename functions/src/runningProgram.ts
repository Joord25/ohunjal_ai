/**
 * 러닝 프로그램 룰엔진 — Phase 1 인프라.
 *
 * SPEC: .planning/RUNNING_PROGRAM_SPEC.md (v1)
 * 자문 근거: Seiler (PMID 20861519) / Esteve-Lanao (PMID 17685689, 23752040) / Bakken (mariusbakken.com)
 *
 * 포함:
 * - PACE_MATRIX: 4 프로그램 × 5 페이스 타입 = 20칸
 * - 신규 세션 타입 11종 빌더
 * - judgeLimiter: 2-way limiter 판정
 * - canEnterFullSub3: Full sub-3 진입 게이트
 *
 * Phase 2에서 `generateRunningProgram()` 오케스트레이터가 이 모듈을 소비.
 */

import type { ExerciseStep, UserCondition, WorkoutHistory } from "./workoutEngine";

// ====== Program Catalog (v1: 4종 고정) ======

export type RunningProgramId = "vo2_boost" | "10k_sub_50" | "half_sub_2" | "full_sub_3";

export type PaceType = "easy" | "marathon" | "threshold" | "vo2" | "sprint";

/**
 * 목표 레이스 페이스 (초/km). VO2 프로그램은 목표 레이스 없음 → null.
 */
export const GOAL_RACE_PACE_SEC: Record<RunningProgramId, number | null> = {
  vo2_boost: null,
  "10k_sub_50": 300, // 5:00/km
  half_sub_2: 341,   // 5:41/km
  full_sub_3: 256,   // 4:16/km
};

export interface PaceRange {
  /** 초/km, inclusive lower bound */
  minSec: number;
  /** 초/km, inclusive upper bound */
  maxSec: number;
}

/**
 * 20칸 페이스 매트릭스 (초/km).
 *
 * VO2 행은 유저 최근 5K pace에 대한 상대 오프셋 — 런타임에 계산해야 하므로 여기선 offset 표기용 placeholder.
 * 실제 VO2 페이스는 `calcVo2PaceFrom5K()`로 산출.
 */
export const PACE_MATRIX: Record<Exclude<RunningProgramId, "vo2_boost">, Record<PaceType, PaceRange>> = {
  "10k_sub_50": {
    easy:      { minSec: 355, maxSec: 380 }, // 5:55-6:20/km
    marathon:  { minSec: 320, maxSec: 320 }, // 5:20/km
    threshold: { minSec: 300, maxSec: 305 }, // 5:00-5:05/km
    vo2:       { minSec: 275, maxSec: 285 }, // 4:35-4:45/km (1000m)
    sprint:    { minSec: 255, maxSec: 265 }, // 4:15-4:25/km (400m)
  },
  half_sub_2: {
    easy:      { minSec: 395, maxSec: 420 }, // 6:35-7:00/km
    marathon:  { minSec: 355, maxSec: 360 }, // 5:55-6:00/km
    threshold: { minSec: 325, maxSec: 335 }, // 5:25-5:35/km
    vo2:       { minSec: 295, maxSec: 305 }, // 4:55-5:05/km
    sprint:    { minSec: 275, maxSec: 285 }, // 4:35-4:45/km
  },
  full_sub_3: {
    // 한국 아마추어 보수 조정 (사내 러닝코치 재검증 필요) [추정 꼬리표]
    easy:      { minSec: 330, maxSec: 340 }, // 5:30-5:40/km
    marathon:  { minSec: 256, maxSec: 256 }, // 4:16/km (정의상 race pace)
    threshold: { minSec: 245, maxSec: 250 }, // 4:05-4:10/km
    vo2:       { minSec: 220, maxSec: 230 }, // 3:40-3:50/km
    sprint:    { minSec: 200, maxSec: 210 }, // 3:20-3:30/km
  },
};

/**
 * VO2 프로그램의 페이스는 유저 최근 5K 기록 대비 상대 오프셋.
 * Seiler/Esteve-Lanao/Bakken 합의 기반 오프셋.
 */
export function calcVo2PaceFrom5K(user5kPaceSec: number, type: PaceType): PaceRange {
  switch (type) {
    case "easy":      return { minSec: user5kPaceSec + 90,  maxSec: user5kPaceSec + 120 };
    case "marathon":  return { minSec: user5kPaceSec + 50,  maxSec: user5kPaceSec + 60 };
    case "threshold": return { minSec: user5kPaceSec + 25,  maxSec: user5kPaceSec + 35 };
    case "vo2":       return { minSec: user5kPaceSec - 15,  maxSec: user5kPaceSec - 10 };
    case "sprint":    return { minSec: user5kPaceSec - 60,  maxSec: user5kPaceSec - 40 };
  }
}

export function getPace(
  programId: RunningProgramId,
  type: PaceType,
  user5kPaceSec?: number,
): PaceRange | null {
  if (programId === "vo2_boost") {
    if (user5kPaceSec == null) return null;
    return calcVo2PaceFrom5K(user5kPaceSec, type);
  }
  return PACE_MATRIX[programId][type];
}

/** 페이스 초를 "mm:ss/km" 한국 표기로 */
export function formatPace(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}/km`;
}

/** 페이스 range를 "mm:ss~mm:ss/km"로 */
export function formatPaceRange(range: PaceRange): string {
  if (range.minSec === range.maxSec) return formatPace(range.minSec);
  const m1 = Math.floor(range.minSec / 60);
  const s1 = range.minSec % 60;
  const m2 = Math.floor(range.maxSec / 60);
  const s2 = range.maxSec % 60;
  return `${m1}:${s1.toString().padStart(2, "0")}~${m2}:${s2.toString().padStart(2, "0")}/km`;
}

// ====== 2-way Limiter ======

export type Limiter = "build_aerobic" | "break_ceiling";

/**
 * 2-way limiter 판정.
 * - `break_ceiling`: 6개월 이상 꾸준한 러닝 AND 30분 연속 러닝 기록 있음 → 60/30/10 분포
 * - 그 외: `build_aerobic` → 80/20 분포
 */
export function judgeLimiter(
  user: Pick<UserCondition, "runningExp6moPlus">,
  history: WorkoutHistory[],
): Limiter {
  const isVeteran = user.runningExp6moPlus === true;
  const has30min = history.some(h =>
    h.sessionData.title.includes("러닝") &&
    (h.stats.totalDurationSec ?? 0) >= 1800,
  );
  return (isVeteran && has30min) ? "break_ceiling" : "build_aerobic";
}

// ====== Full sub-3 진입 게이트 ======

export interface GateResult {
  ok: boolean;
  reasons?: string[];
  redirect?: RunningProgramId;
}

function withinLastDays(dateISO: string, days: number): boolean {
  const then = new Date(dateISO).getTime();
  if (Number.isNaN(then)) return false;
  const diffMs = Date.now() - then;
  return diffMs <= days * 86400 * 1000;
}

/**
 * 최근 N주 평균 주간 km 계산.
 * WorkoutHistory.runningStats.distance (meters)를 집계. 러닝 아닌 세션은 distance=0 → 자연히 무시.
 */
export function calcWeeklyAvgKm(history: WorkoutHistory[], weeks: number): number {
  const cutoffDays = weeks * 7;
  const recent = history.filter(h => withinLastDays(h.date, cutoffDays));
  const totalMeters = recent.reduce((sum, h) => sum + (h.runningStats?.distance ?? 0), 0);
  const totalKm = totalMeters / 1000;
  return totalKm / weeks;
}

/**
 * Full sub-3 게이트 입력. 호출자가 계산/조회해서 명시적으로 전달.
 * - `weeklyAvgKm8wk`: `calcWeeklyAvgKm(history, 8)` 결과
 * - `recentHalfMarathonSec`: 유저 프로필의 최근 Half 기록 또는 이전 Half 프로그램 완주 기록 (초)
 * - `recent30KRunWithinWeeks`: 최근 N주 내 30K+ 연속 러닝 완주 여부
 * - `recentInjury`: 최근 부상 여부
 */
export interface FullSub3GateInput {
  weeklyAvgKm8wk: number;
  recentHalfMarathonSec?: number;
  recent30KRunWithinWeeks?: number;  // 몇 주 이내 완주했나. 4 이하면 충족.
  recentInjury?: boolean;
}

/**
 * Full sub-3 진입 게이트.
 * 자문단(Bakken + Canova + Pfitzinger 기준) 합의: 베이스 부족자는 차단.
 */
export function canEnterFullSub3(input: FullSub3GateInput): GateResult {
  const reasons: string[] = [];

  if (input.weeklyAvgKm8wk < 50) {
    reasons.push(`최근 8주 평균 주간 거리 ${input.weeklyAvgKm8wk.toFixed(0)}km (필요: 50km+)`);
  }

  const halfOk = input.recentHalfMarathonSec != null && input.recentHalfMarathonSec <= 5400; // 1:30:00
  const run30Ok = input.recent30KRunWithinWeeks != null && input.recent30KRunWithinWeeks <= 4;
  if (!halfOk && !run30Ok) {
    reasons.push("최근 12주 내 Half 1:30 이하 또는 최근 4주 내 30K 연속 러닝 기록 없음");
  }

  if (input.recentInjury === true) {
    reasons.push("최근 부상 회복 중");
  }

  if (reasons.length === 0) return { ok: true };
  return { ok: false, reasons, redirect: "half_sub_2" };
}

// ====== 세션 타입 빌더 ======
// 각 빌더는 단일 ExerciseStep[] 블록을 반환. 조립은 Phase 2 오케스트레이터에서.

export type SessionTypeId =
  | "strides"
  | "threshold"
  | "threshold_2x15"
  | "intervals_400"
  | "intervals_800"
  | "intervals_1000"
  | "intervals_mile"
  | "norwegian_4x4"
  | "pure_sprints"
  | "long_with_mp"
  | "race_pace_interval"
  | "specific_long"
  | "tt_2k"
  | "tt_5k"
  | "dress_rehearsal";

/** 6-8 × 20초 전력 / 30초 걷기 (세션 꼬리 부착용) — tag-at-source: interval/sprint */
export function buildStrides(count: number = 8): ExerciseStep[] {
  return [
    { type: "cardio", phase: "main", name: "스트라이드 (Strides)", count: `20초 전력 / 30초 걷기 × ${count}`, sets: 1, reps: 1, runKind: "interval", runType: "sprint" },
  ];
}

/** 20-40분 threshold run — continuous/tempo */
export function buildThreshold(paceRange: PaceRange, durationMin: number): ExerciseStep[] {
  return [
    { type: "cardio", phase: "main", name: "Threshold Run (Tempo)", count: `${durationMin}분`, sets: 1, reps: durationMin, tempoGuide: formatPaceRange(paceRange), runKind: "continuous", runType: "tempo" },
  ];
}

/** 챕터 2 핵심: 15분 sub-T / 3분 회복 / 15분 sub-T (Bakken) */
export function buildThreshold2x15(paceRange: PaceRange): ExerciseStep[] {
  const pace = formatPaceRange(paceRange);
  return [
    { type: "cardio", phase: "main", name: "Threshold 1 (Sub-Threshold)", count: `15분`, sets: 1, reps: 15, tempoGuide: pace, runKind: "continuous", runType: "tempo" },
    { type: "cardio", phase: "main", name: "회복 조깅 (Recovery Jog)", count: "3분", sets: 1, reps: 3, runKind: "continuous", runType: "easy" },
    { type: "cardio", phase: "main", name: "Threshold 2 (Sub-Threshold)", count: `15분`, sets: 1, reps: 15, tempoGuide: pace, runKind: "continuous", runType: "tempo" },
  ];
}

/** 거리 기반 인터벌은 GPS + 3분할 UI (continuous) 가 적합 — 박서진 자문 */
export function buildIntervals400(paceRange: PaceRange, reps: number = 5): ExerciseStep[] {
  return [
    { type: "cardio", phase: "main", name: "400m 인터벌 (400m Intervals)", count: `400m × ${reps}`, sets: reps, reps: 1, tempoGuide: `${formatPaceRange(paceRange)} / 2분 조깅 회복`, runKind: "continuous", runType: "sprint" },
  ];
}

export function buildIntervals800(paceRange: PaceRange, reps: number = 3): ExerciseStep[] {
  return [
    { type: "cardio", phase: "main", name: "800m 인터벌 (800m Intervals)", count: `800m × ${reps}`, sets: reps, reps: 1, tempoGuide: `${formatPaceRange(paceRange)} / 3분 조깅 회복`, runKind: "continuous", runType: "sprint" },
  ];
}

export function buildIntervals1000(paceRange: PaceRange, reps: number = 5): ExerciseStep[] {
  return [
    { type: "cardio", phase: "main", name: "1000m 인터벌 (1000m Intervals)", count: `1000m × ${reps}`, sets: reps, reps: 1, tempoGuide: `${formatPaceRange(paceRange)} / 3분 조깅 회복`, runKind: "continuous", runType: "sprint" },
  ];
}

export function buildIntervalsMile(paceRange: PaceRange, reps: number = 2): ExerciseStep[] {
  return [
    { type: "cardio", phase: "main", name: "1마일 인터벌 (Mile Intervals)", count: `1600m × ${reps}`, sets: reps, reps: 1, tempoGuide: `${formatPaceRange(paceRange)} / 4분 조깅 회복`, runKind: "continuous", runType: "sprint" },
  ];
}

/** Norwegian 4×4: 4분 시간 기반 × 4라운드 — interval UI (fartlek 유사) */
export function buildNorwegian4x4(paceRange: PaceRange): ExerciseStep[] {
  return [
    { type: "cardio", phase: "main", name: "Norwegian 4×4 (Norwegian 4×4)", count: `4분 @ ${formatPaceRange(paceRange)} / 4분 회복 × 4`, sets: 4, reps: 1, runKind: "interval", runType: "fartlek" },
  ];
}

export function buildPureSprints(reps: number = 6): ExerciseStep[] {
  return [
    { type: "cardio", phase: "main", name: "전력 스프린트 (Pure Sprints)", count: `20-30초 100% / 2분 완전 회복 × ${reps}`, sets: reps, reps: 1, runKind: "interval", runType: "sprint" },
  ];
}

/**
 * Long with MP block (챕터 2 Sun): 90-110분 Z1, 마지막 20-30분 MP.
 */
export function buildLongWithMP(
  totalMin: number,
  mpDurationMin: number,
  easyPaceRange: PaceRange,
  marathonPaceRange: PaceRange,
): ExerciseStep[] {
  const easyMin = totalMin - mpDurationMin;
  return [
    { type: "cardio", phase: "main", name: "장거리 Z1 구간 (Long Z1 Segment)", count: `${easyMin}분`, sets: 1, reps: easyMin, tempoGuide: formatPaceRange(easyPaceRange), runKind: "continuous", runType: "long" },
    { type: "cardio", phase: "main", name: "Marathon Pace 블록 (MP Block)", count: `${mpDurationMin}분`, sets: 1, reps: mpDurationMin, tempoGuide: formatPaceRange(marathonPaceRange), runKind: "continuous", runType: "tempo" },
  ];
}

/**
 * Race-pace interval (챕터 3 Tue): 10K 2000m×4 / Half 3000m×3 / Full 5K×4 @ goal.
 */
export function buildRacePaceInterval(
  programId: RunningProgramId,
  paceRange: PaceRange,
): ExerciseStep[] {
  let repDistance: string;
  let reps: number;
  let recovery: string;

  if (programId === "10k_sub_50") {
    repDistance = "2000m"; reps = 4; recovery = "3분 조깅";
  } else if (programId === "half_sub_2") {
    repDistance = "3000m"; reps = 3; recovery = "4분 조깅";
  } else if (programId === "full_sub_3") {
    repDistance = "5000m"; reps = 4; recovery = "5분 조깅";
  } else {
    // vo2_boost: 1000m × 5
    repDistance = "1000m"; reps = 5; recovery = "3분 조깅";
  }

  return [
    { type: "cardio", phase: "main", name: "레이스 페이스 인터벌 (Race-Pace Interval)", count: `${repDistance} × ${reps}`, sets: reps, reps: 1, tempoGuide: `${formatPaceRange(paceRange)} / ${recovery} 회복`, runKind: "continuous", runType: "tempo" },
  ];
}

/**
 * Specific long (챕터 3 Sun): Full 32K (70% MP → 마지막 8K MP) / Half 20K MP-effort / 10K 15K easy.
 */
export function buildSpecificLong(
  programId: RunningProgramId,
  easyPaceRange: PaceRange,
  marathonPaceRange: PaceRange,
): ExerciseStep[] {
  if (programId === "full_sub_3") {
    return [
      { type: "cardio", phase: "main", name: "장거리 Z1 구간 (Long Z1 24K)", count: `24km`, sets: 1, reps: 1, tempoGuide: formatPaceRange(easyPaceRange), runKind: "continuous", runType: "long" },
      { type: "cardio", phase: "main", name: "Marathon Pace 마무리 (MP 8K)", count: `8km`, sets: 1, reps: 1, tempoGuide: formatPaceRange(marathonPaceRange), runKind: "continuous", runType: "tempo" },
    ];
  }
  if (programId === "half_sub_2") {
    return [
      { type: "cardio", phase: "main", name: "Half 시뮬레이션 (Half Simulation 20K)", count: `20km`, sets: 1, reps: 1, tempoGuide: `${formatPaceRange(marathonPaceRange)} 근처`, runKind: "continuous", runType: "tempo" },
    ];
  }
  if (programId === "10k_sub_50") {
    return [
      { type: "cardio", phase: "main", name: "장거리 Z1 (Long Z1 15K)", count: `15km`, sets: 1, reps: 1, tempoGuide: formatPaceRange(easyPaceRange), runKind: "continuous", runType: "long" },
    ];
  }
  // vo2_boost: 표준 LSD
  return [
    { type: "cardio", phase: "main", name: "장거리 Z1 러닝 (Long Z1 Run)", count: `75분`, sets: 1, reps: 75, tempoGuide: formatPaceRange(easyPaceRange), runKind: "continuous", runType: "long" },
  ];
}

/**
 * 2K Time Trial (챕터 경계 TT): 1주차 시작 + 4주차 끝.
 */
export function buildTT2K(): ExerciseStep[] {
  return [
    { type: "warmup", phase: "warmup", name: "워밍업 조깅 (Warm-up Jog)", count: "10분", sets: 1, reps: 10 },
    { type: "cardio", phase: "main", name: "2km 전력 (2K All-out)", count: "2km", sets: 1, reps: 1, tempoGuide: "전력 질주 — 기록 측정", runKind: "continuous", runType: "sprint" },
    { type: "cardio", phase: "cardio", name: "쿨다운 조깅 (Cool-down Jog)", count: "10분", sets: 1, reps: 10 },
  ];
}

/**
 * 5K Time Trial (8주차 끝 — 챕터 2 완주 지표).
 */
export function buildTT5K(): ExerciseStep[] {
  return [
    { type: "warmup", phase: "warmup", name: "워밍업 조깅 (Warm-up Jog)", count: "15분", sets: 1, reps: 15 },
    { type: "cardio", phase: "main", name: "5km 전력 (5K All-out)", count: "5km", sets: 1, reps: 1, tempoGuide: "전력 질주 — 기록 측정", runKind: "continuous", runType: "sprint" },
    { type: "cardio", phase: "cardio", name: "쿨다운 조깅 (Cool-down Jog)", count: "10분", sets: 1, reps: 10 },
  ];
}

/**
 * Dress Rehearsal (10주차 끝): 목표 페이스로 50-70% race 거리.
 */
export function buildDressRehearsal(
  programId: RunningProgramId,
  goalPaceRange: PaceRange,
): ExerciseStep[] {
  let distanceKm: number;
  if (programId === "full_sub_3") distanceKm = 21;
  else if (programId === "half_sub_2") distanceKm = 15;
  else if (programId === "10k_sub_50") distanceKm = 8;
  else distanceKm = 5; // vo2_boost

  return [
    { type: "warmup", phase: "warmup", name: "워밍업 조깅 (Warm-up Jog)", count: "15분", sets: 1, reps: 15 },
    { type: "cardio", phase: "main", name: "드레스 리허설 (Dress Rehearsal)", count: `${distanceKm}km`, sets: 1, reps: 1, tempoGuide: `${formatPaceRange(goalPaceRange)} — 목표 페이스 검증`, runKind: "continuous", runType: "tempo" },
    { type: "cardio", phase: "cardio", name: "쿨다운 조깅 (Cool-down Jog)", count: "10분", sets: 1, reps: 10 },
  ];
}

// ====== Chapter Structure ======

export type ChapterPhase = "base" | "build" | "peak_taper";

export interface ChapterMeta {
  index: 1 | 2 | 3;
  phase: ChapterPhase;
  startWeek: number;
  endWeek: number;
  /** 경계 TT 세션 ID. 챕터 끝 주차 마지막 날에 편성. */
  boundaryTT: SessionTypeId | null;
  /** 배지 라벨 (UI 표시용) */
  completionBadge: string;
}

export const CHAPTER_STRUCTURES: Record<RunningProgramId, ChapterMeta[]> = {
  vo2_boost: [
    { index: 1, phase: "base",       startWeek: 1, endWeek: 4, boundaryTT: "tt_2k",  completionBadge: "Base Complete" },
    { index: 2, phase: "peak_taper", startWeek: 5, endWeek: 8, boundaryTT: "tt_5k",  completionBadge: "VO2 Unlocked" },
  ],
  "10k_sub_50": [
    { index: 1, phase: "base",       startWeek: 1, endWeek: 4,  boundaryTT: "tt_2k",           completionBadge: "Base Complete" },
    { index: 2, phase: "build",      startWeek: 5, endWeek: 8,  boundaryTT: "tt_5k",           completionBadge: "Threshold Unlocked" },
    { index: 3, phase: "peak_taper", startWeek: 9, endWeek: 10, boundaryTT: "dress_rehearsal", completionBadge: "Sub-50 Ready" },
  ],
  half_sub_2: [
    { index: 1, phase: "base",       startWeek: 1,  endWeek: 4,  boundaryTT: "tt_2k",           completionBadge: "Base Complete" },
    { index: 2, phase: "build",      startWeek: 5,  endWeek: 8,  boundaryTT: "tt_5k",           completionBadge: "Threshold Unlocked" },
    { index: 3, phase: "peak_taper", startWeek: 9,  endWeek: 12, boundaryTT: "dress_rehearsal", completionBadge: "Sub-2 Ready" },
  ],
  full_sub_3: [
    { index: 1, phase: "base",       startWeek: 1,  endWeek: 4,  boundaryTT: "tt_2k",           completionBadge: "Base Complete" },
    { index: 2, phase: "build",      startWeek: 5,  endWeek: 8,  boundaryTT: "tt_5k",           completionBadge: "Threshold Unlocked" },
    { index: 3, phase: "peak_taper", startWeek: 9,  endWeek: 12, boundaryTT: "dress_rehearsal", completionBadge: "Sub-3 Ready" },
  ],
};

/**
 * 주차 → 해당 챕터 메타 찾기.
 */
export function findChapter(programId: RunningProgramId, weekIndex: number): ChapterMeta | null {
  return CHAPTER_STRUCTURES[programId].find(c => weekIndex >= c.startWeek && weekIndex <= c.endWeek) ?? null;
}

export function getProgramWeeks(programId: RunningProgramId): number {
  const chapters = CHAPTER_STRUCTURES[programId];
  return chapters[chapters.length - 1].endWeek;
}

// ====== Weekly Template Sequences ======
// peak_taper 챕터 내부 phase 결정 (race week vs taper week vs peak week)

export type WeekPhase = "base" | "build" | "peak" | "taper" | "race" | "tt_5k_week";

export function getWeekPhase(programId: RunningProgramId, weekIndex: number): WeekPhase {
  const chapter = findChapter(programId, weekIndex);
  if (!chapter) return "base";
  if (chapter.phase === "base") return "base";
  if (chapter.phase === "build") return "build";
  // peak_taper
  const totalWeeks = getProgramWeeks(programId);
  if (programId === "vo2_boost" && weekIndex === totalWeeks) return "tt_5k_week";
  if (weekIndex === totalWeeks) return "race";
  const ch3Length = chapter.endWeek - chapter.startWeek + 1;
  // 2주 챕터 (10K): taper 1주 생략, peak + race 구조
  if (ch3Length <= 2) return "peak";
  if (weekIndex === totalWeeks - 1) return "taper";
  return "peak";
}

export type DaysPerWeek = 3 | 4 | 5;

/** 주간 훈련 요일 매핑 (ISO: 월=1, 일=7) */
export function getTrainingDays(daysPerWeek: DaysPerWeek): number[] {
  if (daysPerWeek === 3) return [2, 4, 7];       // Tue/Thu/Sun
  if (daysPerWeek === 4) return [2, 4, 6, 7];    // Tue/Thu/Sat/Sun
  return [2, 3, 4, 6, 7];                        // Tue/Wed/Thu/Sat/Sun (Wed recovery)
}

type SlotType =
  | "easy"
  | "easy_recovery"
  | "easy_long"
  | "vo2_short_400"
  | "vo2_long_1000"
  | "threshold_2x15"
  | "threshold_2x12"
  | "long_with_mp"
  | "specific_long"
  | "race_pace_interval"
  | "taper_race_pace_short"
  | "taper_easy_strides"
  | "taper_short_strides"
  | "rest_or_race"
  | "tt_2k"
  | "tt_5k"
  | "dress_rehearsal";

function baseSequence(days: DaysPerWeek): SlotType[] {
  if (days === 3) return ["easy", "vo2_short_400", "easy_long"];
  if (days === 4) return ["easy", "vo2_short_400", "easy", "easy_long"];
  return ["easy", "vo2_short_400", "easy_recovery", "easy", "easy_long"];
}

function buildSequence(days: DaysPerWeek): SlotType[] {
  if (days === 3) return ["threshold_2x15", "vo2_long_1000", "long_with_mp"];
  if (days === 4) return ["threshold_2x15", "vo2_long_1000", "easy", "long_with_mp"];
  return ["threshold_2x15", "easy_recovery", "vo2_long_1000", "easy", "long_with_mp"];
}

function peakSequence(days: DaysPerWeek): SlotType[] {
  if (days === 3) return ["race_pace_interval", "threshold_2x12", "specific_long"];
  if (days === 4) return ["race_pace_interval", "threshold_2x12", "easy", "specific_long"];
  return ["race_pace_interval", "easy_recovery", "threshold_2x12", "easy", "specific_long"];
}

function taperSequence(days: DaysPerWeek, isRaceWeek: boolean): SlotType[] {
  if (isRaceWeek) {
    if (days === 3) return ["taper_race_pace_short", "taper_easy_strides", "rest_or_race"];
    if (days === 4) return ["taper_race_pace_short", "taper_easy_strides", "taper_short_strides", "rest_or_race"];
    return ["taper_race_pace_short", "easy_recovery", "taper_easy_strides", "taper_short_strides", "rest_or_race"];
  }
  if (days === 3) return ["taper_race_pace_short", "taper_easy_strides", "easy_long"];
  if (days === 4) return ["taper_race_pace_short", "taper_easy_strides", "easy", "easy_long"];
  return ["taper_race_pace_short", "easy_recovery", "taper_easy_strides", "easy", "easy_long"];
}

function tt5KWeekSequence(days: DaysPerWeek): SlotType[] {
  if (days === 3) return ["easy", "taper_easy_strides", "tt_5k"];
  if (days === 4) return ["easy", "taper_easy_strides", "easy_recovery", "tt_5k"];
  return ["easy", "easy_recovery", "taper_easy_strides", "easy_recovery", "tt_5k"];
}

/** 해당 주차의 SlotType[] (TT/dress 주차 경계 삽입 포함) */
export function getWeeklySlots(
  programId: RunningProgramId,
  weekIndex: number,
  days: DaysPerWeek,
): SlotType[] {
  const phase = getWeekPhase(programId, weekIndex);
  const totalWeeks = getProgramWeeks(programId);

  let seq: SlotType[];
  if (phase === "base") seq = baseSequence(days);
  else if (phase === "build") seq = buildSequence(days);
  else if (phase === "peak") seq = peakSequence(days);
  else if (phase === "taper") seq = taperSequence(days, false);
  else if (phase === "race") seq = taperSequence(days, true);
  else if (phase === "tt_5k_week") seq = tt5KWeekSequence(days);
  else seq = baseSequence(days);

  // 주차 경계 TT/Dress 삽입 — 마지막 슬롯 교체
  const isChapterBoundaryLast = (programId: RunningProgramId, w: number): SlotType | null => {
    const chapter = findChapter(programId, w);
    if (!chapter) return null;
    if (w !== chapter.endWeek) return null;
    if (chapter.boundaryTT === "tt_2k") return "tt_2k";
    if (chapter.boundaryTT === "tt_5k") return "tt_5k";
    if (chapter.boundaryTT === "dress_rehearsal") return "dress_rehearsal";
    return null;
  };

  // Dress Rehearsal은 "race 전 2주차" Sun에 배치 (SPEC §11.6)
  // - 10k (10주): Week 9 마지막 슬롯
  // - half/full (12주): Week 10 마지막 슬롯
  const dressWeek = totalWeeks === 10 ? 9 : totalWeeks === 12 ? 10 : -1;

  if (weekIndex === dressWeek && programId !== "vo2_boost") {
    seq = [...seq];
    seq[seq.length - 1] = "dress_rehearsal";
    return seq;
  }

  // 챕터 경계 (TT 2K/5K)
  const boundary = isChapterBoundaryLast(programId, weekIndex);
  if (boundary === "tt_2k" || boundary === "tt_5k") {
    seq = [...seq];
    seq[seq.length - 1] = boundary;
  }

  // Week 1 Day 1 초기 TT — 첫 세션 교체
  if (weekIndex === 1) {
    seq = [...seq];
    seq[0] = "tt_2k";
  }

  return seq;
}

// ====== SlotType → ExerciseStep[] 변환 ======

function simpleWarmup(minutes: number): ExerciseStep[] {
  return [{ type: "warmup", phase: "warmup", name: "준비 조깅 (Warm-up Jog)", count: `${minutes}분`, sets: 1, reps: minutes }];
}

function simpleCooldown(minutes: number = 5): ExerciseStep[] {
  return [{ type: "cardio", phase: "cardio", name: "마무리 조깅 (Cool-down Jog)", count: `${minutes}분`, sets: 1, reps: minutes }];
}

export interface ProgramSessionSpec {
  sessionNumber: number;   // 1-based, 프로그램 전체 순번
  weekIndex: number;       // 1-based
  dayOfWeek: number;       // 1-7 (월=1, 일=7)
  chapterIndex: 1 | 2 | 3;
  slotType: SlotType;
  title: string;
  description: string;
  exercises: ExerciseStep[];
  targetPaceSec: number | null; // 해당 세션의 목표 페이스 중앙값 (min+max)/2. Rest/TT는 null.
  intendedIntensity: "high" | "moderate" | "low";
}

function avgPace(range: PaceRange | null): number | null {
  if (!range) return null;
  return Math.round((range.minSec + range.maxSec) / 2);
}

function buildSessionFromSlot(
  slot: SlotType,
  programId: RunningProgramId,
  user5kPaceSec: number | undefined,
): {
  title: string;
  description: string;
  exercises: ExerciseStep[];
  targetPaceSec: number | null;
  intendedIntensity: "high" | "moderate" | "low";
} {
  const easyP = getPace(programId, "easy", user5kPaceSec);
  const mP = getPace(programId, "marathon", user5kPaceSec);
  const thP = getPace(programId, "threshold", user5kPaceSec);
  const vo2P = getPace(programId, "vo2", user5kPaceSec);
  // sprint pace는 v1에서 직접 사용 슬롯 없음 (pure_sprints 빌더만 존재). 추후 확장 시 참조.

  switch (slot) {
    case "easy":
      return {
        title: "이지 런",
        description: "대화 가능한 유산소 러닝",
        exercises: [
          ...simpleWarmup(5),
          { type: "cardio", phase: "main", name: "이지 런 (Easy Run)", count: `40분`, sets: 1, reps: 40, tempoGuide: easyP ? formatPaceRange(easyP) : "대화 가능 속도", runKind: "continuous", runType: "easy" },
          ...simpleCooldown(5),
        ],
        targetPaceSec: avgPace(easyP),
        intendedIntensity: "low",
      };
    case "easy_recovery":
      return {
        title: "회복 런",
        description: "가벼운 유산소 회복 러닝",
        exercises: [
          { type: "cardio", phase: "main", name: "회복 조깅 (Recovery Jog)", count: "30분", sets: 1, reps: 30, tempoGuide: "매우 편한 속도", runKind: "continuous", runType: "easy" },
        ],
        targetPaceSec: null,
        intendedIntensity: "low",
      };
    case "easy_long": {
      const minutes = programId === "full_sub_3" || programId === "half_sub_2" ? 80 : 70;
      return {
        title: "장거리 이지 런",
        description: `${minutes}분 Z1 기반 유산소 러닝`,
        exercises: [
          ...simpleWarmup(5),
          { type: "cardio", phase: "main", name: "장거리 Z1 러닝 (Long Easy Run)", count: `${minutes}분`, sets: 1, reps: minutes, tempoGuide: easyP ? formatPaceRange(easyP) : "대화 가능 속도", runKind: "continuous", runType: "long" },
          ...simpleCooldown(5),
        ],
        targetPaceSec: avgPace(easyP),
        intendedIntensity: "moderate",
      };
    }
    case "vo2_short_400":
      return {
        title: "VO2 짧은 인터벌",
        description: "400m × 6~8 인터벌 러닝, VO2 max 자극",
        exercises: [
          ...simpleWarmup(10),
          ...buildIntervals400(vo2P ?? { minSec: 240, maxSec: 260 }, 7),
          ...simpleCooldown(8),
        ],
        targetPaceSec: avgPace(vo2P),
        intendedIntensity: "high",
      };
    case "vo2_long_1000":
      return {
        title: "VO2 긴 인터벌",
        description: "1000m × 5 인터벌 러닝, VO2 max 극대 자극",
        exercises: [
          ...simpleWarmup(12),
          ...buildIntervals1000(vo2P ?? { minSec: 240, maxSec: 260 }, 5),
          ...simpleCooldown(8),
        ],
        targetPaceSec: avgPace(vo2P),
        intendedIntensity: "high",
      };
    case "threshold_2x15":
      return {
        title: "Threshold 2×15",
        description: "sub-threshold 러닝 15분씩 두 번 (Bakken 핵심)",
        exercises: [
          ...simpleWarmup(10),
          ...buildThreshold2x15(thP ?? { minSec: 270, maxSec: 290 }),
          ...simpleCooldown(8),
        ],
        targetPaceSec: avgPace(thP),
        intendedIntensity: "high",
      };
    case "threshold_2x12": {
      const thPace = thP ? formatPaceRange(thP) : "아슬아슬 속도";
      return {
        title: "Threshold 2×12",
        description: "강도 유지 · 양 감소 Threshold 러닝 (챕터 3 peak)",
        exercises: [
          ...simpleWarmup(10),
          { type: "cardio", phase: "main", name: "Threshold 1 (Sub-T)", count: `12분`, sets: 1, reps: 12, tempoGuide: thPace, runKind: "continuous", runType: "tempo" },
          { type: "cardio", phase: "main", name: "회복 조깅 (Recovery Jog)", count: "3분", sets: 1, reps: 3, runKind: "continuous", runType: "easy" },
          { type: "cardio", phase: "main", name: "Threshold 2 (Sub-T)", count: `12분`, sets: 1, reps: 12, tempoGuide: thPace, runKind: "continuous", runType: "tempo" },
          ...simpleCooldown(8),
        ],
        targetPaceSec: avgPace(thP),
        intendedIntensity: "high",
      };
    }
    case "long_with_mp": {
      const totalMin = programId === "full_sub_3" ? 110 : 100;
      const mpMin = programId === "full_sub_3" ? 30 : 25;
      return {
        title: "Long Run + MP Block",
        description: `${totalMin}분 장거리 러닝, 마지막 ${mpMin}분 Marathon Pace 유산소`,
        exercises: [
          ...simpleWarmup(5),
          ...buildLongWithMP(totalMin, mpMin, easyP ?? { minSec: 360, maxSec: 400 }, mP ?? { minSec: 320, maxSec: 340 }),
          ...simpleCooldown(5),
        ],
        targetPaceSec: avgPace(mP),
        intendedIntensity: "high",
      };
    }
    case "specific_long":
      return {
        title: "Specific Long Run",
        description: "레이스 distance-specific 장거리 러닝",
        exercises: [
          ...simpleWarmup(5),
          ...buildSpecificLong(programId, easyP ?? { minSec: 360, maxSec: 400 }, mP ?? { minSec: 320, maxSec: 340 }),
          ...simpleCooldown(5),
        ],
        targetPaceSec: avgPace(mP),
        intendedIntensity: "high",
      };
    case "race_pace_interval": {
      const goalPaceForInterval = programId === "vo2_boost" ? (vo2P ?? { minSec: 240, maxSec: 260 }) : (mP ?? { minSec: 300, maxSec: 300 });
      return {
        title: "레이스 페이스 인터벌",
        description: "목표 페이스 러닝 감각 박기",
        exercises: [
          ...simpleWarmup(10),
          ...buildRacePaceInterval(programId, goalPaceForInterval),
          ...simpleCooldown(8),
        ],
        targetPaceSec: avgPace(goalPaceForInterval),
        intendedIntensity: "high",
      };
    }
    case "taper_race_pace_short":
      return {
        title: "Taper 레이스 감각",
        description: "1000m × 3 인터벌 러닝, 짧게 감각만 유지",
        exercises: [
          ...simpleWarmup(10),
          ...buildIntervals1000(mP ?? { minSec: 300, maxSec: 300 }, 3),
          ...simpleCooldown(8),
        ],
        targetPaceSec: avgPace(mP),
        intendedIntensity: "moderate",
      };
    case "taper_easy_strides":
      return {
        title: "이지 런 + 스트라이드",
        description: "30분 이지 런 + 스트라이드 러닝 6회",
        exercises: [
          { type: "cardio", phase: "main", name: "이지 런 (Easy Run)", count: `30분`, sets: 1, reps: 30, tempoGuide: easyP ? formatPaceRange(easyP) : "편한 속도", runKind: "continuous", runType: "easy" },
          ...buildStrides(6),
        ],
        targetPaceSec: avgPace(easyP),
        intendedIntensity: "low",
      };
    case "taper_short_strides":
      return {
        title: "짧은 러닝 + 스트라이드",
        description: "20분 유산소 + 100m × 4 스트라이드 러닝",
        exercises: [
          { type: "cardio", phase: "main", name: "짧은 이지 러닝 (Short Easy Run)", count: "20분", sets: 1, reps: 20, runKind: "continuous", runType: "easy" },
          { type: "cardio", phase: "main", name: "스트라이드 100m × 4 (Strides 100m × 4)", count: "100m × 4", sets: 4, reps: 1, tempoGuide: "전력, 2분 회복", runKind: "interval", runType: "sprint" },
        ],
        targetPaceSec: null,
        intendedIntensity: "low",
      };
    case "rest_or_race":
      return {
        title: "레이스 당일 또는 휴식",
        description: "레이스 당일 러닝 또는 컨디션별 완전 휴식",
        exercises: [
          { type: "mobility", phase: "warmup", name: "레이스 당일 또는 완전 휴식 (Race Day or Rest)", count: "컨디션별 자율", sets: 1, reps: 1 },
        ],
        targetPaceSec: mP ? avgPace(mP) : null,
        intendedIntensity: "low",
      };
    case "tt_2k":
      return {
        title: "2K Time Trial — 기준점 측정",
        description: "2km 전력 러닝 + 워밍업/쿨다운 유산소",
        exercises: buildTT2K(),
        targetPaceSec: null,
        intendedIntensity: "high",
      };
    case "tt_5k":
      return {
        title: "5K Time Trial — Threshold 해방",
        description: "5km 전력 러닝 + 워밍업/쿨다운 유산소",
        exercises: buildTT5K(),
        targetPaceSec: null,
        intendedIntensity: "high",
      };
    case "dress_rehearsal":
      return {
        title: "Dress Rehearsal — 목표 페이스 검증",
        description: "레이스 페이스 러닝 시뮬레이션 (최종 점검)",
        exercises: buildDressRehearsal(programId, mP ?? { minSec: 300, maxSec: 300 }),
        targetPaceSec: avgPace(mP),
        intendedIntensity: "high",
      };
  }
}

// ====== 프로그램 전체 생성 오케스트레이터 ======

export interface GenerateProgramArgs {
  programId: RunningProgramId;
  limiter: Limiter;
  daysPerWeek: DaysPerWeek;
  user5kPaceSec?: number; // VO2 프로그램 필수
}

export interface GeneratedProgram {
  programId: RunningProgramId;
  limiter: Limiter;
  daysPerWeek: DaysPerWeek;
  totalWeeks: number;
  totalSessions: number;
  programName: string; // UI 표시용 한글명
  sessions: ProgramSessionSpec[];
}

const PROGRAM_NAMES: Record<RunningProgramId, string> = {
  vo2_boost: "VO2 max 키우기",
  "10k_sub_50": "10K 50분 돌파",
  half_sub_2: "Half 2시간 돌파",
  full_sub_3: "Full 3시간 돌파",
};

/**
 * 프로그램 전체 세션 생성.
 * VO2 프로그램인데 user5kPaceSec 없으면 에러.
 */
export function generateRunningProgram(args: GenerateProgramArgs): GeneratedProgram {
  const { programId, limiter, daysPerWeek, user5kPaceSec } = args;

  if (programId === "vo2_boost" && user5kPaceSec == null) {
    throw new Error("VO2 max 프로그램은 최근 5K 기록이 필요합니다");
  }

  const totalWeeks = getProgramWeeks(programId);
  const trainingDays = getTrainingDays(daysPerWeek);
  const sessions: ProgramSessionSpec[] = [];

  let sessionNumber = 1;
  for (let w = 1; w <= totalWeeks; w++) {
    const chapter = findChapter(programId, w);
    const chapterIndex = (chapter?.index ?? 1) as 1 | 2 | 3;
    const slots = getWeeklySlots(programId, w, daysPerWeek);

    for (let d = 0; d < slots.length; d++) {
      const slot = slots[d];
      const dayOfWeek = trainingDays[d];
      const spec = buildSessionFromSlot(slot, programId, user5kPaceSec);

      sessions.push({
        sessionNumber,
        weekIndex: w,
        dayOfWeek,
        chapterIndex,
        slotType: slot,
        title: spec.title,
        description: spec.description,
        exercises: spec.exercises,
        targetPaceSec: spec.targetPaceSec,
        intendedIntensity: spec.intendedIntensity,
      });
      sessionNumber++;
    }
  }

  return {
    programId,
    limiter,
    daysPerWeek,
    totalWeeks,
    totalSessions: sessions.length,
    programName: PROGRAM_NAMES[programId],
    sessions,
  };
}
