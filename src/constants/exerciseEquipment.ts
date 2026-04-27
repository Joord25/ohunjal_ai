import type { Locale } from "@/hooks/useTranslation";

export interface EquipmentInfo {
  imagePath: string;
  findGuide: { ko: string[]; en: string[] };
}

export const EXERCISE_EQUIPMENT: Record<string, EquipmentInfo> = {
  "벤치프레스": {
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
