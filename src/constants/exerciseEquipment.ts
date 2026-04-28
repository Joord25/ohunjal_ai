import type { Locale } from "@/hooks/useTranslation";

export interface EquipmentInfo {
  imagePath: string;
  findGuide: { ko: string[]; en: string[] };
}

/**
 * Phase 1: 바벨 벤치 프레스 정확 1종만. 운동 풀 키 = workout.ts L270 와 정확 일치.
 * 다른 벤치 변형 (덤벨/스미스/인클라인/디클라인/헤머/클로즈그립) 은 그립·각도 다름 → 동일 cue 부정확 → Phase 2 에서 변형별 분리 후 추가.
 */
export const EXERCISE_EQUIPMENT: Record<string, EquipmentInfo> = {
  "바벨 벤치 프레스 (Barbell Bench Press)": {
    imagePath: "/machine/bench-press.png",
    findGuide: {
      ko: [
        "긴 벤치와 바벨 거치대가 한 세트로 놓여 있어요",
        "보통 자유 웨이트존 중앙에 자리 잡고 있어요",
        "양쪽 거치대에 플레이트가 끼워져 있는지 확인하세요",
        "바벨 위 안전바(세이프티) 높이를 가슴 옆에 맞춰주세요",
        "거치대 핀 위치는 손목보다 살짝 아래가 표준이에요",
      ],
      en: [
        "Look for a flat bench paired with a barbell rack",
        "Usually located in the center of the free-weight area",
        "Check that plates are loaded on both sides",
        "Set the safety bars to chest level for security",
        "Pin height should sit just below your wrist line",
      ],
    },
  },
};

export function getEquipmentInfo(exerciseName: string): EquipmentInfo | undefined {
  return EXERCISE_EQUIPMENT[exerciseName];
}

export function getEquipmentFindGuide(
  exerciseName: string,
  locale: Locale,
): string[] {
  const info = EXERCISE_EQUIPMENT[exerciseName];
  if (!info) return [];
  return locale === "en" ? info.findGuide.en : info.findGuide.ko;
}

/** Phase 1: 정확 매칭 — overlay 마운트 + 휴식 분기 공유. Phase 2에서 컴파운드 추가 시 EXERCISE_EQUIPMENT 에 entry 추가하면 자동 확장 */
export function isBeginnerSupportedExercise(exerciseName: string): boolean {
  return exerciseName in EXERCISE_EQUIPMENT;
}
