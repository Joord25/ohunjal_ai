// ====================================================================
// Running Stats Computation
// 회의 41: GPS 데이터 → 거리/페이스/인터벌 분해 계산
// 지도 없음 — 숫자 summary만 저장 (Firestore gpsTrack 저장 안 함)
// ====================================================================

import type { RunningStats, RunningType, IntervalRoundRecord } from "@/constants/workout";

export interface GpsPoint {
  lat: number;
  lng: number;
  t: number;          // Date.now() ms
  accuracy: number;   // m
  speed?: number;     // m/s (OS 제공, 옵셔널)
}

export interface PhaseMark {
  t: number;                      // Date.now() ms
  phase: "sprint" | "recovery";   // 러닝 코치 권고: 인터벌 전환 시점
  round: number;
}

// ─────────────────────────────────────────────────────────────────
// Haversine 거리 계산 (m 단위)
// ─────────────────────────────────────────────────────────────────
const EARTH_R_M = 6_371_000;

export function haversineMeters(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_R_M * c;
}

// ─────────────────────────────────────────────────────────────────
// 포인트 필터링
// - accuracy > 20m 샘플 버림 (GPS 신호 불량)
// - 시작 후 첫 5초 샘플 버림 (cold start 오차)
// ─────────────────────────────────────────────────────────────────
export function isAcceptablePoint(p: GpsPoint, sessionStartMs: number): boolean {
  if (p.accuracy > 20) return false;
  if (p.t - sessionStartMs < 5000) return false;
  return true;
}

// ─────────────────────────────────────────────────────────────────
// 누적 거리 (필터 적용)
// ─────────────────────────────────────────────────────────────────
export function accumulateDistance(points: GpsPoint[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += haversineMeters(
      points[i - 1].lat, points[i - 1].lng,
      points[i].lat, points[i].lng,
    );
  }
  return total;
}

// ─────────────────────────────────────────────────────────────────
// 현재 페이스 (sec/km) — 최근 windowSec 구간의 이동평균
// 러닝 코치 권고: raw speed는 튐, 5초 이동평균 권장
// ─────────────────────────────────────────────────────────────────
export function computeCurrentPace(
  points: GpsPoint[],
  windowSec: number = 5,
): number | null {
  if (points.length < 2) return null;
  const now = points[points.length - 1].t;
  const cutoff = now - windowSec * 1000;
  // cutoff 이후의 포인트만
  const recent = points.filter(p => p.t >= cutoff);
  if (recent.length < 2) return null;
  const dist = accumulateDistance(recent);
  const durSec = (recent[recent.length - 1].t - recent[0].t) / 1000;
  if (dist <= 0 || durSec <= 0) return null;
  // sec/km = duration / (dist/1000)
  return durSec / (dist / 1000);
}

// ─────────────────────────────────────────────────────────────────
// 평균 페이스 (sec/km)
// ─────────────────────────────────────────────────────────────────
export function computeAvgPace(distanceM: number, durationSec: number): number | null {
  if (distanceM <= 0 || durationSec <= 0) return null;
  return durationSec / (distanceM / 1000);
}

