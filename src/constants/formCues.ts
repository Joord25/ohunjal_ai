import type { Locale } from "@/hooks/useTranslation";

export interface FormCueSet {
  source: string;
  cues: { ko: string[]; en: string[] };
}

/**
 * Phase 1: 바벨 벤치 프레스 정확 1종 (ACSM 표준). 운동 풀 키 = workout.ts L270 와 정확 일치.
 * 다른 벤치 변형 (덤벨/스미스/인클라인/디클라인/헤머/클로즈그립) 은 그립·각도가 달라 cue 가 달라야 함 → Phase 2 변형별 분리.
 */
export const EXERCISE_FORM_CUES: Record<string, FormCueSet> = {
  "바벨 벤치 프레스 (Barbell Bench Press)": {
    source: "ACSM Guidelines 11th ch.7 + NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "발은 바닥에 단단히, 어깨너비로 고정",
        "등 아래에 큰 동전 하나 들어갈 정도의 자연스러운 아치",
        "손목은 곧게, 손등과 팔뚝이 일직선",
        "바벨은 가슴 중앙(유두선)으로 부드럽게 내리기",
        "팔꿈치는 몸통과 약 45도 — 어깨를 가장 편하게 보호해주는 각도예요",
      ],
      en: [
        "Plant feet firmly, shoulder-width apart",
        "Slight natural arch in the lower back (about a coin's thickness)",
        "Keep wrists straight, knuckles aligned with forearms",
        "Lower the bar to mid-chest (nipple line) under control",
        "Elbows tucked at ~45° — the angle that keeps shoulders safest",
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
