/**
 * Program Catalog SSOT — 회의 ζ-5 (2026-04-30) 결정.
 *
 * 디자인 룰:
 * - 한 페이지 ≤ 4 카드 (큐레이션 강화)
 * - 부위별 1 카드 = 그날 단발 운동 (장기 플랜 X)
 * - 목적별 + 캠페인성 = onboarding goal·gender·시즌 조건 매칭
 * - "운동 목적 다르게 선택" = 상단 칩 탭 (다이어트/근력향상/건강)
 *
 * setTemplate 디자인:
 * - 1세트 = 빈바(♂20·♀15kg 바벨 / ♂3·♀2kg 덤벨), 사실상 웜업 — UI 명칭 X
 * - 2세트~ = 본격 무게/횟수
 * - 룰엔진은 운동 풀·구성·카디오 담당. 세트별 세부값은 본 SSOT 가 정의.
 *
 * 기간: 4주 ~ 16주 (4w × 4 chapter). [memory:feedback_user_attention_span]
 */
import type { WorkoutGoal } from "./workout";

/** Onboarding goal — userProfile.ts FitnessProfileData.goal 와 동일 4종 */
export type OnboardingGoal = "fat_loss" | "muscle_gain" | "endurance" | "health";

/** 카탈로그 카드 종류 */
export type CatalogKind = "body_picker" | "program" | "campaign";

/** 운동 role — workoutEngine.ts 와 동일 */
export type ExerciseRole = "compound" | "accessory" | "isolation" | "light" | "bodyweight";

/** 세트 1개의 무게·횟수 정의 */
export interface SetSpec {
  /** 횟수 범위 (예: "10-15", "8-12", "3-5") */
  reps: string;
  /** 무게 가이드 (예: "빈바 (남20·여15)", "본격 무게", "타깃 무게", "(남3·여2)kg 덤벨") */
  weight: string;
  /** UI 표시 라벨 (sets bar 등). 1세트는 비워두고 그냥 "1세트"로 표시 — "웜업" 라벨 X */
  label?: string;
}

/** 운동 role별 setTemplate (1세트~3세트~) */
export interface SetTemplate {
  compound: SetSpec[];
  accessory: SetSpec[];
  isolation: SetSpec[];
  light: SetSpec[];
}

/** 카탈로그 항목 — 카드 1개 */
export interface CatalogItem {
  id: string;
  kind: CatalogKind;
  /** 카드 라벨 (KO) */
  labelKo: string;
  /** 카드 라벨 (EN) */
  labelEn: string;
  /** 한 줄 설명 (KO) — 카드 보조 텍스트 */
  descriptionKo?: string;
  /** 기간 — body_picker 는 0 (그날 단발) */
  weeks: number;
  /** 4주 청킹 챕터 수 — body_picker 는 0 */
  chapters: number;
  /** 룰엔진 입력 매핑 */
  engineGoal: WorkoutGoal;
  /** 노출 조건 — 모든 조건 AND 매칭 */
  match: {
    /** onboarding goal 매칭 (없으면 모든 goal) */
    goal?: OnboardingGoal[];
    /** gender 매칭 (없으면 모든 gender) */
    gender?: ("male" | "female")[];
    /** 시즌 매칭 (월 번호 1-12, 없으면 항상) */
    season?: number[];
    /** 헬스 경험 (months) 최소 — undefined 면 제한 X */
    minExperienceMonths?: number;
  };
  /** setTemplate — body_picker 는 룰엔진 default 사용 (없음) */
  setTemplate?: SetTemplate;
  /**
   * 회의 ζ-5 (2026-04-30): 카탈로그가 운동 풀 명시 (교정·시니어·부상회피).
   * 룰엔진의 generateFromExerciseList 호출 → main phase 가 이 풀로만 구성.
   * core 그룹 운동(슈퍼맨·코브라·플랭크 등)은 자동 type=core 분류 → 시간 hold 타이머.
   * "30초 유지" 같은 reps 패턴 = isStaticHold 적용 (FitScreen 자동 인식).
   */
  exerciseList?: Array<{
    name: string;
    sets: number;
    reps: string;
  }>;
}

