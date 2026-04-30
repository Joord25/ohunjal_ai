/**
 * 체험 상태 중앙 유틸 (회의 53 + ζ-5-A 2026-04-30 정리).
 *
 * 회의 ζ-5-A: 게스트 시스템 통째 폐기. 로그인 후 무료 플랜만 추적.
 *
 * 사용처:
 * - WorkoutReport: 운동 후 남은 횟수 안내
 * - MasterPlanPreview: 현재 단계 표시 (선택)
 */

// 회의 ζ-5-A (2026-04-30): 무료 1회 (마스터 플랜 1회 + 메인 운동 2개) → 3번째 main 시작 시 paywall.
export const FREE_PLAN_LIMIT = 1;

export type TrialStage = "logged_in_free" | "exhausted" | "premium";

export interface TrialStatus {
  /** 로그인 후 무료 플랜에서 완료한 운동 수 (0~2) */
  loggedInCompleted: number;
  /** 현재 단계에서 남은 운동 수 */
  remaining: number;
  /** 현재 단계의 총 한도 */
  currentLimit: number;
  /** 현재 단계에서 완료한 운동 수 */
  currentCompleted: number;
  /** 현재 진행 단계 */
  stage: TrialStage;
  /** 다음 마일스톤까지 남은 운동 수 (paywall 트리거 등) */
  nextMilestoneIn: number;
}

/**
 * 현재 체험 상태 종합 조회.
 *
 * @param isLoggedIn 로그인 여부 (회의 ζ-5-A 이후 항상 true 보장 — LoginScreen 강제)
 * @param isPremium 프리미엄 구독자 여부
 * @param planCount 로그인 유저의 plan_count (userProfile.getPlanCount() 결과)
 * @returns TrialStatus 객체
 */
export function getTrialStatus(
  isLoggedIn: boolean,
  isPremium: boolean,
  planCount: number,
): TrialStatus {
  if (isPremium) {
    return {
      loggedInCompleted: planCount,
      remaining: Number.POSITIVE_INFINITY,
      currentLimit: Number.POSITIVE_INFINITY,
      currentCompleted: planCount,
      stage: "premium",
      nextMilestoneIn: Number.POSITIVE_INFINITY,
    };
  }

  // 비로그인 진입 자체가 없는 구조 (LoginScreen 강제). 안전망으로만 0 처리.
  if (!isLoggedIn) {
    return {
      loggedInCompleted: 0,
      remaining: FREE_PLAN_LIMIT,
      currentLimit: FREE_PLAN_LIMIT,
      currentCompleted: 0,
      stage: "logged_in_free",
      nextMilestoneIn: FREE_PLAN_LIMIT,
    };
  }

  // 로그인 + 무료 플랜 단계
  const loggedInCompleted = Math.min(planCount, FREE_PLAN_LIMIT);
  const remaining = Math.max(FREE_PLAN_LIMIT - loggedInCompleted, 0);
  return {
    loggedInCompleted,
    remaining,
    currentLimit: FREE_PLAN_LIMIT,
    currentCompleted: loggedInCompleted,
    stage: remaining === 0 ? "exhausted" : "logged_in_free",
    nextMilestoneIn: remaining, // 0이면 paywall 타이밍
  };
}

/**
 * 특정 milestone 체험 횟수에 "도달한 순간"인지 판정.
 */
export function isAtMilestone(completed: number, milestone: number): boolean {
  return completed === milestone;
}
