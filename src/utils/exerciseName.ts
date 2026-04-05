/**
 * 운동 이름에서 locale에 맞는 이름 추출
 *
 * 형태: "바벨 백 스쿼트 (Barbell Back Squat)"
 * → ko: "바벨 백 스쿼트 (Barbell Back Squat)" (원본 그대로)
 * → en: "Barbell Back Squat" (괄호 안 영어만)
 *
 * 괄호 없는 경우: 원본 그대로 반환
 */
export function getExerciseName(name: string, locale: string): string {
  if (locale === "ko") return name.split("(")[0].trim();

  // 괄호 안 영어 추출: "한글 (English Name)" → "English Name"
  const match = name.match(/\(([^)]+)\)/);
  if (match) return match[1];

  // 괄호 없으면 원본 반환
  return name;
}

/**
 * 서버(workoutEngine)가 리턴하는 한글 무게 가이드 문자열을 locale에 맞게 번역.
 * 회의 20: EN 모드에서 MasterPlanPreview + FitScreen 공통 사용.
 */
const WEIGHT_GUIDE_MAP: Record<string, string> = {
  "가능한 최대 무게": "Go heavy",
  "적당한 무게": "Moderate",
  "가벼운 무게": "Light",
  "중간 무게": "Medium",
  "가벼운~중간 무게": "Light–Med",
  "점진적 증량": "Add weight",
  "점진적 증량 (매 세트 무게 UP)": "Add weight each set",
  "도전적인 무게": "Challenge",
  "맨몸": "Bodyweight",
  "맨몸 또는 가벼운 무게": "Bodyweight or light",
  "가볍게 반복 가능한 무게": "Easy reps",
  "8회가 힘든 무게": "8-rep max",
  "10회가 힘든 무게": "10-rep max",
  "12-15회 가능한 무게": "12-15 reps",
  "15회 이상 가능한 무게": "15+ reps",
  "20회 이상 가능한 무게": "20+ reps",
};

export function translateWeightGuide(weight: string, locale: string): string {
  if (locale === "ko") return weight;
  return WEIGHT_GUIDE_MAP[weight] || weight;
}
