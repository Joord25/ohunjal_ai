import type { RunningType, WorkoutHistory } from "@/constants/workout";

/**
 * 회의 64-β (2026-04-19): 월간 러닝 과학 데이터 집계 유틸
 * - 자문단 (Seiler/Esteve-Lanao/Bakken/Davis/Sang) 권장 지표 7종
 * - Zone 매핑: 시간 가중 비율 (Seiler 원 논문 기준 duration-based)
 * - Kenko UI의 3 서브탭(볼륨/강도/패턴) 데이터 소스
 */

export interface MonthlyRunningStats {
  /** 이번 달 총 거리 (미터) */
  totalDistance: number;
  /** 이번 달 러닝 횟수 */
  totalRuns: number;
  /** 이번 달 총 시간 (초) */
  totalDuration: number;
  /** 평균 페이스 (sec/km). distance > 0 일 때만, 아니면 null */
  avgPace: number | null;
  /** 시간 가중 강도 분포 (각 0~1, 합=1 또는 0) */
  distribution: { low: number; mid: number; high: number };
  /** 세션 유형별 횟수 */
  sessionMix: { easy: number; long: number; tempo: number; interval: number };
  /** [월..일] 요일별 러닝 실행 여부 */
  dayPattern: boolean[];
  /** 지난 달 대비 변화. 지난 달 데이터 0이면 null */
  deltaVsLastMonth: {
    distancePct: number | null;
    paceDeltaSec: number | null;
  };
}

/** 이번 달 1일 00:00 (로컬) 밀리초 */
function startOfMonthMs(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0).getTime();
}

/** N달 전 1일 00:00 (로컬) 밀리초 */
function startOfMonthOffsetMs(d: Date, monthOffset: number): number {
  return new Date(d.getFullYear(), d.getMonth() + monthOffset, 1, 0, 0, 0, 0).getTime();
}

/** Date → 요일 인덱스 (월=0, 일=6) */
function dowIndex(d: Date): number {
  return (d.getDay() + 6) % 7;
}

/**
 * RunningType → Seiler 3-zone 매핑 (회의 64-β 자문 합의)
 * - 저(Z1): easy, long, walkrun
 * - 중(Z2): tempo, threshold
 * - 고(Z3): vo2_interval, sprint_interval, time_trial + legacy (fartlek, sprint)
 */
function runTypeToZone(runType: RunningType): "low" | "mid" | "high" {
  switch (runType) {
    case "easy":
    case "long":
    case "walkrun":
      return "low";
    case "tempo":
    case "threshold":
      return "mid";
    case "vo2_interval":
    case "sprint_interval":
    case "time_trial":
    case "fartlek":
    case "sprint":
      return "high";
    default:
      return "low";
  }
}

/**
 * RunningType → 세션 믹스 카테고리 (4가지)
 * - easy: easy, walkrun
 * - long: long
 * - tempo: tempo, threshold
 * - interval: vo2_interval, sprint_interval, time_trial + legacy
 */
function runTypeToMixCategory(runType: RunningType): "easy" | "long" | "tempo" | "interval" {
  switch (runType) {
    case "easy":
    case "walkrun":
      return "easy";
    case "long":
      return "long";
    case "tempo":
    case "threshold":
      return "tempo";
    case "vo2_interval":
    case "sprint_interval":
    case "time_trial":
    case "fartlek":
    case "sprint":
      return "interval";
    default:
      return "easy";
  }
}

/** 특정 달의 러닝 집계 (internal, 재사용) */
function aggregateMonth(
  history: WorkoutHistory[],
  startMs: number,
  endMs: number,
): { runs: number; distance: number; duration: number; durationByZone: { low: number; mid: number; high: number }; mix: { easy: number; long: number; tempo: number; interval: number }; dayPattern: boolean[] } {
  let runs = 0;
  let distance = 0;
  let duration = 0;
  const durationByZone = { low: 0, mid: 0, high: 0 };
  const mix = { easy: 0, long: 0, tempo: 0, interval: 0 };
  const dayPattern: boolean[] = [false, false, false, false, false, false, false];

  for (const h of history) {
    if (!h.runningStats) continue;
    const d = new Date(h.date);
    const t = d.getTime();
    if (isNaN(t) || t < startMs || t >= endMs) continue;

    runs += 1;
    distance += h.runningStats.distance ?? 0;
    const dur = h.runningStats.duration ?? 0;
    duration += dur;

    const zone = runTypeToZone(h.runningStats.runningType);
    durationByZone[zone] += dur;

    const cat = runTypeToMixCategory(h.runningStats.runningType);
    mix[cat] += 1;

    dayPattern[dowIndex(d)] = true;
  }

  return { runs, distance, duration, durationByZone, mix, dayPattern };
}

/**
 * 이번 달 러닝 집계 (자문단 권장 7지표)
 *
 * @param history - 전체 러닝 히스토리 (localStorage 또는 Firestore)
 * @param referenceDate - 기준 날짜. 히스토리 모드에선 세션 날짜, 라이브 리포트에선 오늘
 */
export function computeMonthlyRunningStats(
  history: WorkoutHistory[],
  referenceDate?: string,
): MonthlyRunningStats {
  const baseDate = referenceDate ? new Date(referenceDate) : new Date();
  const validDate = !isNaN(baseDate.getTime()) ? baseDate : new Date();

  const thisStartMs = startOfMonthMs(validDate);
  const nextStartMs = startOfMonthOffsetMs(validDate, 1);
  const lastStartMs = startOfMonthOffsetMs(validDate, -1);

  const thisMonth = aggregateMonth(history, thisStartMs, nextStartMs);
  const lastMonth = aggregateMonth(history, lastStartMs, thisStartMs);

  // 평균 페이스 (이번 달): 거리 > 0 세션만
  const avgPace =
    thisMonth.distance > 0 ? Math.round(thisMonth.duration / (thisMonth.distance / 1000)) : null;

  // 시간 가중 강도 분포
  const totalZonedDuration =
    thisMonth.durationByZone.low + thisMonth.durationByZone.mid + thisMonth.durationByZone.high;
  const distribution =
    totalZonedDuration > 0
      ? {
          low: thisMonth.durationByZone.low / totalZonedDuration,
          mid: thisMonth.durationByZone.mid / totalZonedDuration,
          high: thisMonth.durationByZone.high / totalZonedDuration,
        }
      : { low: 0, mid: 0, high: 0 };

  // 지난 달 대비 비교
  const distancePct =
    lastMonth.distance > 0
      ? Math.round(((thisMonth.distance - lastMonth.distance) / lastMonth.distance) * 100)
      : null;
  const lastAvgPace =
    lastMonth.distance > 0 ? Math.round(lastMonth.duration / (lastMonth.distance / 1000)) : null;
  const paceDeltaSec =
    avgPace != null && lastAvgPace != null ? avgPace - lastAvgPace : null;

  return {
    totalDistance: thisMonth.distance,
    totalRuns: thisMonth.runs,
    totalDuration: thisMonth.duration,
    avgPace,
    distribution,
    sessionMix: thisMonth.mix,
    dayPattern: thisMonth.dayPattern,
    deltaVsLastMonth: { distancePct, paceDeltaSec },
  };
}
