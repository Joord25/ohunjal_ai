/**
 * 정적 홀드(등척성) 운동 판정 — 플랜 미리보기와 FitScreen이 공유하는 SSOT.
 *
 * 회의 2026-04-28: MasterPlanPreview에 분산되어 있던 isHoldExercise 로직을 추출.
 * FitScreen의 isTimerMode 분기와 동일 로직을 쓰도록 통일 — 플랜에서 "X초 유지"로
 * 보였던 운동이 실제 운동 화면에서도 타이머 모드로 진행되어 사용자 기대 일치.
 *
 * 새 등척성 운동 추가 시:
 *  1) name 패턴이 기존 (플랭크/할로우 등)에 맞으면 → 자동 적용
 *  2) 그 외 신규 (예: 데드 행, 월 싯, L-싯) → 서버에서 count: "30초 유지" 형태로 박으면 자동 적용
 *  3) name 패턴 추가 필요하면 NAME_PATTERN 만 수정
 */

const NAME_PATTERN = /(플랭크|plank|할로우\s?홀드|hollow\s?hold)/i;
// 동작성 운동(잭/숄더탭/롤아웃/크런치 등)은 plank 이름이 들어가도 hold 아님
const EXCLUDE_PATTERN = /(잭|jack|숄더|shoulder|롤아웃|rollout|크런치|crunch)/i;
// count 텍스트에 "X초 유지" / "X sec hold" 패턴 — 미래 신규 hold 운동 자동 감지
const HOLD_COUNT_PATTERN = /\d+\s*초\s*유지|\d+\s*sec\s*hold/i;

/** 정적 hold 운동인지 판정. */
export function isHoldExercise(name: string, count?: string): boolean {
  if (EXCLUDE_PATTERN.test(name)) return false;
  if (NAME_PATTERN.test(name)) return true;
  if (count && HOLD_COUNT_PATTERN.test(count)) return true;
  return false;
}

/**
 * Hold 운동의 목표 초 수 파싱.
 *  "30-45초 유지" → 45 (상한 우선 — 플랜 미리보기와 동일)
 *  "30초 유지"   → 30
 *  파싱 실패 → repsFallback (서버 reps 필드 — 보통 1, hold 자체 1세트당 시간 정보 없을 때)
 */
export function parseHoldDurationSec(count: string | undefined, repsFallback: number = 30): number {
  if (!count) return repsFallback;
  const m = count.match(/(\d+)(?:\s*[-~]\s*(\d+))?\s*(?:초|sec)/i);
  if (m) {
    return parseInt(m[2] || m[1], 10);
  }
  return repsFallback;
}
