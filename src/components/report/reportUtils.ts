export function translateDesc(desc: string, locale: string): string {
  if (locale === "ko") return desc;
  return desc
    // 복합 먼저 (회의 21: 서버 실제 포맷 "상체(당기기)" 매칭)
    .replace(/상체\(밀기\)/g, "Upper (Push)").replace(/상체\(당기기\)/g, "Upper (Pull)")
    .replace(/상체 \+ 밀기/g, "Upper + Push").replace(/상체 \+ 당기기/g, "Upper + Pull")
    // 단일 부위
    .replace(/하체/g, "Lower").replace(/상체/g, "Upper").replace(/가슴/g, "Chest").replace(/등/g, "Back")
    .replace(/어깨/g, "Shoulders").replace(/팔/g, "Arms")
    .replace(/밀기/g, "Push").replace(/당기기/g, "Pull")
    .replace(/(\d+)종/g, "$1 exercises").replace(/(\d+)세트/g, "$1 sets")
    .replace(/집중 운동/g, "Focus")
    .replace(/인터벌 러닝/g, "Interval Running").replace(/이지 런/g, "Easy Run").replace(/장거리 러닝/g, "Long Distance Run")
    .replace(/러너 코어/g, "Runner Core").replace(/맨몸 \+ 덤벨 전신 서킷/g, "Bodyweight + Dumbbell Circuit")
    .replace(/근비대/g, "Hypertrophy").replace(/근력 강화/g, "Strength")
    .replace(/체지방 감량/g, "Fat Loss").replace(/전반적 체력 향상/g, "General Fitness")
    .replace(/살 빼기/g, "Fat Loss").replace(/근육 키우기/g, "Muscle Gain").replace(/힘 세지기/g, "Strength").replace(/기초체력강화/g, "Fitness").replace(/기초체력/g, "Fitness")
    .replace(/홈트레이닝/g, "Home Training").replace(/러닝/g, "Running")
    .replace(/상체 뻣뻣함 개선/g, "Upper stiffness relief").replace(/하체 무거움 완화/g, "Lower heaviness relief")
    .replace(/전반적 피로 회복/g, "Fatigue recovery").replace(/최적 컨디션/g, "Optimal condition");
}
