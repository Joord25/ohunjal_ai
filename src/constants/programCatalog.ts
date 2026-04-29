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

/**
 * 회의 ζ-5 (2026-04-30) 매트릭스 시스템 — 주차×요일별 세션 정의.
 * 슬롯 풀(실제 운동 목록)은 서버(workoutEngine.ts catalogPools)에 둠 — 보안 + 번들 사이즈 절약.
 * 클라는 매트릭스 메타(type·sets·reps·rpe·linearProgression 등)만 보유.
 *
 * 룰엔진 신규 함수 `generateFromCatalogType(slotType, slotConfig)` 가 slotType 받아 슬롯 풀에서 랜덤 선택.
 * 랜덤 시드 = (weekIndex × 7 + dayOfWeek) — 같은 주 같은 요일 = 같은 운동 (재방문 일관).
 */
export interface MatrixSession {
  /** 1-based week (1 ~ totalWeeks) */
  week: number;
  /** ISO weekday: 1=월 ... 7=일. weight session 만 (휴식·카디오는 별도 dailyExtra) */
  dayOfWeek: number;
  /** 챕터 인덱스 (1, 2, 3, ...). 4주 청킹 기준 */
  chapter: number;
  /**
   * 슬롯 타입 — 서버 catalogPools 에 매핑되는 키.
   * 예: "upper_push_focus" / "lower_squat_focus" / "posture_thoracic_pull" / "metcon_circuit" / "arms_main_1" / "back_thickness" 등
   */
  slotType: string;
  /** 슬롯 수 (보통 4-5) */
  slots: number;
  /** Sets per slot */
  sets: number;
  /** Reps per set 표기 (예: "10-15", "8-12", "30s 유지") */
  reps: string;
  /** RPE (Rate of Perceived Exertion) 1-10 */
  rpe: number;
  /** Wendler 5/3/1 등 메인 lift wave 정의 (선택). max_strength_8w 전용 */
  wendlerWave?: "A" | "B" | "C" | "deload";
  /** Linear progression 활성화 (Rippetoe 패턴, 매 세션 +2.5-5kg) */
  linearProgression?: boolean;
  /** finisher 추가 (예: AMRAP 30s × 4 라운드) */
  finisher?: { rounds: number; workSec: number; restSec: number };
  /** 1세트 빈바 시작 (웜업 명칭 X, 사실상 웜업) */
  firstSetWarmup?: boolean;
}