// ─────────────────────────────────────────────
// setTemplate 프리셋 (회의 ζ-5 디폴트 무게 시스템)
// ─────────────────────────────────────────────

/** 체지방 감량 — 15-20회 고정, 빈바 시작 */
const TEMPLATE_FAT_LOSS: SetTemplate = {
  compound: [
    { reps: "15-20", weight: "빈바 (남20·여15kg)" },
    { reps: "15-20", weight: "빈바 또는 +2.5kg" },
    { reps: "15-20", weight: "폼 안정 시 +2.5kg" },
  ],
  accessory: [
    { reps: "15-20", weight: "(남3·여2)kg 덤벨" },
    { reps: "15-20", weight: "본격 무게 (가능한 가장 가벼운)" },
    { reps: "15-20", weight: "본격 무게" },
  ],
  isolation: [
    { reps: "15-20", weight: "(남3·여2)kg" },
    { reps: "15-20", weight: "타깃 무게" },
    { reps: "15-20", weight: "타깃 무게" },
  ],
  light: [
    { reps: "15-20", weight: "맨몸 또는 (남3·여2)kg" },
    { reps: "15-20", weight: "맨몸 또는 가벼운 부하" },
  ],
};

/** 근비대 — 1세트 빈바 10-15회, 2세트~ 8-12회 */
const TEMPLATE_HYPERTROPHY: SetTemplate = {
  compound: [
    { reps: "10-15", weight: "빈바 (남20·여15kg)" },
    { reps: "8-12", weight: "본격 무게" },
    { reps: "8-12", weight: "본격 무게" },
    { reps: "8-12", weight: "12회 채우면 +2.5kg" },
  ],
  accessory: [
    { reps: "10-15", weight: "(남3·여2)kg 덤벨" },
    { reps: "8-12", weight: "본격 무게" },
    { reps: "8-12", weight: "본격 무게" },
  ],
  isolation: [
    { reps: "10-15", weight: "(남3·여2)kg" },
    { reps: "8-12", weight: "타깃 무게" },
    { reps: "8-12", weight: "타깃 무게" },
  ],
  light: [
    { reps: "10-15", weight: "맨몸 또는 (남3·여2)kg" },
    { reps: "8-12", weight: "맨몸 또는 가벼운 부하" },
  ],
};

/** 최대근력 — 1세트 빈바 10-15회, 2세트~ 3-5회 */
const TEMPLATE_STRENGTH: SetTemplate = {
  compound: [
    { reps: "10-15", weight: "빈바 (남20·여15kg)" },
    { reps: "3-5", weight: "본격 무게" },
    { reps: "3-5", weight: "본격 무게" },
    { reps: "3-5", weight: "5회 채우면 +5kg" },
  ],
  accessory: [
    { reps: "10-15", weight: "(남3·여2)kg 덤벨" },
    { reps: "5-8", weight: "본격 무게" },
    { reps: "5-8", weight: "본격 무게" },
  ],
  isolation: [
    { reps: "10-15", weight: "(남3·여2)kg" },
    { reps: "8-10", weight: "타깃 무게" },
    { reps: "8-10", weight: "타깃 무게" },
  ],
  light: [
    { reps: "10-15", weight: "맨몸 또는 (남3·여2)kg" },
    { reps: "10-15", weight: "맨몸" },
  ],
};

/** 건강·자세 교정 — 폼 우선, 가벼운 부하 */
const TEMPLATE_HEALTH: SetTemplate = {
  compound: [
    { reps: "12-15", weight: "빈바 또는 가벼운 무게" },
    { reps: "12-15", weight: "폼 우선, 점진 증량" },
    { reps: "12-15", weight: "동일" },
  ],
  accessory: [
    { reps: "12-15", weight: "(남3·여2)kg 덤벨" },
    { reps: "12-15", weight: "타깃 무게 (가볍게)" },
  ],
  isolation: [
    { reps: "12-15", weight: "(남3·여2)kg" },
    { reps: "12-15", weight: "타깃 무게" },
  ],
  light: [
    { reps: "12-15", weight: "맨몸" },
    { reps: "12-15", weight: "맨몸" },
  ],
};

