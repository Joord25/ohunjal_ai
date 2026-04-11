/**
 * 운동 페르소나 시스템 (회의 53 - 박충환 Brand Admiration 3E + Nir Eyal Investment)
 *
 * 핵심 아이디어:
 * - 유저의 첫 3회 운동 데이터로 "운동 스타일 정체성" 부여
 * - 결제가 아닌 "정체성 확립"이 핵심 — 유저가 "나는 ○○형"이라고 자기 정의하면
 *   이 정체성을 잃기 싫어서 로그인/결제 전환율 상승
 *
 * 박충환 교수 Enrich 관점:
 *   "유저가 '더 나은 나'로 인식하게 만드는 씨앗"
 *
 * Nir Eyal Hook Investment 관점:
 *   "유저가 '잃을 수 없는 것'을 획득하는 순간"
 *
 * 페르소나 4종 (v1 하드코딩):
 *   1. 파워 빌더형  (Power Builder) — 근력 중심
 *   2. 지구력 러너형 (Endurance Runner) — 유산소/러닝 중심
 *   3. 밸런스 애슬릿형 (Balanced Athlete) — 골고루 균형형
 *   4. 성장하는 초보자형 (Rising Beginner) — 데이터 부족 시 기본값
 */

import type { WorkoutHistory } from "@/constants/workout";

export type PersonaType =
  | "power_builder"
  | "endurance_runner"
  | "balanced_athlete"
  | "rising_beginner";

export interface Persona {
  type: PersonaType;
  name: string;          // 한글 표시명 (예: "파워 빌더")
  nameEn: string;        // 영문 표시명
  tagline: string;       // 한 줄 설명 (한글)
  taglineEn: string;     // 한 줄 설명 (영문)
  emoji: string;         // 이모지 대신 SVG path로 대체 예정 — v1은 키워드
  color: string;         // 테마 색상 (tailwind class)
  catchphrase: string;   // 공유 카드용 캐치프레이즈 (한글)
  catchphraseEn: string; // 공유 카드용 캐치프레이즈 (영문)
}

const PERSONAS: Record<PersonaType, Persona> = {
  power_builder: {
    type: "power_builder",
    name: "파워 빌더",
    nameEn: "Power Builder",
    tagline: "강함을 쌓아가는 사람",
    taglineEn: "Building raw strength",
    emoji: "power",
    color: "emerald",
    catchphrase: "오늘도 한 층 더 단단해졌어요",
    catchphraseEn: "One layer stronger today",
  },
  endurance_runner: {
    type: "endurance_runner",
    name: "지구력 러너",
    nameEn: "Endurance Runner",
    tagline: "오래 달리는 심장",
    taglineEn: "The long-distance heart",
    emoji: "running",
    color: "sky",
    catchphrase: "멀리 가는 사람이 결국 이겨요",
    catchphraseEn: "Who goes far, wins",
  },
  balanced_athlete: {
    type: "balanced_athlete",
    name: "밸런스 애슬릿",
    nameEn: "Balanced Athlete",
    tagline: "모든 방향으로 성장",
    taglineEn: "Growing in every direction",
    emoji: "balance",
    color: "amber",
    catchphrase: "근력도, 지구력도, 당신은 균형형",
    catchphraseEn: "Strength and stamina, perfectly balanced",
  },
  rising_beginner: {
    type: "rising_beginner",
    name: "성장하는 초보자",
    nameEn: "Rising Beginner",
    tagline: "시작하는 용기가 가장 큰 힘",
    taglineEn: "Starting is the hardest part",
    emoji: "sprout",
    color: "lime",
    catchphrase: "첫 걸음을 뗀 당신, 이미 절반은 성공",
    catchphraseEn: "You've already won half by starting",
  },
};

/**
 * 최근 운동 이력으로부터 페르소나 판정 (순수 함수).
 *
 * 판정 기준 (v1 단순 버전):
 * - 세션 수 < 3: rising_beginner (데이터 부족)
 * - cardio/running 비중 >= 50%: endurance_runner
 * - strength (main phase) 비중 >= 60%: power_builder
 * - 그 외: balanced_athlete
 *
 * @param history 최근 운동 이력 (7일 내 권장, 더 길어도 OK)
 * @returns 판정된 페르소나
 */
export function detectPersona(history: WorkoutHistory[]): Persona {
  if (history.length < 3) {
    return PERSONAS.rising_beginner;
  }

  // 각 세션의 주요 운동 타입 집계
  let cardioCount = 0;
  let strengthCount = 0;
  let totalMainExercises = 0;

  history.forEach((session) => {
    const exercises = session.sessionData?.exercises ?? [];
    exercises.forEach((ex) => {
      // warmup/core/mobility는 카운트 제외 — main/cardio만
      if (ex.phase === "cardio" || ex.type === "cardio") {
        cardioCount++;
        totalMainExercises++;
      } else if (ex.phase === "main" || ex.type === "strength") {
        strengthCount++;
        totalMainExercises++;
      }
    });
  });

  if (totalMainExercises === 0) {
    return PERSONAS.rising_beginner;
  }

  const cardioRatio = cardioCount / totalMainExercises;
  const strengthRatio = strengthCount / totalMainExercises;

  if (cardioRatio >= 0.5) {
    return PERSONAS.endurance_runner;
  }
  if (strengthRatio >= 0.6) {
    return PERSONAS.power_builder;
  }
  return PERSONAS.balanced_athlete;
}

/**
 * 페르소나 타입으로 직접 Persona 객체 조회
 */
export function getPersona(type: PersonaType): Persona {
  return PERSONAS[type];
}

/**
 * 전체 페르소나 목록 (미리보기/테스트용)
 */
export function getAllPersonas(): Persona[] {
  return Object.values(PERSONAS);
}