// ─────────────────────────────────────────────────────────────────
// 인터벌 라운드 분해 — phaseMarks 기반
// 러닝 코치 권고: 인터벌 모드에선 km 스플릿보다 라운드별 전력/회복 페이스가 의미 있음
// ─────────────────────────────────────────────────────────────────
export function computeIntervalRounds(
  points: GpsPoint[],
  marks: PhaseMark[],
): IntervalRoundRecord[] {
  if (marks.length === 0) return [];

  // phase segments: 각 mark는 "이 시점에 새 페이즈 시작"을 의미
  // segments[i] = { start: marks[i].t, end: marks[i+1]?.t, phase, round }
  type Segment = { start: number; end: number; phase: "sprint" | "recovery"; round: number };
  const segments: Segment[] = [];
  for (let i = 0; i < marks.length; i++) {
    const start = marks[i].t;
    const end = i + 1 < marks.length ? marks[i + 1].t : Number.MAX_SAFE_INTEGER;
    segments.push({ start, end, phase: marks[i].phase, round: marks[i].round });
  }

  // round별로 sprint/recovery 집계
  const rounds = new Map<number, IntervalRoundRecord>();
  for (const seg of segments) {
    const inRange = points.filter(p => p.t >= seg.start && p.t <= seg.end);
    if (inRange.length < 2) continue;
    const dist = accumulateDistance(inRange);
    const durSec = (inRange[inRange.length - 1].t - inRange[0].t) / 1000;
    const pace = dist > 0 && durSec > 0 ? durSec / (dist / 1000) : null;

    const existing = rounds.get(seg.round) ?? {
      round: seg.round,
      sprintPace: null,
      recoveryPace: null,
      sprintDurationSec: 0,
      recoveryDurationSec: 0,
    };
    if (seg.phase === "sprint") {
      existing.sprintPace = pace;
      existing.sprintDurationSec = durSec;
    } else {
      existing.recoveryPace = pace;
      existing.recoveryDurationSec = durSec;
    }
    rounds.set(seg.round, existing);
  }

  return Array.from(rounds.values()).sort((a, b) => a.round - b.round);
}

// ─────────────────────────────────────────────────────────────────
// 최종 RunningStats 조립
// 세션 종료 시 한 번 호출되어 Firestore에 저장할 요약 생성
// ─────────────────────────────────────────────────────────────────
export interface ComputeRunningStatsInput {
  runningType: RunningType;
  isIndoor: boolean;
  gpsAvailable: boolean;
  points: GpsPoint[];
  phaseMarks: PhaseMark[];
  sessionStartMs: number;
  sessionEndMs: number;
  completedRounds: number;
  totalRounds: number;
}

export function computeRunningStats(input: ComputeRunningStatsInput): RunningStats {
  const {
    runningType, isIndoor, gpsAvailable,
    points, phaseMarks,
    sessionStartMs, sessionEndMs,
    completedRounds, totalRounds,
  } = input;

  const durationSec = Math.max(0, (sessionEndMs - sessionStartMs) / 1000);

  // 필터링된 유효 포인트 (실내/GPS 없음이면 빈 배열)
  const validPoints = (gpsAvailable && !isIndoor)
    ? points.filter(p => isAcceptablePoint(p, sessionStartMs))
    : [];

  const distance = accumulateDistance(validPoints);
  const avgPace = computeAvgPace(distance, durationSec);

  const intervalRounds = (gpsAvailable && !isIndoor)
    ? computeIntervalRounds(validPoints, phaseMarks)
    : [];

  // 전력/회복 구간 평균 (인터벌 분해가 있을 때만)
  const sprintPaces = intervalRounds.map(r => r.sprintPace).filter((p): p is number => p != null);
  const recoveryPaces = intervalRounds.map(r => r.recoveryPace).filter((p): p is number => p != null);
  const sprintAvgPace = sprintPaces.length > 0
    ? sprintPaces.reduce((a, b) => a + b, 0) / sprintPaces.length
    : null;
  const recoveryAvgPace = recoveryPaces.length > 0
    ? recoveryPaces.reduce((a, b) => a + b, 0) / recoveryPaces.length
    : null;

  // 최고 페이스 (가장 빠른 = sec/km 최소값)
  const allPaces = [...sprintPaces, ...recoveryPaces];
  const bestPace = allPaces.length > 0 ? Math.min(...allPaces) : null;

  const completionRate = totalRounds > 0
    ? Math.min(1, completedRounds / totalRounds)
    : 1;

  return {
    runningType,
    isIndoor,
    gpsAvailable,
    distance,
    duration: durationSec,
    avgPace,
    sprintAvgPace,
    recoveryAvgPace,
    bestPace,
    intervalRounds,
    completionRate,
  };
}