// ─────────────────────────────────────────────
// 카탈로그 항목 정의
// ─────────────────────────────────────────────

export const PROGRAM_CATALOG: CatalogItem[] = [
  // ① 부위별 — 그날 단발 (모든 사용자)
  {
    id: "body_picker",
    kind: "body_picker",
    labelKo: "부위별 운동 (중·상급자용)",
    labelEn: "Body Part Workout (Intermediate)",
    descriptionKo: "오늘 하고 싶은 부위 선택 — 5분할",
    weeks: 0,
    chapters: 0,
    engineGoal: "muscle_gain",
    match: {},
    setTemplate: TEMPLATE_HYPERTROPHY,
  },

  // ② 목적별 — fat_loss
  {
    id: "prog_summer_diet_12w",
    kind: "program",
    labelKo: "여름맞이 3개월 다이어트",
    labelEn: "Summer Diet 12W",
    descriptionKo: "12주 (4주 × 3 챕터) · 15-20회 고반복",
    weeks: 12,
    chapters: 3,
    engineGoal: "fat_loss",
    match: { goal: ["fat_loss"], season: [4, 5, 6] },
    setTemplate: TEMPLATE_FAT_LOSS,
  },
  {
    id: "prog_quick_diet_4w",
    kind: "program",
    labelKo: "급빠 4주 체지방감량",
    labelEn: "Quick Diet 4W",
    descriptionKo: "단기 4주 집중 — 15-20회 + HIIT",
    weeks: 4,
    chapters: 1,
    engineGoal: "fat_loss",
    match: { goal: ["fat_loss"] },
    setTemplate: TEMPLATE_FAT_LOSS,
  },
  {
    id: "prog_hiit_8w",
    kind: "program",
    labelKo: "HIIT 인터벌 프로그램",
    labelEn: "HIIT Interval 8W",
    descriptionKo: "8주 (4주 × 2) · 고강도 인터벌 + 코어",
    weeks: 8,
    chapters: 2,
    engineGoal: "fat_loss",
    match: { goal: ["fat_loss", "endurance"] },
    setTemplate: TEMPLATE_FAT_LOSS,
  },
  {
    id: "prog_diet_16w",
    kind: "program",
    labelKo: "4개월 본격 다이어트",
    labelEn: "Full Diet 16W",
    descriptionKo: "16주 (4주 × 4) · 점진적 강도 상승",
    weeks: 16,
    chapters: 4,
    engineGoal: "fat_loss",
    match: { goal: ["fat_loss"] },
    setTemplate: TEMPLATE_FAT_LOSS,
  },

  // ③ 목적별 — muscle_gain
  {
    id: "prog_muscle_8w",
    kind: "program",
    labelKo: "8주 근육량 증가 프로그램",
    labelEn: "Muscle Gain 8W",
    descriptionKo: "8주 (4주 × 2) · PPL 근비대 8-12회",
    weeks: 8,
    chapters: 2,
    engineGoal: "muscle_gain",
    match: { goal: ["muscle_gain"] },
    setTemplate: TEMPLATE_HYPERTROPHY,
  },
  {
    id: "prog_inbody_d_12w",
    kind: "program",
    labelKo: "3개월 인바디 D로 만들기",
    labelEn: "Inbody D-Shape 12W",
    descriptionKo: "12주 (4주 × 3) · 근비대 + 체지방 동시",
    weeks: 12,
    chapters: 3,
    engineGoal: "muscle_gain",
    match: { goal: ["muscle_gain"] },
    setTemplate: TEMPLATE_HYPERTROPHY,
  },
  {
    id: "prog_2split_8w",
    kind: "program",
    labelKo: "2분할 체력 튼튼 프로그램",
    labelEn: "2-Split Foundation 8W",
    descriptionKo: "8주 (4주 × 2) · 상하체 2분할 입문",
    weeks: 8,
    chapters: 2,
    engineGoal: "muscle_gain",
    match: { goal: ["muscle_gain", "endurance"] },
    setTemplate: TEMPLATE_HYPERTROPHY,
  },
  {
    id: "prog_max_strength_8w",
    kind: "program",
    labelKo: "최대근력 8주",
    labelEn: "Max Strength 8W",
    descriptionKo: "8주 (4주 × 2) · 1RM 갱신, 3-5회",
    weeks: 8,
    chapters: 2,
    engineGoal: "strength",
    match: { goal: ["muscle_gain"], minExperienceMonths: 6 },
    setTemplate: TEMPLATE_STRENGTH,
  },

  // ④ 목적별 — endurance (기초 체력)
  {
    id: "prog_fullbody_cond_8w",
    kind: "program",
    labelKo: "풀바디 컨디셔닝 8주",
    labelEn: "Full-Body Conditioning 8W",
    descriptionKo: "8주 (4주 × 2) · 전신 + HIIT + 코어",
    weeks: 8,
    chapters: 2,
    engineGoal: "general_fitness",
    match: { goal: ["endurance"] },
    setTemplate: TEMPLATE_HEALTH,
  },
  {
    id: "prog_starter_cond_4w",
    kind: "program",
    labelKo: "운동 시작 4주 체력 만들기",
    labelEn: "Starter Conditioning 4W",
    descriptionKo: "4주 · 주 3회 · 운동 입문 1개월 체력 빌드업",
    weeks: 4,
    chapters: 1,
    engineGoal: "general_fitness",
    match: { goal: ["endurance"] },
    setTemplate: TEMPLATE_HEALTH,
  },

  // ⑤ 목적별 — health (자세·부상 회피·시니어)
  {
    id: "prog_posture_8w",
    kind: "program",
    labelKo: "거북목·굽은등 교정 8주",
    labelEn: "Posture Fix 8W",
    descriptionKo: "8주 (4주 × 2) · 등·후면 어깨 강화 + 등척 hold",
    weeks: 8,
    chapters: 2,
    engineGoal: "general_fitness",
    match: { goal: ["health"] },
    setTemplate: TEMPLATE_HEALTH,
    exerciseList: [
      { name: "케이블 페이스 풀 (Cable Face Pull)", sets: 3, reps: "12-15회" },
      { name: "밴드 풀 어파트 (Band Pull-Apart)", sets: 3, reps: "15-20회" },
      { name: "시티드 케이블 로우 (Seated Cable Row)", sets: 3, reps: "12-15회" },
      { name: "슈퍼맨 (Superman)", sets: 3, reps: "30초 유지" },
      { name: "코브라 (Cobra)", sets: 2, reps: "20-30초 유지" },
    ],
  },
  {
    id: "prog_shoulder_safe_4w",
    kind: "program",
    labelKo: "어깨 부상 회피 가슴 루틴",
    labelEn: "Shoulder-Safe Chest 4W",
    descriptionKo: "4주 · 어깨 부담 없는 가슴 + 회전근개 보강",
    weeks: 4,
    chapters: 1,
    engineGoal: "general_fitness",
    match: { goal: ["health"] },
    setTemplate: TEMPLATE_HEALTH,
    exerciseList: [
      { name: "인클라인 덤벨 프레스 (Incline Dumbbell Press)", sets: 3, reps: "10-12회" },
      { name: "케이블 크로스오버 (Cable Crossover)", sets: 3, reps: "12-15회" },
      { name: "푸쉬업 (Push-Up)", sets: 3, reps: "10-15회" },
      { name: "체스트 서포티드 로우 (Chest Supported Row)", sets: 3, reps: "10-12회" },
      { name: "케이블 페이스 풀 (Cable Face Pull)", sets: 3, reps: "12-15회" },
    ],
  },
  {
    id: "prog_senior_4w",
    kind: "program",
    labelKo: "시니어 입문 4주",
    labelEn: "Senior Starter 4W",
    descriptionKo: "4주 · 무릎·허리 부담 없는 풀바디 + 등척",
    weeks: 4,
    chapters: 1,
    engineGoal: "general_fitness",
    match: { goal: ["health"] },
    setTemplate: TEMPLATE_HEALTH,
    exerciseList: [
      { name: "고블렛 스쿼트 (Goblet Squat)", sets: 3, reps: "10-12회" },
      { name: "인클라인 푸쉬업 (Incline Push-Up)", sets: 3, reps: "8-12회" },
      { name: "시티드 케이블 로우 (Seated Cable Row)", sets: 3, reps: "12-15회" },
      { name: "글루트 브릿지 (Glute Bridge)", sets: 3, reps: "12-15회" },
      { name: "월 시트 (Wall Sit)", sets: 2, reps: "20-30초 유지" },
    ],
  },

  // ⑤ 캠페인 — 여성 한정
  {
    id: "camp_cycle_diet_12w",
    kind: "campaign",
    labelKo: "생리주기 다이어트 3개월",
    labelEn: "Cycle-Sync Diet 12W",
    descriptionKo: "12주 · 호르몬 주기 맞춤 강도 조절",
    weeks: 12,
    chapters: 3,
    engineGoal: "fat_loss",
    match: { goal: ["fat_loss"], gender: ["female"] },
    setTemplate: TEMPLATE_FAT_LOSS,
  },

  // ⑥ 캠페인 — 단기 이벤트
  {
    id: "camp_vacation_arms_7d",
    kind: "campaign",
    labelKo: "휴가 전 7일 팔뚝",
    labelEn: "Vacation Arms 7D",
    descriptionKo: "1주 단기 · 팔·어깨 집중 펌핑",
    weeks: 1,
    chapters: 1,
    engineGoal: "muscle_gain",
    match: {},
    setTemplate: TEMPLATE_HYPERTROPHY,
  },
  {
    id: "camp_advanced_back_4w",
    kind: "campaign",
    labelKo: "상급자 등 루틴",
    labelEn: "Advanced Back 4W",
    descriptionKo: "4주 · 등 두께·넓이 동시 공략",
    weeks: 4,
    chapters: 1,
    engineGoal: "muscle_gain",
    match: { minExperienceMonths: 12 },
    setTemplate: TEMPLATE_HYPERTROPHY,
  },
];

