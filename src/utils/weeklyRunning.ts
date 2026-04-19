import type { RunningStats, WorkoutHistory } from "@/constants/workout";

/**
 * 회의 64-α (2026-04-19): 주간 러닝 통계 유틸
 * - 이번 주 월요일 00:00 ~ 현재 범위 누적
 * - 현재 세션이 히스토리에 없으면 추가 반영 (라이브 리포트에서 즉시 반영 목적)
 * - Kenko Activity Ring에 쓸 `weeklyGoalKm` (기본 20km) 동반 반환
 */
export interface WeeklyRunningStats {
  /** 이번 주 러닝 세션 수 */
  runs: number;
  /** 이번 주 총 거리 (m) */
  totalDistance: number;
  /** 이번 주 총 시간 (초) */
  totalDuration: number;
  /** 평균 페이스 (sec/km) — 거리 > 0일 때만 계산, 아니면 null */
  avgPace: number | null;
  /** [월,화,수,목,금,토,일] — 해당 요일에 러닝 있으면 true */
  daysRun: boolean[];
  /** 주간 거리 목표 (km). v1: 고정 20km */
  weeklyGoalKm: number;
}

/** 이번 주 월요일 00:00 (로컬) ms */
function weekMondayMs(now: Date): number {
  const d = new Date(now);
  const dow = (d.getDay() + 6) % 7; // 월=0 ~ 일=6
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - dow);
  return d.getTime();
}

/** Date → 요일 인덱스 (월=0 ~ 일=6) */
function dowIndex(d: Date): number {
  return (d.getDay() + 6) % 7;
}

export function computeWeeklyRunningStats(
  recentHistory: WorkoutHistory[],
  currentRunningStats: RunningStats | null | undefined,
): WeeklyRunningStats {
  const now = new Date();
  const monday = weekMondayMs(now);

  let runs = 0;
  let totalDistance = 0;
  let totalDuration = 0;
  const daysRun: boolean[] = [false, false, false, false, false, false, false];

  for (const h of recentHistory) {
    if (!h.runningStats) continue;
    const d = new Date(h.date);
    if (d.getTime() < monday) continue;
    runs += 1;
    totalDistance += h.runningStats.distance ?? 0;
    totalDuration += h.runningStats.duration ?? 0;
    daysRun[dowIndex(d)] = true;
  }

  // 오늘 세션이 히스토리에 아직 없으면 추가 (라이브 리포트 대응)
  const todayStr = now.toISOString().slice(0, 10);
  const alreadyInHistory = recentHistory.some(
    (h) => h.runningStats && typeof h.date === "string" && h.date.startsWith(todayStr),
  );
  if (!alreadyInHistory && currentRunningStats) {
    runs += 1;
    totalDistance += currentRunningStats.distance ?? 0;
    totalDuration += currentRunningStats.duration ?? 0;
    daysRun[dowIndex(now)] = true;
  }

  const avgPace =
    totalDistance > 0 ? Math.round(totalDuration / (totalDistance / 1000)) : null;

  return {
    runs,
    totalDistance,
    totalDuration,
    avgPace,
    daysRun,
    weeklyGoalKm: 20,
  };
}
