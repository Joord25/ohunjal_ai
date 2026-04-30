"use client";

/**
 * 회의 ζ-5-A (2026-04-30) 정책: 무료 1회 = 1 program 생성 + 1 session 실행 (메인 운동 2개까지).
 * 이 모듈은 "12시간 트라이얼 + 게이트 플래그" 두 가지 보조 게이트 관리.
 *
 * - markFirstSessionStarted: free 유저가 첫 세션 onStart 시점 호출. 이후 호출은 무시 (최초 1회만).
 * - isFreeTrialExpired: 12시간 경과 여부.
 * - markFreeGateTriggered: 메인 운동 2개 완료 후 3번째 시작 paywall 발화 시 호출.
 * - isFreeGateTriggered: 이미 한 번 paywall 도달했는지.
 *
 * 서버 측 FREE_PLAN_LIMIT + saveProgram 1-program 가드와 별개. 이건 UX 레이어.
 */

const FIRST_SESSION_AT_KEY = "ohunjal_free_session_started_at";
const GATE_TRIGGERED_KEY = "ohunjal_free_gate_triggered";
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

export function getFirstSessionAt(): number | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(FIRST_SESSION_AT_KEY);
  if (!v) return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

/** free 유저가 첫 세션 onStart 시 호출. 최초 1회만 박힘 — 두 번째 호출은 noop. */
export function markFirstSessionStarted(): void {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(FIRST_SESSION_AT_KEY)) {
    localStorage.setItem(FIRST_SESSION_AT_KEY, String(Date.now()));
  }
}

/** 12시간 경과 = 무료 체험 만료. */
export function isFreeTrialExpired(): boolean {
  const start = getFirstSessionAt();
  if (start == null) return false;
  return (Date.now() - start) > TWELVE_HOURS_MS;
}

/** 메인 2개 완료 → 3번째 시작 paywall 트리거 시 호출. */
export function markFreeGateTriggered(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(GATE_TRIGGERED_KEY, "1");
}

export function isFreeGateTriggered(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(GATE_TRIGGERED_KEY) === "1";
}

/** 통합 판정: 무료 체험 종료 여부 (12시간 경과 OR 게이트 발화 이력). */
export function isFreeTrialEnded(): boolean {
  return isFreeTrialExpired() || isFreeGateTriggered();
}

/** 결제 후 호출 — 모든 무료 트라이얼 상태 초기화 (구독 시작 후 다시 무료 트라이얼 X). */
export function clearFreeTrialState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(FIRST_SESSION_AT_KEY);
  localStorage.removeItem(GATE_TRIGGERED_KEY);
}
