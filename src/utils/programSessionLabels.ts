/**
 * 회의 64-ζ (2026-04-21): 장기 프로그램 세션 맥락 라벨.
 *
 * 동일 slotType 세션이 프로그램 내 서로 다른 위치에 편성될 때
 * (예: tt_2k가 W1D1 초기 기준점과 W4 챕터 완료 재측정 양쪽에 존재)
 * 유저가 "같은 세션"으로 오인하지 않도록 맥락을 드러내는 라벨 매핑.
 *
 * 렌더 타임 매핑 — 서버/로컬 저장 데이터는 건드리지 않는다.
 * 기존 저장된 프로그램에도 자동 반영된다.
 */
import type { SavedPlan } from "./savedPlans";

export interface ContextualLabel {
  title: string;
  description: string;
}

type SlotCtx = Pick<SavedPlan, "slotType" | "weekIndex" | "programGoal">;

export function getProgramSessionLabel(plan: SlotCtx): ContextualLabel | null {
  const { slotType, weekIndex, programGoal } = plan;
  if (!slotType) return null;

  if (slotType === "tt_2k" && weekIndex === 1) {
    return {
      title: "Base 진입 · 현재 2K 기준점",
      description: "2km 전력 러닝으로 현재 체력 측정 (워밍업/쿨다운 포함)",
    };
  }
  if (slotType === "tt_2k") {
    return {
      title: "Base 완료 · 4주 성장 재측정",
      description: "2km 전력 러닝으로 4주 성장 확인 (워밍업/쿨다운 포함)",
    };
  }
  if (slotType === "tt_5k" && programGoal === "vo2_boost") {
    return {
      title: "VO2 완료 · 5K 최종 측정",
      description: "5km 전력 러닝으로 VO2max 상승 검증",
    };
  }
  if (slotType === "tt_5k") {
    return {
      title: "Threshold 해방 · 5K 재측정",
      description: "5km 전력 러닝으로 Threshold 구간 재설정 (워밍업/쿨다운 포함)",
    };
  }
  if (slotType === "dress_rehearsal") {
    return {
      title: "Peak 점검 · 레이스 시뮬레이션",
      description: "목표 페이스 러닝 시뮬레이션 (최종 점검)",
    };
  }
  return null;
}

/** sessionData에 맥락 라벨 병합. 라벨 없으면 원본 그대로. */
export function applyProgramSessionLabel<T extends { title?: string; description?: string }>(
  sessionData: T,
  plan: SlotCtx,
): T {
  const label = getProgramSessionLabel(plan);
  if (!label) return sessionData;
  return { ...sessionData, title: label.title, description: label.description };
}