// ─────────────────────────────────────────────
// 매칭 유틸 — 페르소나별 큐레이션 4 카드 추출
// ─────────────────────────────────────────────

interface MatchContext {
  goal: OnboardingGoal;
  gender?: "male" | "female";
  /** 1-12 (현재 월) */
  currentMonth?: number;
  /** 자기신고 헬스 경험 (months) */
  experienceMonths?: number;
}

/**
 * 페르소나·시즌 컨텍스트로 카탈로그 매칭
 * - 항상 부위별 카드 1개 포함
 * - 목적별 매칭 카드 우선
 * - 시즌·gender 조건 충족 캠페인 보강
 * - 최대 4 카드 반환
 */
export function getMatchedCatalog(ctx: MatchContext): CatalogItem[] {
  const { goal, gender, currentMonth, experienceMonths } = ctx;
  const matchOne = (item: CatalogItem): boolean => {
    const m = item.match;
    if (m.goal && !m.goal.includes(goal)) return false;
    if (m.gender && gender && !m.gender.includes(gender)) return false;
    if (m.season && currentMonth && !m.season.includes(currentMonth)) return false;
    if (m.minExperienceMonths !== undefined) {
      if (experienceMonths === undefined || experienceMonths < m.minExperienceMonths) return false;
    }
    return true;
  };

  const bodyPicker = PROGRAM_CATALOG.find((c) => c.kind === "body_picker")!;
  const programs = PROGRAM_CATALOG.filter((c) => c.kind === "program" && matchOne(c));
  const campaigns = PROGRAM_CATALOG.filter((c) => c.kind === "campaign" && matchOne(c));

  const result: CatalogItem[] = [bodyPicker];
  // 캠페인 우선 노출 (시즌·페르소나 친화), 그 다음 목적별
  for (const c of campaigns) {
    if (result.length >= 4) break;
    result.push(c);
  }
  for (const p of programs) {
    if (result.length >= 4) break;
    result.push(p);
  }
  return result;
}
