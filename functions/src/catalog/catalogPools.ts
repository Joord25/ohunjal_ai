/**
 * Catalog Slot Pools — 회의 ζ-5 (2026-04-30) 슬롯 풀 SSOT (서버 전용).
 *
 * 보안: 슬롯 운동 풀은 서버에 둠. 클라(programCatalog.ts)는 weeklyMatrix structure 만 보유.
 * [.claude/rules/cloud-functions.md] 보안 아키텍처 정합.
 *
 * 슬롯 풀 = 자극·근육·동작 패턴이 같은 유사 운동 그룹.
 * 룰엔진은 (slotType, weekIndex, dayOfWeek) 받아 결정적 랜덤으로 운동 1개씩 선택.
 *
 * 디자인 원칙 (회의 ζ-5):
 * - 막바꾸지 X — 슬롯은 고정, 슬롯 안에서만 유사 운동 대체
 * - 랜덤 시드: (weekIndex × 7 + dayOfWeek) — 같은 주 같은 요일 = 같은 운동 (재방문 일관)
 * - 다음 주차 = 다른 운동 선택 (지루함 ↓)
 */

/**
 * 슬롯 정의 — 한 슬롯 안에 같은 자극의 유사 운동 그룹.
 * label: 사용자 표시용 슬롯 라벨 (예: "가슴 컴파운드")
 * exercises: 유사 운동 그룹 (랜덤 선택 대상)
 */
export interface CatalogSlot {
  /** 슬롯 라벨 (사용자 표시용, KO) */
  label: string;
  /** 유사 운동 그룹 — 룰엔진이 결정적 랜덤으로 1개 선택 */
  exercises: string[];
  /** 운동 role — 무게 가이드 적용에 사용 */
  role: "compound" | "accessory" | "isolation" | "light" | "bodyweight";
  /** 등척 hold 여부 — true면 reps = "30s 유지" 같은 시간 표기, FitScreen isStaticHold 자동 처리 */
  isStaticHold?: boolean;
}

/**
 * slotType → 슬롯 배열 매핑.
 * 키 예: "upper_push_focus" / "lower_squat_focus" / "posture_thoracic_pull" 등
 * 각 slotType 은 4-5 슬롯으로 구성됨 (matrix.slots 와 매칭).
 *
 * 신규 카탈로그 추가 시 본 모듈에 slotType 추가만 하면 룰엔진 자동 처리.
 */
export const CATALOG_SLOT_POOLS: Record<string, CatalogSlot[]> = {
  // ────────── prog_summer_diet_12w / prog_diet_16w (2분할 4일) ──────────
  // P3 단계에서 채워질 예정 — Phase 1 = 골격만
  // upper_push: { ... }
  // upper_pull: { ... }
  // lower_squat: { ... }
  // lower_hinge: { ... }

  // ────────── prog_quick_diet_4w (2분할 + MetCon) ──────────
  // upper_compound, lower_compound, upper_volume, lower_volume, metcon_circuit

  // ────────── prog_muscle_8w (2분할 4일, 글루트 강조) ──────────
  // upper_a_push_emphasis, lower_a_squat_glute, upper_b_pull_emphasis, lower_b_hinge_glute

  // ────────── prog_inbody_d_12w (5일 PPL 변형) ──────────
  // push_a, pull_a, legs_squat_focus, push_b, legs_hinge_focus

  // ────────── prog_posture_8w (자세 4면) ──────────
  // posture_thoracic_pull, posture_core_glute, posture_scap_rotator, posture_thoracic_rotation

  // ────────── prog_2split_8w (Rippetoe 3일) ──────────
  // upper_push_focus, upper_pull_focus, lower_squat_focus, lower_hinge_focus, lower_full

  // ────────── camp_cycle_diet_12w (Phase별) ──────────
  // upper_low_intensity, upper_volume_phase, lower_low

  // ────────── prog_hiit_8w ──────────
  // hiit_long_interval (4×4분), hiit_medium_interval (8×2분)

  // ────────── prog_fullbody_cond_8w ──────────
  // fullbody_a_squat, fullbody_b_hinge

  // ────────── prog_starter_cond_4w ──────────
  // starter_fullbody (단일)

  // ────────── camp_vacation_arms_7d ──────────
  // arms_main_1, arms_bicep_focus, arms_tricep_focus, arms_pump_finisher

  // ────────── prog_max_strength_8w (Wendler 5/3/1) ──────────
  // wendler_squat_day, wendler_bench_day, wendler_deadlift_day, wendler_ohp_day

  // ────────── camp_advanced_back_4w ──────────
  // back_thickness, back_width, back_volume

  // ────────── prog_shoulder_safe_4w ──────────
  // chest_safe_a, chest_safe_b, shoulder_rehab

  // ────────── prog_senior_4w ──────────
  // senior_fullbody
};

/**
 * 결정적 랜덤 선택 (시드 기반).
 * 같은 (slotType, weekIndex, dayOfWeek, slotIndex) 입력 = 같은 운동 반환.
 * 다음 주차 = 다른 운동.
 */
export function pickFromSlot(
  slotType: string,
  slotIndex: number,
  weekIndex: number,
  dayOfWeek: number,
): string | null {
  const pool = CATALOG_SLOT_POOLS[slotType];
  if (!pool || !pool[slotIndex]) return null;
  const exercises = pool[slotIndex].exercises;
  if (exercises.length === 0) return null;
  // 시드 = (week × 7 + dow) × 31 + slotIndex (mod pool size)
  const seed = ((weekIndex * 7 + dayOfWeek) * 31 + slotIndex) % exercises.length;
  return exercises[seed];
}

/**
 * slotType 의 슬롯 개수 반환 (검증용).
 */
export function getSlotCount(slotType: string): number {
  return CATALOG_SLOT_POOLS[slotType]?.length ?? 0;
}

/**
 * 모든 등록된 slotType 목록 (검증용).
 */
export function listSlotTypes(): string[] {
  return Object.keys(CATALOG_SLOT_POOLS);
}