/** 카디오 또는 모빌리티 등 weight 외 일별 추가 활동 */
export interface MatrixDailyExtra {
  week: number;
  dayOfWeek: number;
  /** 활동 타입: "liss" / "hiit" / "metcon_circuit" / "mobility" / "stretching" / "rest" / "walk" */
  activity: string;
  /** 시간 (분) — walk·LISS 만 */
  durationMin?: number;
  /** 일일 걸음 목표 (Israetel TIA mini cut) */
  stepsTarget?: number;
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
  /**
   * 회의 ζ-5 (2026-04-30): 주당 세션 수. 장기 multi-session 메타 (totalSessions = weeks × sessionsPerWeek) 계산.
   * body_picker / weeks=0 (단발) 은 무시. 기본값 = 3 (주 3회).
   */
  sessionsPerWeek?: number;
  /**
   * 회의 ζ-5 매트릭스 시스템 (P1 추가).
   * 주차×요일별 세션 매트릭스. 서버 catalogPools 에서 slotType 으로 운동 풀 lookup.
   * body_picker / weeks=0 카탈로그는 undefined.
   */
  weeklyMatrix?: MatrixSession[];
  /** 카디오·모빌리티·휴식 등 weight 외 일별 활동 (선택) */
  dailyExtras?: MatrixDailyExtra[];
  /**
   * 챕터 경계 diet break 시점 (자연 보디빌더 패턴, Layne Norton).
   * 예: [4, 8, 12] = W4, W8, W12 종료 시 diet break 권장.
   * fat_loss·recomp 카탈로그 만 적용.
   */
  dietBreaks?: number[];
  /**
   * 경험 자기보고 매칭 — match.minExperienceMonths 와 별개로 카드 안에 노출하는 안내문 키.
   * 예: "advanced_warning" → "이 프로그램은 헬스 6개월+ 경험자 권장"
   */
  experienceWarning?: "starter" | "advanced" | "senior_safe" | "shoulder_safe";
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
// weeklyMatrix 헬퍼 — chapter config → MatrixSession[] 동적 생성
// ─────────────────────────────────────────────

interface ChapterDayConfig {
  dayOfWeek: number;
  slotType: string;
  slots?: number;
  sets: number;
  reps: string;
  rpe: number;
  wendlerWave?: "A" | "B" | "C" | "deload";
  linearProgression?: boolean;
  finisher?: { rounds: number; workSec: number; restSec: number };
  firstSetWarmup?: boolean;
}

interface ChapterConfig {
  weeks: number;
  days: ChapterDayConfig[];
}

function buildMatrix(chapters: ChapterConfig[]): MatrixSession[] {
  const result: MatrixSession[] = [];
  let currentWeek = 1;
  let chapterIndex = 1;
  for (const chapter of chapters) {
    for (let w = 0; w < chapter.weeks; w++) {
      for (const day of chapter.days) {
        result.push({
          week: currentWeek,
          dayOfWeek: day.dayOfWeek,
          chapter: chapterIndex,
          slotType: day.slotType,
          slots: day.slots ?? 4,
          sets: day.sets,
          reps: day.reps,
          rpe: day.rpe,
          wendlerWave: day.wendlerWave,
          linearProgression: day.linearProgression,
          finisher: day.finisher,
          firstSetWarmup: day.firstSetWarmup,
        });
      }
      currentWeek++;
    }
    chapterIndex++;
  }
  return result;
}

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
    sessionsPerWeek: 4,
    engineGoal: "fat_loss",
    match: { goal: ["fat_loss"], season: [4, 5, 6] },
    setTemplate: TEMPLATE_FAT_LOSS,
    dietBreaks: [4, 8, 12],
    weeklyMatrix: buildMatrix([
      // Base 4주 — RPE 7, 12-15회
      { weeks: 4, days: [
        { dayOfWeek: 1, slotType: "upper_push", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 2, slotType: "lower_squat", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 4, slotType: "upper_pull", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "lower_hinge", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true },
      ]},
      // Build 4주 — RPE 8, 10-12회
      { weeks: 4, days: [
        { dayOfWeek: 1, slotType: "upper_push", sets: 4, reps: "10-12", rpe: 8, firstSetWarmup: true },
        { dayOfWeek: 2, slotType: "lower_squat", sets: 4, reps: "10-12", rpe: 8, firstSetWarmup: true },
        { dayOfWeek: 4, slotType: "upper_pull", sets: 4, reps: "10-12", rpe: 8, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "lower_hinge", sets: 4, reps: "10-12", rpe: 8, firstSetWarmup: true },
      ]},
      // Peak 4주 — RPE 8.5, 8-10회 + finisher
      { weeks: 4, days: [
        { dayOfWeek: 1, slotType: "upper_push", sets: 4, reps: "8-10", rpe: 8.5, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 2, slotType: "lower_squat", sets: 4, reps: "8-10", rpe: 8.5, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 4, slotType: "upper_pull", sets: 4, reps: "8-10", rpe: 8.5, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 5, slotType: "lower_hinge", sets: 4, reps: "8-10", rpe: 8.5, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
      ]},
    ]),
  },
  {
    id: "prog_quick_diet_4w",
    kind: "program",
    labelKo: "급빠 4주 체지방감량",
    labelEn: "Quick Diet 4W",
    descriptionKo: "단기 4주 집중 — 15-20회 + HIIT (Israetel TIA Mini Cut)",
    weeks: 4,
    chapters: 1,
    sessionsPerWeek: 4,
    engineGoal: "fat_loss",
    match: { goal: ["fat_loss"] },
    setTemplate: TEMPLATE_FAT_LOSS,
    weeklyMatrix: buildMatrix([
      { weeks: 4, days: [
        // 매주 RPE/sets/rounds 진행 — 4주 단기라 매주 다른 progression
        { dayOfWeek: 1, slotType: "upper_compound", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 2, slotType: "lower_compound", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 3, slotType: "metcon_circuit", slots: 5, sets: 4, reps: "30s", rpe: 8, finisher: { rounds: 4, workSec: 30, restSec: 30 } },
        { dayOfWeek: 4, slotType: "upper_volume", sets: 3, reps: "15-20", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "lower_volume", sets: 3, reps: "15-20", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 6, slotType: "metcon_circuit", slots: 5, sets: 4, reps: "30s", rpe: 8, finisher: { rounds: 4, workSec: 30, restSec: 30 } },
      ]},
    ]),
  },
  {
    id: "prog_hiit_8w",
    kind: "program",
    labelKo: "HIIT 인터벌 프로그램",
    labelEn: "HIIT Interval 8W",
    descriptionKo: "8주 (4주 × 2) · 고강도 인터벌 + 코어",
    weeks: 8,
    chapters: 2,
    sessionsPerWeek: 5,
    engineGoal: "fat_loss",
    match: { goal: ["fat_loss", "endurance"] },
    setTemplate: TEMPLATE_FAT_LOSS,
    weeklyMatrix: buildMatrix([
      // Adaptation 4주 — Medium-Interval 8×2분
      { weeks: 4, days: [
        { dayOfWeek: 1, slotType: "hiit_medium_interval", slots: 2, sets: 8, reps: "2min work / 2min rest", rpe: 8 },
        { dayOfWeek: 2, slotType: "upper_push_focus", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 3, slotType: "hiit_medium_interval", slots: 2, sets: 8, reps: "2min work / 2min rest", rpe: 8 },
        { dayOfWeek: 4, slotType: "lower_squat_focus", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "hiit_medium_interval", slots: 2, sets: 8, reps: "2min work / 2min rest", rpe: 8 },
      ]},
      // Build 4주 — Long-Interval 4×4분 (gold standard)
      { weeks: 4, days: [
        { dayOfWeek: 1, slotType: "hiit_long_interval", slots: 2, sets: 4, reps: "4min work / 4min rest", rpe: 9 },
        { dayOfWeek: 2, slotType: "upper_push_focus", sets: 3, reps: "10-12", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 3, slotType: "hiit_long_interval", slots: 2, sets: 4, reps: "4min work / 4min rest", rpe: 9 },
        { dayOfWeek: 4, slotType: "lower_squat_focus", sets: 3, reps: "10-12", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "hiit_long_interval", slots: 2, sets: 4, reps: "4min work / 4min rest", rpe: 9 },
      ]},
    ]),
  },
  {
    id: "prog_diet_16w",
    kind: "program",
    labelKo: "4개월 본격 다이어트",
    labelEn: "Full Diet 16W",
    descriptionKo: "16주 (4주 × 4) · 점진적 강도 상승 + 챕터 diet break",
    weeks: 16,
    chapters: 4,
    sessionsPerWeek: 4,
    engineGoal: "fat_loss",
    match: { goal: ["fat_loss"] },
    setTemplate: TEMPLATE_FAT_LOSS,
    dietBreaks: [4, 8, 12, 16],
    weeklyMatrix: buildMatrix([
      // Base 4주 — RPE 7, 12-15회, -15% kcal
      { weeks: 4, days: [
        { dayOfWeek: 1, slotType: "upper_push", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 2, slotType: "lower_squat", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 4, slotType: "upper_pull", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "lower_hinge", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true },
      ]},
      // Build 4주 — RPE 8, 10-12회
      { weeks: 4, days: [
        { dayOfWeek: 1, slotType: "upper_push", sets: 4, reps: "10-12", rpe: 8, firstSetWarmup: true },
        { dayOfWeek: 2, slotType: "lower_squat", sets: 4, reps: "10-12", rpe: 8, firstSetWarmup: true },
        { dayOfWeek: 4, slotType: "upper_pull", sets: 4, reps: "10-12", rpe: 8, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "lower_hinge", sets: 4, reps: "10-12", rpe: 8, firstSetWarmup: true },
      ]},
      // Peak1 4주 — RPE 8.5, 8-10회 + drop set
      { weeks: 4, days: [
        { dayOfWeek: 1, slotType: "upper_push", sets: 4, reps: "8-10", rpe: 8.5, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 2, slotType: "lower_squat", sets: 4, reps: "8-10", rpe: 8.5, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 4, slotType: "upper_pull", sets: 4, reps: "8-10", rpe: 8.5, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 5, slotType: "lower_hinge", sets: 4, reps: "8-10", rpe: 8.5, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
      ]},
      // Peak2 4주 — RPE 9, 6-10회 피라미드
      { weeks: 4, days: [
        { dayOfWeek: 1, slotType: "upper_push", sets: 4, reps: "6-10", rpe: 9, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 2, slotType: "lower_squat", sets: 4, reps: "6-10", rpe: 9, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 4, slotType: "upper_pull", sets: 4, reps: "6-10", rpe: 9, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 5, slotType: "lower_hinge", sets: 4, reps: "6-10", rpe: 9, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
      ]},
    ]),
  },

  // ③ 목적별 — muscle_gain
  {
    id: "prog_muscle_8w",
    kind: "program",
    labelKo: "8주 근육량 증가 프로그램",
    labelEn: "Muscle Gain 8W",
    descriptionKo: "8주 (4주 × 2) · 글루트 강조 + 8-12회",
    weeks: 8,
    chapters: 2,
    sessionsPerWeek: 4,
    engineGoal: "muscle_gain",
    match: { goal: ["muscle_gain"] },
    setTemplate: TEMPLATE_HYPERTROPHY,
    weeklyMatrix: buildMatrix([
      // Base 4주 — Schoenfeld MEV (8-10 sets/muscle/wk)
      { weeks: 4, days: [
        { dayOfWeek: 1, slotType: "upper_a_push_emphasis", sets: 3, reps: "8-12", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 2, slotType: "lower_a_squat_glute", sets: 3, reps: "8-12", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 4, slotType: "upper_b_pull_emphasis", sets: 3, reps: "8-12", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "lower_b_hinge_glute", sets: 3, reps: "8-12", rpe: 7, firstSetWarmup: true },
      ]},
      // Build 4주 — Schoenfeld MAV (15-20 sets) + W7-8 finisher
      { weeks: 4, days: [
        { dayOfWeek: 1, slotType: "upper_a_push_emphasis", sets: 4, reps: "8-12", rpe: 8, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 2, slotType: "lower_a_squat_glute", sets: 4, reps: "8-12", rpe: 8, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 4, slotType: "upper_b_pull_emphasis", sets: 4, reps: "8-12", rpe: 8, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 5, slotType: "lower_b_hinge_glute", sets: 4, reps: "8-12", rpe: 8, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
      ]},
    ]),
  },
  {
    id: "prog_inbody_d_12w",
    kind: "program",
    labelKo: "3개월 인바디 D로 만들기",
    labelEn: "Inbody D-Shape 12W",
    descriptionKo: "12주 (4주 × 3) · 5일 PPL · calorie cycling",
    weeks: 12,
    chapters: 3,
    sessionsPerWeek: 5,
    engineGoal: "muscle_gain",
    match: { goal: ["muscle_gain"] },
    setTemplate: TEMPLATE_HYPERTROPHY,
    weeklyMatrix: buildMatrix([
      // Base 4주 — RPE 7, 8-12회, maintenance ±5%
      { weeks: 4, days: [
        { dayOfWeek: 1, slotType: "push_a", slots: 5, sets: 3, reps: "8-12", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 2, slotType: "pull_a", slots: 5, sets: 3, reps: "8-12", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 3, slotType: "legs_squat_focus", slots: 5, sets: 3, reps: "8-12", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 4, slotType: "push_b", slots: 5, sets: 3, reps: "10-12", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "legs_hinge_focus", slots: 5, sets: 3, reps: "8-12", rpe: 7, firstSetWarmup: true },
      ]},
      // Build 4주 — RPE 8, calorie cycling
      { weeks: 4, days: [
        { dayOfWeek: 1, slotType: "push_a", slots: 5, sets: 4, reps: "6-10", rpe: 8, firstSetWarmup: true },
        { dayOfWeek: 2, slotType: "pull_a", slots: 5, sets: 4, reps: "6-10", rpe: 8, firstSetWarmup: true },
        { dayOfWeek: 3, slotType: "legs_squat_focus", slots: 5, sets: 4, reps: "6-10", rpe: 8, firstSetWarmup: true },
        { dayOfWeek: 4, slotType: "push_b", slots: 5, sets: 4, reps: "8-12", rpe: 8, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "legs_hinge_focus", slots: 5, sets: 4, reps: "6-10", rpe: 8, firstSetWarmup: true },
      ]},
      // Peak 4주 — RPE 8.5, 적자 -10% + finisher
      { weeks: 4, days: [
        { dayOfWeek: 1, slotType: "push_a", slots: 5, sets: 4, reps: "6-10", rpe: 8.5, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 2, slotType: "pull_a", slots: 5, sets: 4, reps: "6-10", rpe: 8.5, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 3, slotType: "legs_squat_focus", slots: 5, sets: 4, reps: "6-10", rpe: 8.5, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 4, slotType: "push_b", slots: 5, sets: 4, reps: "8-12", rpe: 8.5, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 5, slotType: "legs_hinge_focus", slots: 5, sets: 4, reps: "6-10", rpe: 8.5, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
      ]},
    ]),
  },
  {
    id: "prog_2split_8w",
    kind: "program",
    labelKo: "2분할 체력 튼튼 프로그램",
    labelEn: "2-Split Foundation 8W",
    descriptionKo: "8주 (4주 × 2) · Rippetoe 3일 + Linear progression",
    weeks: 8,
    chapters: 2,
    sessionsPerWeek: 3,
    engineGoal: "muscle_gain",
    match: { goal: ["muscle_gain", "endurance"] },
    setTemplate: TEMPLATE_HYPERTROPHY,
    experienceWarning: "starter",
    weeklyMatrix: buildMatrix([
      // Adaptation 4주 — Linear progression 시작 (Rippetoe)
      // 홀수주 (W1·W3): A → B → A. 짝수주 (W2·W4): B → A → B alternating
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "upper_push_focus", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true, linearProgression: true },
        { dayOfWeek: 3, slotType: "lower_full", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true, linearProgression: true },
        { dayOfWeek: 5, slotType: "upper_pull_focus", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true, linearProgression: true },
      ]},
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "lower_squat_focus", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true, linearProgression: true },
        { dayOfWeek: 3, slotType: "upper_pull_focus", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true, linearProgression: true },
        { dayOfWeek: 5, slotType: "lower_hinge_focus", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true, linearProgression: true },
      ]},
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "upper_push_focus", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true, linearProgression: true },
        { dayOfWeek: 3, slotType: "lower_full", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true, linearProgression: true },
        { dayOfWeek: 5, slotType: "upper_pull_focus", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true, linearProgression: true },
      ]},
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "lower_squat_focus", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true, linearProgression: true },
        { dayOfWeek: 3, slotType: "upper_pull_focus", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true, linearProgression: true },
        { dayOfWeek: 5, slotType: "lower_hinge_focus", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true, linearProgression: true },
      ]},
      // Build 4주 — RPE 8, 10-12회 + finisher 5분
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "upper_push_focus", sets: 4, reps: "10-12", rpe: 8, firstSetWarmup: true, linearProgression: true, finisher: { rounds: 4, workSec: 30, restSec: 30 } },
        { dayOfWeek: 3, slotType: "lower_full", sets: 4, reps: "10-12", rpe: 8, firstSetWarmup: true, linearProgression: true, finisher: { rounds: 4, workSec: 30, restSec: 30 } },
        { dayOfWeek: 5, slotType: "upper_pull_focus", sets: 4, reps: "10-12", rpe: 8, firstSetWarmup: true, linearProgression: true, finisher: { rounds: 4, workSec: 30, restSec: 30 } },
      ]},
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "lower_squat_focus", sets: 4, reps: "10-12", rpe: 8, firstSetWarmup: true, linearProgression: true, finisher: { rounds: 4, workSec: 30, restSec: 30 } },
        { dayOfWeek: 3, slotType: "upper_pull_focus", sets: 4, reps: "10-12", rpe: 8, firstSetWarmup: true, linearProgression: true, finisher: { rounds: 4, workSec: 30, restSec: 30 } },
        { dayOfWeek: 5, slotType: "lower_hinge_focus", sets: 4, reps: "10-12", rpe: 8, firstSetWarmup: true, linearProgression: true, finisher: { rounds: 4, workSec: 30, restSec: 30 } },
      ]},
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "upper_push_focus", sets: 4, reps: "10-12", rpe: 8, firstSetWarmup: true, linearProgression: true, finisher: { rounds: 4, workSec: 30, restSec: 30 } },
        { dayOfWeek: 3, slotType: "lower_full", sets: 4, reps: "10-12", rpe: 8, firstSetWarmup: true, linearProgression: true, finisher: { rounds: 4, workSec: 30, restSec: 30 } },
        { dayOfWeek: 5, slotType: "upper_pull_focus", sets: 4, reps: "10-12", rpe: 8, firstSetWarmup: true, linearProgression: true, finisher: { rounds: 4, workSec: 30, restSec: 30 } },
      ]},
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "lower_squat_focus", sets: 4, reps: "10-12", rpe: 8, firstSetWarmup: true, linearProgression: true, finisher: { rounds: 4, workSec: 30, restSec: 30 } },
        { dayOfWeek: 3, slotType: "upper_pull_focus", sets: 4, reps: "10-12", rpe: 8, firstSetWarmup: true, linearProgression: true, finisher: { rounds: 4, workSec: 30, restSec: 30 } },
        { dayOfWeek: 5, slotType: "lower_hinge_focus", sets: 4, reps: "10-12", rpe: 8, firstSetWarmup: true, linearProgression: true, finisher: { rounds: 4, workSec: 30, restSec: 30 } },
      ]},
    ]),
  },
  {
    id: "prog_max_strength_8w",
    kind: "program",
    labelKo: "최대근력 8주",
    labelEn: "Max Strength 8W",
    descriptionKo: "8주 (Wendler 5/3/1 × 2 cycle) · 1RM 갱신, 3-5회",
    weeks: 8,
    chapters: 2,
    sessionsPerWeek: 4,
    engineGoal: "strength",
    match: { goal: ["muscle_gain"], minExperienceMonths: 6 },
    setTemplate: TEMPLATE_STRENGTH,
    experienceWarning: "advanced",
    weeklyMatrix: buildMatrix([
      // Cycle 1 (W1-W4)
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "wendler_ohp_day", sets: 3, reps: "5/5/5+", rpe: 8, wendlerWave: "A" },
        { dayOfWeek: 2, slotType: "wendler_deadlift_day", sets: 3, reps: "5/5/5+", rpe: 8, wendlerWave: "A" },
        { dayOfWeek: 4, slotType: "wendler_bench_day", sets: 3, reps: "5/5/5+", rpe: 8, wendlerWave: "A" },
        { dayOfWeek: 5, slotType: "wendler_squat_day", sets: 3, reps: "5/5/5+", rpe: 8, wendlerWave: "A" },
      ]},
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "wendler_ohp_day", sets: 3, reps: "3/3/3+", rpe: 8.5, wendlerWave: "B" },
        { dayOfWeek: 2, slotType: "wendler_deadlift_day", sets: 3, reps: "3/3/3+", rpe: 8.5, wendlerWave: "B" },
        { dayOfWeek: 4, slotType: "wendler_bench_day", sets: 3, reps: "3/3/3+", rpe: 8.5, wendlerWave: "B" },
        { dayOfWeek: 5, slotType: "wendler_squat_day", sets: 3, reps: "3/3/3+", rpe: 8.5, wendlerWave: "B" },
      ]},
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "wendler_ohp_day", sets: 3, reps: "5/3/1+", rpe: 9, wendlerWave: "C" },
        { dayOfWeek: 2, slotType: "wendler_deadlift_day", sets: 3, reps: "5/3/1+", rpe: 9, wendlerWave: "C" },
        { dayOfWeek: 4, slotType: "wendler_bench_day", sets: 3, reps: "5/3/1+", rpe: 9, wendlerWave: "C" },
        { dayOfWeek: 5, slotType: "wendler_squat_day", sets: 3, reps: "5/3/1+", rpe: 9, wendlerWave: "C" },
      ]},
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "wendler_ohp_day", sets: 3, reps: "5/5/5", rpe: 6, wendlerWave: "deload" },
        { dayOfWeek: 2, slotType: "wendler_deadlift_day", sets: 3, reps: "5/5/5", rpe: 6, wendlerWave: "deload" },
        { dayOfWeek: 4, slotType: "wendler_bench_day", sets: 3, reps: "5/5/5", rpe: 6, wendlerWave: "deload" },
        { dayOfWeek: 5, slotType: "wendler_squat_day", sets: 3, reps: "5/5/5", rpe: 6, wendlerWave: "deload" },
      ]},
      // Cycle 2 (W5-W8) — Training Max +5lb (upper) / +10lb (lower)
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "wendler_ohp_day", sets: 3, reps: "5/5/5+", rpe: 8, wendlerWave: "A" },
        { dayOfWeek: 2, slotType: "wendler_deadlift_day", sets: 3, reps: "5/5/5+", rpe: 8, wendlerWave: "A" },
        { dayOfWeek: 4, slotType: "wendler_bench_day", sets: 3, reps: "5/5/5+", rpe: 8, wendlerWave: "A" },
        { dayOfWeek: 5, slotType: "wendler_squat_day", sets: 3, reps: "5/5/5+", rpe: 8, wendlerWave: "A" },
      ]},
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "wendler_ohp_day", sets: 3, reps: "3/3/3+", rpe: 8.5, wendlerWave: "B" },
        { dayOfWeek: 2, slotType: "wendler_deadlift_day", sets: 3, reps: "3/3/3+", rpe: 8.5, wendlerWave: "B" },
        { dayOfWeek: 4, slotType: "wendler_bench_day", sets: 3, reps: "3/3/3+", rpe: 8.5, wendlerWave: "B" },
        { dayOfWeek: 5, slotType: "wendler_squat_day", sets: 3, reps: "3/3/3+", rpe: 8.5, wendlerWave: "B" },
      ]},
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "wendler_ohp_day", sets: 3, reps: "5/3/1+", rpe: 9, wendlerWave: "C" },
        { dayOfWeek: 2, slotType: "wendler_deadlift_day", sets: 3, reps: "5/3/1+", rpe: 9, wendlerWave: "C" },
        { dayOfWeek: 4, slotType: "wendler_bench_day", sets: 3, reps: "5/3/1+", rpe: 9, wendlerWave: "C" },
        { dayOfWeek: 5, slotType: "wendler_squat_day", sets: 3, reps: "5/3/1+", rpe: 9, wendlerWave: "C" },
      ]},
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "wendler_ohp_day", sets: 3, reps: "5/5/5", rpe: 6, wendlerWave: "deload" },
        { dayOfWeek: 2, slotType: "wendler_deadlift_day", sets: 3, reps: "5/5/5", rpe: 6, wendlerWave: "deload" },
        { dayOfWeek: 4, slotType: "wendler_bench_day", sets: 3, reps: "5/5/5", rpe: 6, wendlerWave: "deload" },
        { dayOfWeek: 5, slotType: "wendler_squat_day", sets: 3, reps: "5/5/5", rpe: 6, wendlerWave: "deload" },
      ]},
    ]),
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
    sessionsPerWeek: 3,
    engineGoal: "general_fitness",
    match: { goal: ["endurance"] },
    setTemplate: TEMPLATE_HEALTH,
    weeklyMatrix: buildMatrix([
      // Adaptation 4주 — 30-35분 풀바디
      { weeks: 4, days: [
        { dayOfWeek: 1, slotType: "fullbody_a_squat", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 3, slotType: "fullbody_b_hinge", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "fullbody_a_squat", sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true },
      ]},
      // Build 4주 — 40-50분 + finisher
      { weeks: 4, days: [
        { dayOfWeek: 1, slotType: "fullbody_a_squat", sets: 4, reps: "12-20", rpe: 8, firstSetWarmup: true, finisher: { rounds: 3, workSec: 30, restSec: 30 } },
        { dayOfWeek: 3, slotType: "fullbody_b_hinge", sets: 4, reps: "12-20", rpe: 8, firstSetWarmup: true, finisher: { rounds: 3, workSec: 30, restSec: 30 } },
        { dayOfWeek: 5, slotType: "fullbody_a_squat", sets: 4, reps: "12-20", rpe: 8, firstSetWarmup: true, finisher: { rounds: 3, workSec: 30, restSec: 30 } },
      ]},
    ]),
  },
  {
    id: "prog_starter_cond_4w",
    kind: "program",
    labelKo: "운동 시작 4주 체력 만들기",
    labelEn: "Starter Conditioning 4W",
    descriptionKo: "4주 · 주 3회 · 운동 입문 1개월 체력 빌드업",
    weeks: 4,
    chapters: 1,
    sessionsPerWeek: 3,
    engineGoal: "general_fitness",
    match: { goal: ["endurance"] },
    setTemplate: TEMPLATE_HEALTH,
    experienceWarning: "starter",
    weeklyMatrix: buildMatrix([
      // W1 적응 — 매우 보수적 RPE 6
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "starter_fullbody", sets: 2, reps: "10-12", rpe: 6, firstSetWarmup: true },
        { dayOfWeek: 3, slotType: "starter_fullbody", sets: 2, reps: "10-12", rpe: 6, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "starter_fullbody", sets: 2, reps: "10-12", rpe: 6, firstSetWarmup: true },
      ]},
      // W2 안정 — 세트 +1
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "starter_fullbody", sets: 3, reps: "10-12", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 3, slotType: "starter_fullbody", sets: 3, reps: "10-12", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "starter_fullbody", sets: 3, reps: "10-12", rpe: 7, firstSetWarmup: true },
      ]},
      // W3 Linear progression 시작 (Rippetoe)
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "starter_fullbody", sets: 3, reps: "10-15", rpe: 7, firstSetWarmup: true, linearProgression: true },
        { dayOfWeek: 3, slotType: "starter_fullbody", sets: 3, reps: "10-15", rpe: 7, firstSetWarmup: true, linearProgression: true },
        { dayOfWeek: 5, slotType: "starter_fullbody", sets: 3, reps: "10-15", rpe: 7, firstSetWarmup: true, linearProgression: true },
      ]},
      // W4 마무리 + 30s 등척 finisher
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "starter_fullbody", sets: 3, reps: "10-15", rpe: 7, firstSetWarmup: true, linearProgression: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 3, slotType: "starter_fullbody", sets: 3, reps: "10-15", rpe: 7, firstSetWarmup: true, linearProgression: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 5, slotType: "starter_fullbody", sets: 3, reps: "10-15", rpe: 7, firstSetWarmup: true, linearProgression: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
      ]},
    ]),
  },

  // ⑤ 목적별 — health (자세·부상 회피·시니어)
  {
    id: "prog_posture_8w",
    kind: "program",
    labelKo: "거북목·굽은등 교정 8주",
    labelEn: "Posture Fix 8W",
    descriptionKo: "8주 (4주 × 2) · 등·후면 어깨 강화 + 등척 hold (Janda UCS)",
    weeks: 8,
    chapters: 2,
    sessionsPerWeek: 4,
    engineGoal: "general_fitness",
    match: { goal: ["health"] },
    setTemplate: TEMPLATE_HEALTH,
    weeklyMatrix: buildMatrix([
      // Activation 4주 — RPE 6, 폼 우선, hold 30s
      { weeks: 4, days: [
        { dayOfWeek: 1, slotType: "posture_thoracic_pull", slots: 5, sets: 3, reps: "12-15", rpe: 6, firstSetWarmup: true },
        { dayOfWeek: 2, slotType: "posture_core_glute", slots: 4, sets: 3, reps: "10-12", rpe: 6 },
        { dayOfWeek: 4, slotType: "posture_scap_rotator", slots: 5, sets: 3, reps: "12-15", rpe: 6 },
        { dayOfWeek: 5, slotType: "posture_thoracic_rotation", slots: 5, sets: 3, reps: "12-15", rpe: 6 },
      ]},
      // Strengthening 4주 — RPE 7, hold 45-60s
      { weeks: 4, days: [
        { dayOfWeek: 1, slotType: "posture_thoracic_pull", slots: 5, sets: 4, reps: "10-12", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 2, slotType: "posture_core_glute", slots: 4, sets: 3, reps: "12-15", rpe: 7 },
        { dayOfWeek: 4, slotType: "posture_scap_rotator", slots: 5, sets: 4, reps: "12-15", rpe: 7 },
        { dayOfWeek: 5, slotType: "posture_thoracic_rotation", slots: 5, sets: 4, reps: "10-12", rpe: 7 },
      ]},
    ]),
  },
  {
    id: "prog_shoulder_safe_4w",
    kind: "program",
    labelKo: "어깨 부상 회피 가슴 루틴",
    labelEn: "Shoulder-Safe Chest 4W",
    descriptionKo: "4주 · 어깨 부담 없는 가슴 + 회전근개 보강",
    weeks: 4,
    chapters: 1,
    sessionsPerWeek: 3,
    engineGoal: "general_fitness",
    match: { goal: ["health"] },
    setTemplate: TEMPLATE_HEALTH,
    experienceWarning: "shoulder_safe",
    weeklyMatrix: buildMatrix([
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "chest_safe_a", slots: 5, sets: 3, reps: "12-15", rpe: 6, firstSetWarmup: true },
        { dayOfWeek: 2, slotType: "shoulder_rehab", slots: 4, sets: 3, reps: "12-15", rpe: 6 },
        { dayOfWeek: 4, slotType: "chest_safe_b", slots: 4, sets: 3, reps: "12-15", rpe: 6 },
      ]},
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "chest_safe_a", slots: 5, sets: 3, reps: "10-12", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 2, slotType: "shoulder_rehab", slots: 4, sets: 3, reps: "10-12", rpe: 7 },
        { dayOfWeek: 4, slotType: "chest_safe_b", slots: 4, sets: 3, reps: "10-12", rpe: 7 },
      ]},
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "chest_safe_a", slots: 5, sets: 4, reps: "10-12", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 2, slotType: "shoulder_rehab", slots: 4, sets: 3, reps: "10-12", rpe: 7 },
        { dayOfWeek: 4, slotType: "chest_safe_b", slots: 4, sets: 4, reps: "10-12", rpe: 7 },
      ]},
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "chest_safe_a", slots: 5, sets: 4, reps: "10-12", rpe: 7.5, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 2, slotType: "shoulder_rehab", slots: 4, sets: 3, reps: "10-12", rpe: 7.5 },
        { dayOfWeek: 4, slotType: "chest_safe_b", slots: 4, sets: 4, reps: "10-12", rpe: 7.5, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
      ]},
    ]),
  },
  {
    id: "prog_senior_4w",
    kind: "program",
    labelKo: "시니어 입문 4주",
    labelEn: "Senior Starter 4W",
    descriptionKo: "4주 · 무릎·허리 부담 없는 풀바디 + 등척 (NSCA 권장)",
    weeks: 4,
    chapters: 1,
    sessionsPerWeek: 3,
    engineGoal: "general_fitness",
    match: { goal: ["health"] },
    setTemplate: TEMPLATE_HEALTH,
    experienceWarning: "senior_safe",
    weeklyMatrix: buildMatrix([
      // W1 적응 — RPE 5-6 / 50% 1RM (NSCA 노인 권장)
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "senior_fullbody", sets: 2, reps: "10-12", rpe: 5.5, firstSetWarmup: true },
        { dayOfWeek: 3, slotType: "senior_fullbody", sets: 2, reps: "10-12", rpe: 5.5, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "senior_fullbody", sets: 2, reps: "10-12", rpe: 5.5, firstSetWarmup: true },
      ]},
      // W2 안정 — 세트 +1
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "senior_fullbody", sets: 3, reps: "10-12", rpe: 6, firstSetWarmup: true },
        { dayOfWeek: 3, slotType: "senior_fullbody", sets: 3, reps: "10-12", rpe: 6, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "senior_fullbody", sets: 3, reps: "10-12", rpe: 6, firstSetWarmup: true },
      ]},
      // W3 점진 — 무게 약간 ↑
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "senior_fullbody", sets: 3, reps: "10-12", rpe: 6.5, firstSetWarmup: true },
        { dayOfWeek: 3, slotType: "senior_fullbody", sets: 3, reps: "10-12", rpe: 6.5, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "senior_fullbody", sets: 3, reps: "10-12", rpe: 6.5, firstSetWarmup: true },
      ]},
      // W4 마무리 — RPE 7 / 60% 1RM + 등척 hold
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "senior_fullbody", sets: 3, reps: "10-12", rpe: 7, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 3, slotType: "senior_fullbody", sets: 3, reps: "10-12", rpe: 7, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 5, slotType: "senior_fullbody", sets: 3, reps: "10-12", rpe: 7, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
      ]},
    ]),
  },

  // ⑤ 캠페인 — 여성 한정 (28일 cycle × 3 = 12주 정확 정렬)
  {
    id: "camp_cycle_diet_12w",
    kind: "campaign",
    labelKo: "생리주기 다이어트 3개월",
    labelEn: "Cycle-Sync Diet 12W",
    descriptionKo: "12주 · 28일 cycle × 3 / Phase별 강도·substrate 매칭",
    weeks: 12,
    chapters: 3,
    sessionsPerWeek: 4,
    engineGoal: "fat_loss",
    match: { goal: ["fat_loss"], gender: ["female"] },
    setTemplate: TEMPLATE_FAT_LOSS,
    // 1 cycle (28일) = W1 Menstrual + W2 Follicular + W3 Early Luteal + W4 Late Luteal
    weeklyMatrix: buildMatrix([
      // Cycle 1 (W1-W4): Adaptation
      // W1 Menstrual — 저강도 + 액티브 회복
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "upper_low_intensity", sets: 2, reps: "12-15", rpe: 5 },
        { dayOfWeek: 3, slotType: "upper_low_intensity", sets: 2, reps: "12-15", rpe: 5 },
        { dayOfWeek: 5, slotType: "upper_low_intensity", sets: 2, reps: "12-15", rpe: 5 },
      ]},
      // W2 Follicular — 고강도 power week
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "upper_a_push_emphasis", sets: 4, reps: "8-12", rpe: 8, firstSetWarmup: true },
        { dayOfWeek: 2, slotType: "lower_a_squat_glute", sets: 4, reps: "8-12", rpe: 8, firstSetWarmup: true },
        { dayOfWeek: 4, slotType: "upper_b_pull_emphasis", sets: 4, reps: "8-12", rpe: 8, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "lower_b_hinge_glute", sets: 4, reps: "8-12", rpe: 8, firstSetWarmup: true },
      ]},
      // W3 Early Luteal — 중강도 cardio week
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "upper_low_intensity", sets: 3, reps: "12-15", rpe: 7 },
        { dayOfWeek: 3, slotType: "lower_low", sets: 3, reps: "12-15", rpe: 7 },
        { dayOfWeek: 5, slotType: "upper_low_intensity", sets: 3, reps: "12-15", rpe: 7 },
      ]},
      // W4 Late Luteal — 저강도 PMS recovery
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "upper_low_intensity", sets: 2, reps: "12-15", rpe: 6 },
        { dayOfWeek: 3, slotType: "lower_low", sets: 2, reps: "12-15", rpe: 6 },
        { dayOfWeek: 5, slotType: "upper_low_intensity", sets: 2, reps: "12-15", rpe: 6 },
      ]},
      // Cycle 2 (W5-W8): Build — 강도 ↑
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "upper_low_intensity", sets: 2, reps: "12-15", rpe: 5 },
        { dayOfWeek: 3, slotType: "upper_low_intensity", sets: 2, reps: "12-15", rpe: 5 },
        { dayOfWeek: 5, slotType: "upper_low_intensity", sets: 2, reps: "12-15", rpe: 5 },
      ]},
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "upper_a_push_emphasis", sets: 4, reps: "6-10", rpe: 8.5, firstSetWarmup: true },
        { dayOfWeek: 2, slotType: "lower_a_squat_glute", sets: 4, reps: "6-10", rpe: 8.5, firstSetWarmup: true },
        { dayOfWeek: 4, slotType: "upper_b_pull_emphasis", sets: 4, reps: "6-10", rpe: 8.5, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "lower_b_hinge_glute", sets: 4, reps: "6-10", rpe: 8.5, firstSetWarmup: true },
      ]},
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "upper_low_intensity", sets: 3, reps: "12-15", rpe: 7 },
        { dayOfWeek: 3, slotType: "lower_low", sets: 3, reps: "12-15", rpe: 7 },
        { dayOfWeek: 5, slotType: "upper_low_intensity", sets: 3, reps: "12-15", rpe: 7 },
      ]},
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "upper_low_intensity", sets: 2, reps: "12-15", rpe: 6 },
        { dayOfWeek: 3, slotType: "lower_low", sets: 2, reps: "12-15", rpe: 6 },
        { dayOfWeek: 5, slotType: "upper_low_intensity", sets: 2, reps: "12-15", rpe: 6 },
      ]},
      // Cycle 3 (W9-W12): Peak — 강도 maximum (Follicular PR 시도)
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "upper_low_intensity", sets: 2, reps: "12-15", rpe: 5 },
        { dayOfWeek: 3, slotType: "upper_low_intensity", sets: 2, reps: "12-15", rpe: 5 },
        { dayOfWeek: 5, slotType: "upper_low_intensity", sets: 2, reps: "12-15", rpe: 5 },
      ]},
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "upper_a_push_emphasis", sets: 4, reps: "5-8", rpe: 9, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 2, slotType: "lower_a_squat_glute", sets: 4, reps: "5-8", rpe: 9, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 4, slotType: "upper_b_pull_emphasis", sets: 4, reps: "5-8", rpe: 9, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 5, slotType: "lower_b_hinge_glute", sets: 4, reps: "5-8", rpe: 9, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
      ]},
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "upper_low_intensity", sets: 3, reps: "12-15", rpe: 7 },
        { dayOfWeek: 3, slotType: "lower_low", sets: 3, reps: "12-15", rpe: 7 },
        { dayOfWeek: 5, slotType: "upper_low_intensity", sets: 3, reps: "12-15", rpe: 7 },
      ]},
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "upper_low_intensity", sets: 2, reps: "12-15", rpe: 6 },
        { dayOfWeek: 3, slotType: "lower_low", sets: 2, reps: "12-15", rpe: 6 },
        { dayOfWeek: 5, slotType: "upper_low_intensity", sets: 2, reps: "12-15", rpe: 6 },
      ]},
    ]),
  },

  // ⑥ 캠페인 — 단기 이벤트
  {
    id: "camp_vacation_arms_7d",
    kind: "campaign",
    labelKo: "휴가 전 7일 팔뚝",
    labelEn: "Vacation Arms 7D",
    descriptionKo: "1주 단기 · 팔 specialization + 펌프 + 글리코겐 saturation",
    weeks: 1,
    chapters: 1,
    sessionsPerWeek: 4,
    engineGoal: "muscle_gain",
    match: {},
    setTemplate: TEMPLATE_HYPERTROPHY,
    weeklyMatrix: buildMatrix([
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "arms_main_1", slots: 6, sets: 4, reps: "8-12", rpe: 8, firstSetWarmup: true },
        { dayOfWeek: 2, slotType: "fullbody_a_squat", sets: 3, reps: "12-15", rpe: 6 }, // 회복 자극
        { dayOfWeek: 3, slotType: "arms_bicep_focus", slots: 5, sets: 4, reps: "10-15", rpe: 8, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "arms_tricep_focus", slots: 5, sets: 4, reps: "10-15", rpe: 8, firstSetWarmup: true },
        { dayOfWeek: 6, slotType: "arms_pump_finisher", slots: 3, sets: 3, reps: "12-15", rpe: 7, finisher: { rounds: 1, workSec: 60, restSec: 0 } },
      ]},
    ]),
  },
  {
    id: "camp_advanced_back_4w",
    kind: "campaign",
    labelKo: "상급자 등 루틴",
    labelEn: "Advanced Back 4W",
    descriptionKo: "4주 · 등 두께·넓이 동시 공략 (Nippard Block 1 단축)",
    weeks: 4,
    chapters: 1,
    sessionsPerWeek: 3,
    engineGoal: "muscle_gain",
    match: { minExperienceMonths: 12 },
    setTemplate: TEMPLATE_HYPERTROPHY,
    experienceWarning: "advanced",
    weeklyMatrix: buildMatrix([
      // W1 적응
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "back_thickness", slots: 5, sets: 3, reps: "8-12", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 3, slotType: "back_width", slots: 5, sets: 3, reps: "8-12", rpe: 7, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "back_volume", slots: 5, sets: 3, reps: "12-15", rpe: 7, firstSetWarmup: true },
      ]},
      // W2 volume ↑
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "back_thickness", slots: 5, sets: 4, reps: "8-12", rpe: 7.5, firstSetWarmup: true },
        { dayOfWeek: 3, slotType: "back_width", slots: 5, sets: 4, reps: "8-12", rpe: 7.5, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "back_volume", slots: 5, sets: 4, reps: "12-15", rpe: 7.5, firstSetWarmup: true },
      ]},
      // W3 강도 ↑
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "back_thickness", slots: 5, sets: 4, reps: "6-10", rpe: 8, firstSetWarmup: true },
        { dayOfWeek: 3, slotType: "back_width", slots: 5, sets: 4, reps: "6-10", rpe: 8, firstSetWarmup: true },
        { dayOfWeek: 5, slotType: "back_volume", slots: 5, sets: 4, reps: "10-15", rpe: 8, firstSetWarmup: true },
      ]},
      // W4 finisher
      { weeks: 1, days: [
        { dayOfWeek: 1, slotType: "back_thickness", slots: 5, sets: 4, reps: "6-10", rpe: 8.5, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 3, slotType: "back_width", slots: 5, sets: 4, reps: "6-10", rpe: 8.5, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
        { dayOfWeek: 5, slotType: "back_volume", slots: 5, sets: 4, reps: "10-15", rpe: 8.5, firstSetWarmup: true, finisher: { rounds: 1, workSec: 30, restSec: 0 } },
      ]},
    ]),
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
