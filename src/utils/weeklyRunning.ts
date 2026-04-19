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
  sessionDate?: string,
): WeeklyRunningStats {
  const now = new Date();
  const monday = weekMondayMs(now);

  // 현재 뷰가 히스토리 모드면 해당 세션 날짜, 아니면 today
  const currentDate = sessionDate ? new Date(sessionDate) : now;

  let runs = 0;
  let totalDistance = 0;
  let totalDuration = 0;
  const daysRun: boolean[] = [false, false, false, false, false, false, false];

  // 중복 추가 방지용 matched set (히스토리에서 처리된 record id들)
  const processedIds = new Set<string>();

  for (const h of recentHistory) {
    if (!h.runningStats) continue;
    const d = new Date(h.date);
    if (isNaN(d.getTime()) || d.getTime() < monday) continue;
    if (h.id) processedIds.add(h.id);
    runs += 1;
    totalDistance += h.runningStats.distance ?? 0;
    totalDuration += h.runningStats.duration ?? 0;
    daysRun[dowIndex(d)] = true;
  }

  // 현재 세션이 이번 주에 속하고 recentHistory에 유실되었으면 추가 (stats 매칭 기반)
  const hasMeaningfulData =
    !!currentRunningStats && ((currentRunningStats.distance ?? 0) > 0 || (currentRunningStats.duration ?? 0) > 0);
  if (
    hasMeaningfulData &&
    currentRunningStats &&
    currentDate.getTime() >= monday &&
    !isNaN(currentDate.getTime())
  ) {
    const existingMatch = recentHistory.some((h) => {
      if (!h.runningStats) return false;
      return (
        h.runningStats.distance === currentRunningStats.distance &&
        h.runningStats.duration === currentRunningStats.duration &&
        h.runningStats.avgPace === currentRunningStats.avgPace
      );
    });
    if (!existingMatch) {
      runs += 1;
      totalDistance += currentRunningStats.distance ?? 0;
      totalDuration += currentRunningStats.duration ?? 0;
      daysRun[dowIndex(currentDate)] = true;
    } else {
      // 이미 히스토리에 존재하면 요일 도트만 확실히 찍어줌 (날짜 파싱 실패 대비)
      daysRun[dowIndex(currentDate)] = true;
    }
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
