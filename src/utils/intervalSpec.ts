import type { ExerciseStep, IntervalSpec } from "@/constants/workout";

/**
 * 회의 64-T (2026-04-19): 인터벌 구성 추출 유틸.
 * 1순위: exercise.intervalSpec (서버 태그, tag-at-source 원칙)
 * 2순위: exercise.count 문자열 regex (legacy 세션·히스토리 호환)
 *
 * 반환 null = 인터벌 세션 아님 (웨이트·시간 러닝 등)
 */
export function deriveIntervalSpec(exercise: ExerciseStep): IntervalSpec | null {
  if (exercise.intervalSpec) return exercise.intervalSpec;

  const count = exercise.count || "";

  // 시간기반 패턴 3종 (FitScreen intervalConfig와 동일 regex)
  const walkRun = count.match(/(\d+)초\s*걷기\s*\/?\s*(\d+)초\s*달리기\s*[×x]\s*(\d+)/i);
  if (walkRun) {
    return {
      rounds: parseInt(walkRun[3], 10),
      sprintSec: parseInt(walkRun[2], 10),
      recoverySec: parseInt(walkRun[1], 10),
      sprintLabel: "달리기",
      recoveryLabel: "걷기",
    };
  }
  const fartlek = count.match(/(\d+)초\s*전력\s*\/?\s*(\d+)초\s*보통\s*[×x]\s*(\d+)/i);
  if (fartlek) {
    return {
      rounds: parseInt(fartlek[3], 10),
      sprintSec: parseInt(fartlek[1], 10),
      recoverySec: parseInt(fartlek[2], 10),
      sprintLabel: "전력",
      recoveryLabel: "보통",
    };
  }
  const sprintTime = count.match(/(\d+)초\s*전력\s*\/?\s*(\d+)초\s*회복\s*[×x]\s*(\d+)/i);
  if (sprintTime) {
    return {
      rounds: parseInt(sprintTime[3], 10),
      sprintSec: parseInt(sprintTime[1], 10),
      recoverySec: parseInt(sprintTime[2], 10),
      sprintLabel: "전력",
      recoveryLabel: "회복",
    };
  }

  // 거리기반 패턴 "400m × 5", "1000m × 5" 등 — tempoGuide에서 회복 시간 추출 가능
  const distanceReps = count.match(/(\d+)m\s*[×x]\s*(\d+)/i);
  if (distanceReps && exercise.runKind) {
    const tempoGuide = exercise.tempoGuide || "";
    const recoveryMatch = tempoGuide.match(/(\d+)\s*분\s*(?:조깅\s*)?회복/);
    const recoverySec = recoveryMatch ? parseInt(recoveryMatch[1], 10) * 60 : undefined;
    return {
      rounds: parseInt(distanceReps[2], 10),
      sprintDist: parseInt(distanceReps[1], 10),
      recoverySec,
      sprintLabel: "전력",
      recoveryLabel: "조깅 회복",
    };
  }

  return null;
}

/** 초(integer) → "mm:ss" 포맷. 60초 미만은 "Ns" 간결 표기. */
export function formatIntervalDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (s === 0) return `${m}분`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** 거리(m) → "400m" / "1.6km" 표기. */
export function formatIntervalDistance(meters: number): string {
  if (meters >= 1000) {
    const km = meters / 1000;
    return Number.isInteger(km) ? `${km}km` : `${km.toFixed(1)}km`;
  }
  return `${meters}m`;
}
