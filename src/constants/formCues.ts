import type { Locale } from "@/hooks/useTranslation";

export interface FormCueSet {
  source: string;
  cues: { ko: string[]; en: string[] };
}

export const EXERCISE_FORM_CUES: Record<string, FormCueSet> = {
  "벤치프레스": {
    source: "ACSM Guidelines 11th ch.7 + NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "발은 바닥에 단단히, 어깨너비로 고정",
        "등 아래에 큰 동전 하나 들어갈 정도의 자연스러운 아치",
        "손목은 곧게, 손등과 팔뚝이 일직선",
        "바벨은 가슴 중앙(유두선)으로 부드럽게 내리기",
        "팔꿈치는 몸통과 약 45도 — 너무 벌리면 어깨가 부담받아요",
      ],
      en: [
        "Plant feet firmly, shoulder-width apart",
        "Slight natural arch in the lower back (about a coin's thickness)",
        "Keep wrists straight, knuckles aligned with forearms",
        "Lower the bar to mid-chest (nipple line) under control",
        "Elbows tucked at ~45° — flaring stresses the shoulders",
      ],
    },
  },
};

export function getFormCues(exerciseName: string, locale: Locale): string[] {
  const set = EXERCISE_FORM_CUES[exerciseName];
  if (!set) return [];
  return locale === "en" ? set.cues.en : set.cues.ko;
}

export function getFormCueSource(exerciseName: string): string | undefined {
  return EXERCISE_FORM_CUES[exerciseName]?.source;
}
