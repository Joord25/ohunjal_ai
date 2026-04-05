import type { ExerciseStep, RunningType } from "@/constants/workout";

/** 페이스(sec/km) → "m:ss" 문자열. null이면 "—". */
export function formatPace(secPerKm: number | null | undefined): string {
  if (secPerKm == null || !isFinite(secPerKm) || secPerKm <= 0) return "—";
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** 거리(meters) → "5.01" (소수 2자리 문자열). 0/null이면 "—". */
export function formatRunDistanceKm(meters: number | null | undefined): string {
  if (meters == null || !isFinite(meters) || meters <= 0) return "—";
  return (meters / 1000).toFixed(2);
}

/** Strava 스타일 지속시간 포맷 "32m 22s" 또는 "1h 12m 40s". */
export function formatRunDuration(totalSec: number): string {
  if (!isFinite(totalSec) || totalSec < 0) return "0m 0s";
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.floor(totalSec % 60);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

/**
 * 세션의 exercises에서 러닝 타입을 감지.
 * exercise.count의 인터벌 패턴 또는 이름 키워드로 판정.
 * 회의 36 스펙 기준:
 * - walkrun: "N초 걷기 / M초 달리기"
 * - fartlek: "N초 전력 / M초 보통"
 * - sprint: "N초 전력 / M초 회복"
 * - tempo: "템포" 키워드
 */
export function detectRunningType(exercises: ExerciseStep[]): RunningType | null {
  for (const ex of exercises) {
    const c = ex.count || "";
    const n = ex.name || "";
    if (/걷기\s*\/?\s*\d+초\s*달리기/.test(c)) return "walkrun";
    if (/전력\s*\/?\s*\d+초\s*보통/.test(c)) return "fartlek";
    if (/전력\s*\/?\s*\d+초\s*회복/.test(c)) return "sprint";
    if (/템포/.test(n) || /템포/.test(c) || /tempo/i.test(n)) return "tempo";
  }
  return null;
}

/** 러닝 세션 여부 판정 (공유카드/리포트 분기용). */
export function isRunningSession(exercises: ExerciseStep[]): boolean {
  return detectRunningType(exercises) !== null;
}

/** 러닝 타입의 대문자 i18n 라벨 키 반환. */
export function getRunningTypeShareLabel(type: RunningType, locale: string): string {
  if (locale === "ko") {
    switch (type) {
      case "walkrun": return "WALK-RUN";
      case "tempo": return "TEMPO RUN";
      case "fartlek": return "FARTLEK";
      case "sprint": return "SPRINT INTERVAL";
    }
  }
  switch (type) {
    case "walkrun": return "WALK-RUN";
    case "tempo": return "TEMPO RUN";
    case "fartlek": return "FARTLEK";
    case "sprint": return "SPRINT INTERVAL";
  }
}
