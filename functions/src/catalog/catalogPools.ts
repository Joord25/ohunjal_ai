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

export interface CatalogSlot {
  /** 슬롯 라벨 (사용자 표시용, KO) */
  label: string;
  /** 유사 운동 그룹 — 룰엔진이 결정적 랜덤으로 1개 선택 */
  exercises: string[];
  /** 운동 role — 무게 가이드 적용에 사용 */
  role: "compound" | "accessory" | "isolation" | "light" | "bodyweight";
  /** 등척 hold 여부 — true면 reps = 시간(초) 으로 사용, FitScreen isStaticHold 자동 처리 */
  isStaticHold?: boolean;
  /**
   * 회의 ζ-5 정정 (2026-04-30): 등척 hold 운동 시간(초). 운동 이름은 클라 풀과 매칭되되 hold 시간은 슬롯에서 박음.
   * 기본값 = 30s. 슬롯 자극에 따라 다르게 (예: 45, 60).
   */
  holdSeconds?: number;
}

export const CATALOG_SLOT_POOLS: Record<string, CatalogSlot[]> = {
  // ════════════ 다이어트 그룹 (summer_diet_12w, diet_16w) ════════════
  upper_push: [
    { label: "가슴 horizontal push compound", role: "compound", exercises: ["바벨 벤치 프레스 (Barbell Bench Press)", "인클라인 바벨 프레스 (Incline Barbell Bench Press)", "덤벨 벤치 프레스 (Dumbbell Bench Press)", "스미스 벤치 프레스 (Smith Bench Press)"] },
    { label: "가슴 보조", role: "accessory", exercises: ["인클라인 덤벨 프레스 (Incline Dumbbell Press)", "트라이셉스 딥스 (Tricep Dips)", "케이블 크로스오버 (Cable Crossover)", "펙덱 플라이 (Pec Deck Fly)"] },
    { label: "어깨", role: "accessory", exercises: ["오버헤드 프레스 (Overhead Press)", "덤벨 숄더 프레스 (Dumbbell Shoulder Press)", "머신 숄더 프레스 (Machine Shoulder Press)", "사이드 레터럴 레이즈 (Side Lateral Raises)"] },
    { label: "삼두 isolation", role: "isolation", exercises: ["케이블 푸쉬 다운 (Cable Pushdown)", "오버헤드 트라이셉 익스텐션 (Overhead Tricep Extension)", "스컬 크러셔 (Skullcrushers)"] },
  ],
  upper_pull: [
    { label: "등 vertical pull", role: "compound", exercises: ["풀업 (Pull-ups)", "랫 풀다운 (Lat Pulldown)", "클로즈그립 풀다운 (Close-Grip Pulldown)"] },
    { label: "등 horizontal pull", role: "compound", exercises: ["시티드 케이블 로우 (Seated Cable Row)", "벤트오버 바벨 로우 (Bent-over Barbell Row)", "체스트 서포티드 로우 (Chest Supported Row)", "T-바 로우 (T-Bar Row)"] },
    { label: "후면 어깨", role: "isolation", exercises: ["케이블 페이스풀 (Cable Face Pull)", "리어 델트 플라이 (Rear Delt Fly)"] },
    { label: "이두 isolation", role: "isolation", exercises: ["바벨 컬 (Barbell Curl)", "해머 컬 (Hammer Curl)", "덤벨 프리쳐 컬 (Dumbbell Preacher Curl)", "케이블 바이셉 컬 (Cable Bicep Curl)"] },
  ],
  lower_squat: [
    { label: "무릎 dominant compound", role: "compound", exercises: ["바벨 백 스쿼트 (Barbell Back Squat)", "프론트 스쿼트 (Front Squat)", "핵 스쿼트 (Hack Squat)"] },
    { label: "단일다리 무릎 dominant", role: "accessory", exercises: ["워킹 런지 (Walking Lunges)", "불가리안 스플릿 스쿼트 (Bulgarian Split Squat)", "리버스 런지 (Reverse Lunges)"] },
    { label: "대퇴사두 isolation", role: "isolation", exercises: ["레그 익스텐션 (Leg Extension)", "레그 프레스 (Leg Press)"] },
    { label: "카프", role: "isolation", exercises: ["시티드 카프 레이즈 (Seated Calf Raises)", "스탠딩 카프 레이즈 (Standing Calf Raises)"] },
  ],
  lower_hinge: [
    { label: "힌지 compound", role: "compound", exercises: ["컨벤셔널 데드리프트 (Conventional Deadlift)", "스모 데드리프트 (Sumo Deadlift)", "트랩바 데드리프트 (Trap Bar Deadlift)"] },
    { label: "힙 dominant", role: "accessory", exercises: ["루마니안 데드리프트 (Romanian Deadlift)", "굿모닝 (Bodyweight Good Morning)"] },
    { label: "글루트", role: "accessory", exercises: ["바벨 힙 쓰러스트 (Barbell Hip Thrust)", "글루트 브릿지 (Glute Bridge)", "케이블 풀 스루 (Cable Pull-Through)"] },
    { label: "햄스트링 isolation", role: "isolation", exercises: ["시티드 레그 컬 (Seated Leg Curl)", "라잉 레그 컬 (Lying Leg Curl)"] },
  ],

  // ════════════ quick_diet_4w (4 슬롯, 컴파운드 + MetCon) ════════════
  upper_compound: [
    { label: "가슴 horizontal push", role: "compound", exercises: ["바벨 벤치 프레스 (Barbell Bench Press)", "인클라인 바벨 프레스 (Incline Barbell Bench Press)", "덤벨 벤치 프레스 (Dumbbell Bench Press)", "스미스 벤치 프레스 (Smith Bench Press)"] },
    { label: "등 vertical pull", role: "compound", exercises: ["풀업 (Pull-ups)", "랫 풀다운 (Lat Pulldown)"] },
    { label: "어깨 vertical push", role: "compound", exercises: ["오버헤드 프레스 (Overhead Press)", "머신 숄더 프레스 (Machine Shoulder Press)"] },
    { label: "등 horizontal pull", role: "compound", exercises: ["시티드 케이블 로우 (Seated Cable Row)", "벤트오버 바벨 로우 (Bent-over Barbell Row)"] },
  ],
  lower_compound: [
    { label: "무릎 dominant", role: "compound", exercises: ["바벨 백 스쿼트 (Barbell Back Squat)", "프론트 스쿼트 (Front Squat)", "핵 스쿼트 (Hack Squat)"] },
    { label: "힌지 dominant", role: "compound", exercises: ["컨벤셔널 데드리프트 (Conventional Deadlift)", "트랩바 데드리프트 (Trap Bar Deadlift)", "루마니안 데드리프트 (Romanian Deadlift)"] },
    { label: "단일다리", role: "accessory", exercises: ["워킹 런지 (Walking Lunges)", "불가리안 스플릿 스쿼트 (Bulgarian Split Squat)"] },
    { label: "글루트 + 햄", role: "accessory", exercises: ["바벨 힙 쓰러스트 (Barbell Hip Thrust)", "레그 컬 (Leg Curl)"] },
  ],
  upper_volume: [
    { label: "가슴 보조 펌프", role: "accessory", exercises: ["인클라인 덤벨 프레스 (Incline Dumbbell Press)", "트라이셉스 딥스 (Tricep Dips)", "케이블 크로스오버 (Cable Crossover)", "펙덱 플라이 (Pec Deck Fly)"] },
    { label: "등 보조", role: "accessory", exercises: ["케이블 로우 (Cable Row)", "T-바 로우 (T-Bar Row)"] },
    { label: "어깨 isolation", role: "isolation", exercises: ["사이드 레터럴 레이즈 (Side Lateral Raises)", "케이블 페이스풀 (Cable Face Pull)"] },
    { label: "팔 isolation", role: "isolation", exercises: ["케이블 바이셉 컬 (Cable Bicep Curl)", "해머 컬 (Hammer Curl)", "케이블 푸쉬 다운 (Cable Pushdown)", "스컬 크러셔 (Skullcrushers)"] },
  ],
  lower_volume: [
    { label: "대퇴사두 isolation", role: "isolation", exercises: ["레그 익스텐션 (Leg Extension)", "레그 프레스 (Leg Press)"] },
    { label: "햄 isolation", role: "isolation", exercises: ["시티드 레그 컬 (Seated Leg Curl)", "라잉 레그 컬 (Lying Leg Curl)"] },
    { label: "글루트 보조", role: "accessory", exercises: ["힙 어덕션 머신 (Hip Adduction Machine)", "힙 어브덕션 머신 (Hip Abduction Machine)", "케이블 킥백 (Cable Kickback)"] },
    { label: "카프 + 코어", role: "isolation", exercises: ["스탠딩 카프 레이즈 (Standing Calf Raises)", "행잉 니 레이즈 (Hanging Knee Raise)", "플랭크 (Plank)"], isStaticHold: false },
  ],
  metcon_circuit: [
    { label: "전신 폭발 (스윙·클린)", role: "compound", exercises: ["케틀벨 스윙 (Kettlebell Swing)", "덤벨 쓰러스터 (Dumbbell Thruster)", "케틀벨 스윙 (Kettlebell Swing)"] },
    { label: "심폐 폭발 (버피·점프)", role: "bodyweight", exercises: ["버피 (Burpees)", "마운틴 클라이머 (Mountain Climbers)", "스쿼트 점프 (Squat Jumps)"] },
    { label: "체중 push", role: "bodyweight", exercises: ["푸쉬업 (Push-up)", "디클라인 푸쉬업 (Decline Push-up)"] },
    { label: "다리 폭발", role: "bodyweight", exercises: ["스쿼트 점프 (Squat Jumps)", "점프 런지 (Jump Lunges)", "워킹 런지 (Walking Lunges)"] },
    { label: "코어", role: "bodyweight", exercises: ["행잉 니 레이즈 (Hanging Knee Raise)", "행잉 레그 레이즈 (Hanging Leg Raise)", "바이시클 크런치 (Bicycle Crunch)"] },
  ],

  // ════════════ muscle_8w (글루트 강조) ════════════
  upper_a_push_emphasis: [
    { label: "가슴 horizontal push", role: "compound", exercises: ["바벨 벤치 프레스 (Barbell Bench Press)", "인클라인 바벨 프레스 (Incline Barbell Bench Press)", "덤벨 벤치 프레스 (Dumbbell Bench Press)", "스미스 벤치 프레스 (Smith Bench Press)"] },
    { label: "가슴 보조", role: "accessory", exercises: ["인클라인 덤벨 프레스 (Incline Dumbbell Press)", "트라이셉스 딥스 (Tricep Dips)", "케이블 크로스오버 (Cable Crossover)", "푸쉬업 (Push-up)"] },
    { label: "어깨", role: "accessory", exercises: ["오버헤드 프레스 (Overhead Press)", "머신 숄더 프레스 (Machine Shoulder Press)", "사이드 레터럴 레이즈 (Side Lateral Raises)"] },
    { label: "삼두 isolation", role: "isolation", exercises: ["케이블 푸쉬 다운 (Cable Pushdown)", "오버헤드 트라이셉 익스텐션 (Overhead Tricep Extension)", "스컬 크러셔 (Skullcrushers)"] },
  ],
  lower_a_squat_glute: [
    { label: "무릎 dominant compound", role: "compound", exercises: ["바벨 백 스쿼트 (Barbell Back Squat)", "프론트 스쿼트 (Front Squat)", "핵 스쿼트 (Hack Squat)", "레그 프레스 (Leg Press)"] },
    { label: "글루트 compound", role: "compound", exercises: ["바벨 힙 쓰러스트 (Barbell Hip Thrust)", "워킹 런지 (Walking Lunges)", "불가리안 스플릿 스쿼트 (Bulgarian Split Squat)"] },
    { label: "대퇴사두 isolation", role: "isolation", exercises: ["레그 익스텐션 (Leg Extension)", "스텝업 (Step-Up)"] },
    { label: "글루트 isolation", role: "isolation", exercises: ["케이블 킥백 (Cable Kickback)", "힙 어덕션 머신 (Hip Adduction Machine)", "힙 어브덕션 머신 (Hip Abduction Machine)"] },
  ],
  upper_b_pull_emphasis: [
    { label: "등 vertical pull", role: "compound", exercises: ["풀업 (Pull-ups)", "랫 풀다운 (Lat Pulldown)", "클로즈그립 풀다운 (Close-Grip Pulldown)"] },
    { label: "등 horizontal pull", role: "compound", exercises: ["시티드 케이블 로우 (Seated Cable Row)", "벤트오버 바벨 로우 (Bent-over Barbell Row)", "체스트 서포티드 로우 (Chest Supported Row)", "T-바 로우 (T-Bar Row)"] },
    { label: "후면 어깨", role: "isolation", exercises: ["케이블 페이스풀 (Cable Face Pull)", "리어 델트 플라이 (Rear Delt Fly)"] },
    { label: "이두 isolation", role: "isolation", exercises: ["바벨 컬 (Barbell Curl)", "해머 컬 (Hammer Curl)", "덤벨 프리쳐 컬 (Dumbbell Preacher Curl)", "케이블 바이셉 컬 (Cable Bicep Curl)"] },
  ],
  lower_b_hinge_glute: [
    { label: "힌지 compound", role: "compound", exercises: ["루마니안 데드리프트 (Romanian Deadlift)", "컨벤셔널 데드리프트 (Conventional Deadlift)", "트랩바 데드리프트 (Trap Bar Deadlift)"] },
    { label: "글루트 강조", role: "compound", exercises: ["바벨 힙 쓰러스트 (Barbell Hip Thrust)", "글루트 브릿지 (Glute Bridge)", "케이블 풀 스루 (Cable Pull-Through)"] },
    { label: "햄스트링 isolation", role: "isolation", exercises: ["시티드 레그 컬 (Seated Leg Curl)", "라잉 레그 컬 (Lying Leg Curl)"] },
    { label: "코어 + 카프", role: "isolation", exercises: ["행잉 니 레이즈 (Hanging Knee Raise)", "스탠딩 카프 레이즈 (Standing Calf Raises)"] },
  ],

  // ════════════ inbody_d_12w (5일 PPL) ════════════
  push_a: [
    { label: "가슴 horizontal push", role: "compound", exercises: ["바벨 벤치 프레스 (Barbell Bench Press)", "인클라인 바벨 프레스 (Incline Barbell Bench Press)", "덤벨 벤치 프레스 (Dumbbell Bench Press)", "스미스 벤치 프레스 (Smith Bench Press)"] },
    { label: "가슴 보조", role: "accessory", exercises: ["인클라인 덤벨 프레스 (Incline Dumbbell Press)", "케이블 크로스오버 (Cable Crossover)", "펙덱 플라이 (Pec Deck Fly)", "트라이셉스 딥스 (Tricep Dips)"] },
    { label: "어깨 vertical push", role: "compound", exercises: ["오버헤드 프레스 (Overhead Press)", "덤벨 숄더 프레스 (Dumbbell Shoulder Press)", "머신 숄더 프레스 (Machine Shoulder Press)"] },
    { label: "어깨 isolation", role: "isolation", exercises: ["사이드 레터럴 레이즈 (Side Lateral Raises)", "케이블 사이드 레이즈 (Cable Side Raise)", "프론트 레이즈 (Front Raise)"] },
    { label: "삼두 isolation", role: "isolation", exercises: ["케이블 푸쉬 다운 (Cable Pushdown)", "오버헤드 트라이셉 익스텐션 (Overhead Tricep Extension)", "스컬 크러셔 (Skullcrushers)"] },
  ],
  pull_a: [
    { label: "등 vertical pull", role: "compound", exercises: ["풀업 (Pull-ups)", "랫 풀다운 (Lat Pulldown)", "클로즈그립 풀다운 (Close-Grip Pulldown)"] },
    { label: "등 horizontal pull", role: "compound", exercises: ["시티드 케이블 로우 (Seated Cable Row)", "벤트오버 바벨 로우 (Bent-over Barbell Row)", "체스트 서포티드 로우 (Chest Supported Row)", "T-바 로우 (T-Bar Row)"] },
    { label: "후면 어깨", role: "isolation", exercises: ["케이블 페이스풀 (Cable Face Pull)", "리어 델트 플라이 (Rear Delt Fly)"] },
    { label: "이두 compound", role: "accessory", exercises: ["바벨 컬 (Barbell Curl)", "해머 컬 (Hammer Curl)", "친업 (Chin-ups)"] },
    { label: "이두 isolation", role: "isolation", exercises: ["덤벨 프리쳐 컬 (Dumbbell Preacher Curl)", "케이블 바이셉 컬 (Cable Bicep Curl)", "인클라인 덤벨 컬 (Incline Dumbbell Curl)"] },
  ],
  legs_squat_focus: [
    { label: "무릎 dominant", role: "compound", exercises: ["바벨 백 스쿼트 (Barbell Back Squat)", "프론트 스쿼트 (Front Squat)", "핵 스쿼트 (Hack Squat)"] },
    { label: "단일다리", role: "accessory", exercises: ["워킹 런지 (Walking Lunges)", "불가리안 스플릿 스쿼트 (Bulgarian Split Squat)", "스텝업 (Step-Up)"] },
    { label: "글루트 강조", role: "accessory", exercises: ["바벨 힙 쓰러스트 (Barbell Hip Thrust)", "글루트 브릿지 (Glute Bridge)", "케이블 풀 스루 (Cable Pull-Through)"] },
    { label: "대퇴사두 isolation", role: "isolation", exercises: ["레그 익스텐션 (Leg Extension)", "레그 프레스 (Leg Press)"] },
    { label: "카프", role: "isolation", exercises: ["시티드 카프 레이즈 (Seated Calf Raises)", "스탠딩 카프 레이즈 (Standing Calf Raises)"] },
  ],
  push_b: [
    { label: "어깨 vertical push compound", role: "compound", exercises: ["덤벨 숄더 프레스 (Seated Dumbbell Press)", "바벨 OHP (Barbell Overhead Press)", "머신 숄더 프레스 (Machine Shoulder Press)"] },
    { label: "어깨 isolation", role: "isolation", exercises: ["사이드 레터럴 레이즈 (Side Lateral Raises)", "케이블 사이드 레이즈 (Cable Side Raise)"] },
    { label: "가슴 보조", role: "accessory", exercises: ["인클라인 덤벨 프레스 (Incline Dumbbell Press)", "트라이셉스 딥스 (Tricep Dips)", "푸쉬업 (Push-up)"] },
    { label: "삼두 compound", role: "compound", exercises: ["클로즈그립 벤치 프레스 (Close-Grip Bench Press)", "트라이셉스 딥스 (Tricep Dips)"] },
    { label: "삼두 isolation", role: "isolation", exercises: ["케이블 푸쉬 다운 (Cable Pushdown)", "스컬 크러셔 (Skullcrushers)"] },
  ],
  legs_hinge_focus: [
    { label: "힌지 compound", role: "compound", exercises: ["컨벤셔널 데드리프트 (Conventional Deadlift)", "스모 데드리프트 (Sumo Deadlift)", "트랩바 데드리프트 (Trap Bar Deadlift)", "루마니안 데드리프트 (Romanian Deadlift)"] },
    { label: "힙 dominant", role: "accessory", exercises: ["바벨 힙 쓰러스트 (Barbell Hip Thrust)", "케이블 풀 스루 (Cable Pull-Through)", "굿모닝 (Bodyweight Good Morning)"] },
    { label: "햄스트링 isolation", role: "isolation", exercises: ["시티드 레그 컬 (Seated Leg Curl)", "라잉 레그 컬 (Lying Leg Curl)"] },
    { label: "글루트 isolation", role: "isolation", exercises: ["케이블 킥백 (Cable Kickback)", "힙 어덕션 머신 (Hip Adduction Machine)", "힙 어브덕션 머신 (Hip Abduction Machine)"] },
    { label: "코어", role: "bodyweight", exercises: ["행잉 니 레이즈 (Hanging Knee Raise)", "행잉 레그 레이즈 (Hanging Leg Raise)", "케이블 크런치 (Cable Crunch)"] },
  ],

  // ════════════ posture_8w (자세 4면) ════════════
  posture_thoracic_pull: [
    { label: "흉추 모빌리티", role: "bodyweight", exercises: ["폼롤러 흉추 스트레칭 (Foam Roller Thoracic Extension)", "고양이-낙타 자세 (Cat-Cow Pose)", "캣 카멜 스트레치 (Cat-Camel Stretch)"] },
    { label: "등 vertical pull", role: "compound", exercises: ["어시스티드 풀업 (Assisted Pull-up)", "랫 풀다운 (Lat Pulldown)", "클로즈그립 풀다운 (Close-Grip Pulldown)"] },
    { label: "등 horizontal pull", role: "accessory", exercises: ["시티드 케이블 로우 (Seated Cable Row)", "인버티드 로우 (Inverted Row)", "체스트 서포티드 로우 (Chest Supported Row)"] },
    { label: "회전근개·후면 어깨", role: "light", exercises: ["케이블 페이스풀 (Cable Face Pull)", "밴드 풀 어파트 (Band Pull-Aparts)", "사이드 라잉 외회전 (Side-Lying External Rotation)"] },
    { label: "척추 신전근 hold", role: "bodyweight", isStaticHold: true, holdSeconds: 30, exercises: ["슈퍼맨 동작 (Superman)", "백익스텐션 머신 (Back Extension Machine)"] },
  ],
  posture_core_glute: [
    { label: "코어 anti-rotation", role: "bodyweight", exercises: ["데드버그 (Dead Bug)", "버드 독 (Bird Dog)", "팔로프 프레스 (Pallof Press)"] },
    { label: "코어 anti-extension hold", role: "bodyweight", isStaticHold: true, holdSeconds: 30, exercises: ["플랭크 (Plank)", "플랭크 (Plank)"] },
    { label: "글루트 활성화", role: "light", exercises: ["글루트 브릿지 (Glute Bridge)", "클램쉘 (Clamshell)", "사이드 라잉 레그 레이즈 (Side-Lying Leg Raise)"] },
    { label: "코어 측면 hold", role: "bodyweight", isStaticHold: true, holdSeconds: 30, exercises: ["사이드 플랭크 (Side Plank)"] },
  ],
  posture_scap_rotator: [
    { label: "Y-T-W 레이즈 (Cressey)", role: "light", exercises: ["Y-T-W 레이즈 (Y-T-W Raises)", "리어 델트 플라이 (Rear Delt Fly)", "리버스 스노우 엔젤 (Reverse Snow Angel)"] },
    { label: "회전근개 외회전", role: "light", exercises: ["사이드 라잉 외회전 (Side-Lying External Rotation)", "스탠딩 케이블 외회전 (Standing Cable External Rotation)", "밴드 외회전 (Band External Rotation)"] },
    { label: "전거근 (Cressey)", role: "bodyweight", exercises: ["날개뼈 푸쉬업 플러스 (Scapular Push-up Plus)", "월 슬라이드 (Wall Slides)", "밴드 페이스 풀 (Band Face Pull)"] },
    { label: "후면 어깨", role: "isolation", exercises: ["리어 델트 플라이 (Rear Delt Fly)", "케이블 페이스풀 (Cable Face Pull)"] },
    { label: "흉추 신전 hold", role: "bodyweight", isStaticHold: true, holdSeconds: 30, exercises: ["프론 코브라 (Prone Cobra)", "슈퍼맨 동작 (Superman)"] },
  ],
  posture_thoracic_rotation: [
    { label: "흉추 회전 모빌리티", role: "bodyweight", exercises: ["동적 흉추 회전 (Active Thoracic Rotation)", "벽 흉추 회전 (Wall Thoracic Rotations)", "흉추 회전 운동 (Thoracic Rotation)"] },
    { label: "힌지 compound (가벼운)", role: "compound", exercises: ["루마니안 데드리프트 (Romanian Deadlift)", "굿모닝 (Bodyweight Good Morning)"] },
    { label: "등 horizontal pull", role: "accessory", exercises: ["T-바 로우 (T-Bar Row)", "시티드 케이블 로우 (Seated Cable Row)", "체스트 서포티드 로우 (Chest Supported Row)"] },
    { label: "코어 hanging", role: "bodyweight", exercises: ["행잉 니 레이즈 (Hanging Knee Raise)", "행잉 레그 레이즈 (Hanging Leg Raise)"] },
    { label: "코어 anti-flexion hold", role: "bodyweight", isStaticHold: true, holdSeconds: 30, exercises: ["인버티드 로우 (Inverted Row)"] },
  ],

  // ════════════ shoulder_safe_4w (어깨 회피) ════════════
  chest_safe_a: [
    { label: "인클라인 30-45도 push", role: "compound", exercises: ["인클라인 덤벨 프레스 (Incline Dumbbell Press)", "인클라인 머신 프레스 (Incline Machine Press)", "인클라인 푸쉬업 (Incline Push-up)"] },
    { label: "가슴 케이블 (제어 ROM)", role: "accessory", exercises: ["케이블 크로스오버 (Cable Crossover)", "펙덱 플라이 (Pec Deck Fly)", "시티드 머신 플라이 (Seated Machine Fly)"] },
    { label: "푸쉬업 변형", role: "bodyweight", exercises: ["푸쉬업 (Push-up)", "디클라인 푸쉬업 (Decline Push-up)"] },
    { label: "외회전 (회전근개 통합)", role: "light", exercises: ["사이드 라잉 외회전 (Side-Lying External Rotation)", "케이블 외회전 (Cable External Rotation)", "밴드 외회전 (Band External Rotation)"] },
    { label: "페이스풀 (후면 어깨)", role: "light", exercises: ["케이블 페이스풀 (Cable Face Pull)", "밴드 풀 어파트 (Band Pull-Aparts)"] },
  ],
  chest_safe_b: [
    { label: "인클라인 펌프", role: "accessory", exercises: ["인클라인 덤벨 프레스 (Incline Dumbbell Press)", "인클라인 머신 프레스 (Incline Machine Press)"] },
    { label: "케이블 펌프", role: "accessory", exercises: ["케이블 크로스오버 (Cable Crossover)", "펙덱 플라이 (Pec Deck Fly)"] },
    { label: "푸쉬업 finisher", role: "bodyweight", exercises: ["푸쉬업 (Push-up)", "인클라인 푸쉬업 (Incline Push-up)"] },
    { label: "외회전·페이스풀 보강", role: "light", exercises: ["케이블 페이스 풀 (Cable Face Pulls)", "사이드 라잉 외회전 (Side-Lying External Rotation)"] },
  ],
  shoulder_rehab: [
    { label: "회전근개 외회전", role: "light", exercises: ["사이드 라잉 외회전 (Side-Lying External Rotation)", "스탠딩 외회전 (Standing External Rotation)"] },
    { label: "Y-T-W 레이즈", role: "light", exercises: ["Y-T-W 레이즈 (Y-T-W Raises)", "리어 델트 플라이 (Rear Delt Fly)", "리버스 스노우 엔젤 (Reverse Snow Angel)"] },
    { label: "전거근", role: "bodyweight", exercises: ["날개뼈 푸쉬업 플러스 (Scapular Push-up Plus)", "월 슬라이드 (Wall Slides)"] },
    { label: "흉추 모빌리티", role: "bodyweight", exercises: ["폼롤러 흉추 스트레칭 (Foam Roller Thoracic Extension)", "고양이-낙타 자세 (Cat-Cow Pose)", "동적 흉추 회전 (Active Thoracic Rotation)"] },
  ],

  // ════════════ 2split_8w (Rippetoe 3일 alternating) ════════════
  upper_push_focus: [
    { label: "가슴 horizontal push", role: "compound", exercises: ["바벨 벤치 프레스 (Barbell Bench Press)", "인클라인 바벨 프레스 (Incline Barbell Bench Press)", "덤벨 벤치 프레스 (Dumbbell Bench Press)", "머신 체스트 프레스 (Machine Chest Press)"] },
    { label: "어깨 vertical push", role: "compound", exercises: ["오버헤드 프레스 (Overhead Press)", "덤벨 숄더 프레스 (Dumbbell Shoulder Press)", "머신 숄더 프레스 (Machine Shoulder Press)"] },
    { label: "등 horizontal pull (보조)", role: "accessory", exercises: ["시티드 케이블 로우 (Seated Cable Row)", "인버티드 로우 (Inverted Row)"] },
    { label: "코어", role: "bodyweight", isStaticHold: true, holdSeconds: 30, exercises: ["플랭크 (Plank)", "데드버그 (Dead Bug)", "행잉 니 레이즈 (Hanging Knee Raise)"] },
  ],
  upper_pull_focus: [
    { label: "등 vertical pull", role: "compound", exercises: ["풀업 (Pull-ups)", "어시스티드 풀업 (Assisted Pull-up)", "랫 풀다운 (Lat Pulldown)"] },
    { label: "등 horizontal pull", role: "compound", exercises: ["벤트오버 바벨 로우 (Bent-over Barbell Row)", "T-바 로우 (T-Bar Row)", "시티드 케이블 로우 (Seated Cable Row)"] },
    { label: "후면 어깨 + 이두", role: "isolation", exercises: ["케이블 페이스풀 (Cable Face Pull)", "바벨 컬 (Barbell Curl)", "케이블 바이셉 컬 (Cable Bicep Curl)"] },
    { label: "코어", role: "bodyweight", isStaticHold: true, holdSeconds: 30, exercises: ["사이드 플랭크 (Side Plank)", "행잉 니 레이즈 (Hanging Knee Raise)"] },
  ],
  lower_squat_focus: [
    { label: "무릎 dominant", role: "compound", exercises: ["바벨 백 스쿼트 (Barbell Back Squat)", "프론트 스쿼트 (Front Squat)", "핵 스쿼트 (Hack Squat)", "레그 프레스 (Leg Press)"] },
    { label: "단일다리", role: "accessory", exercises: ["워킹 런지 (Walking Lunges)", "불가리안 스플릿 스쿼트 (Bulgarian Split Squat)", "스텝업 (Step-Up)"] },
    { label: "글루트 + 햄", role: "accessory", exercises: ["글루트 브릿지 (Glute Bridge)", "라잉 레그 컬 (Lying Leg Curl)", "바벨 힙 쓰러스트 (Barbell Hip Thrust)"] },
    { label: "카프 + 코어", role: "isolation", exercises: ["스탠딩 카프 레이즈 (Standing Calf Raises)", "행잉 니 레이즈 (Hanging Knee Raise)", "플랭크 (Plank)"] },
  ],
  lower_hinge_focus: [
    { label: "힌지 compound", role: "compound", exercises: ["컨벤셔널 데드리프트 (Conventional Deadlift)", "루마니안 데드리프트 (Romanian Deadlift)", "트랩바 데드리프트 (Trap Bar Deadlift)"] },
    { label: "글루트 강조", role: "accessory", exercises: ["바벨 힙 쓰러스트 (Barbell Hip Thrust)", "글루트 브릿지 (Glute Bridge)", "케이블 풀 스루 (Cable Pull-Through)"] },
    { label: "햄 isolation", role: "isolation", exercises: ["시티드 레그 컬 (Seated Leg Curl)", "라잉 레그 컬 (Lying Leg Curl)"] },
    { label: "코어 + 카프", role: "isolation", exercises: ["행잉 니 레이즈 (Hanging Knee Raise)", "스탠딩 카프 레이즈 (Standing Calf Raises)"] },
  ],
  lower_full: [
    { label: "무릎 compound", role: "compound", exercises: ["바벨 백 스쿼트 (Barbell Back Squat)", "프론트 스쿼트 (Front Squat)"] },
    { label: "힌지 compound", role: "compound", exercises: ["컨벤셔널 데드리프트 (Conventional Deadlift)", "루마니안 데드리프트 (Romanian Deadlift)"] },
    { label: "글루트 또는 단일다리", role: "accessory", exercises: ["바벨 힙 쓰러스트 (Barbell Hip Thrust)", "워킹 런지 (Walking Lunges)"] },
    { label: "코어", role: "bodyweight", exercises: ["플랭크 (Plank)", "행잉 니 레이즈 (Hanging Knee Raise)"] },
  ],

  // ════════════ HIIT / 컨디셔닝 ════════════
  hiit_long_interval: [
    { label: "메인 HIIT (4×4분, 4분 휴식)", role: "compound", exercises: ["트레드밀 sprint (Treadmill Sprint)", "스피닝 (Spin Bike)", "로잉 머신 (Rowing Machine)", "어썰트 바이크 (Assault Bike)", "케틀벨 스윙 서킷 (Kettlebell Swing Circuit)"] },
    { label: "코어 finisher 5분", role: "bodyweight", exercises: ["러시안 트위스트 (Russian Twist)", "행잉 니 레이즈 (Hanging Knee Raise)", "플랭크 변형 (Plank Variations)"] },
  ],
  hiit_medium_interval: [
    { label: "메인 HIIT (8×2분, 2분 휴식)", role: "compound", exercises: ["트레드밀 sprint (Treadmill Sprint)", "스피닝 (Spin Bike)", "로잉 머신 (Rowing Machine)", "어썰트 바이크 (Assault Bike)", "케틀벨 스윙 서킷 (Kettlebell Swing Circuit)"] },
    { label: "코어 finisher 5분", role: "bodyweight", exercises: ["러시안 트위스트 (Russian Twist)", "행잉 니 레이즈 (Hanging Knee Raise)", "플랭크 변형 (Plank Variations)"] },
  ],
  fullbody_a_squat: [
    { label: "스쿼트 compound", role: "compound", exercises: ["바벨 백 스쿼트 (Barbell Back Squat)", "프론트 스쿼트 (Front Squat)", "고블렛 스쿼트 (Goblet Squat)"] },
    { label: "Push compound", role: "compound", exercises: ["바벨 벤치 프레스 (Barbell Bench Press)", "인클라인 덤벨 프레스 (Incline Dumbbell Press)", "푸쉬업 (Push-up)"] },
    { label: "Pull compound", role: "compound", exercises: ["시티드 케이블 로우 (Seated Cable Row)", "인버티드 로우 (Inverted Row)", "벤트오버 바벨 로우 (Bent-over Barbell Row)"] },
    { label: "코어 + finisher", role: "bodyweight", isStaticHold: false, exercises: ["플랭크 (Plank)", "행잉 니 레이즈 (Hanging Knee Raise)", "케틀벨 스윙 (Kettlebell Swing)"] },
  ],
  fullbody_b_hinge: [
    { label: "힌지 compound", role: "compound", exercises: ["컨벤셔널 데드리프트 (Conventional Deadlift)", "루마니안 데드리프트 (Romanian Deadlift)", "트랩바 데드리프트 (Trap Bar Deadlift)"] },
    { label: "Push vertical", role: "compound", exercises: ["오버헤드 프레스 (Overhead Press)", "머신 숄더 프레스 (Machine Shoulder Press)", "푸쉬업 (Push-up)"] },
    { label: "Pull vertical", role: "compound", exercises: ["풀업 (Pull-ups)", "어시스티드 풀업 (Assisted Pull-up)", "랫 풀다운 (Lat Pulldown)"] },
    { label: "단일다리 + 코어", role: "accessory", exercises: ["워킹 런지 (Walking Lunges) + 사이드 플랭크 20s (Side Plank 20s)"] },
  ],
  starter_fullbody: [
    { label: "하체 compound", role: "compound", exercises: ["고블렛 스쿼트 (Goblet Squat)", "박스 스쿼트 (Box Squat)", "루마니안 데드리프트 (Romanian Deadlift)"] },
    { label: "Push (가벼운)", role: "accessory", exercises: ["벽 푸쉬업 (Wall Push-Up)", "무릎 푸쉬업 (Knee Push-Up)", "인클라인 덤벨 프레스 (Incline Dumbbell Press)"] },
    { label: "Pull (가벼운)", role: "accessory", exercises: ["인버티드 로우 (Inverted Row)", "시티드 케이블 로우 (Seated Cable Row)", "어시스티드 풀업 (Assisted Pull-up)"] },
    { label: "코어 hold 30s", role: "bodyweight", isStaticHold: true, holdSeconds: 30, exercises: ["플랭크 (Plank)", "데드버그 (Dead Bug)", "버드 독 (Bird Dog)"] },
  ],

  // ════════════ vacation_arms_7d (팔 specialization) ════════════
  arms_main_1: [
    { label: "이두 compound", role: "compound", exercises: ["바벨 컬 (Barbell Curl)", "EZ 바 컬 (EZ Bar Curl)", "친업 (Chin-ups)"] },
    { label: "삼두 compound", role: "compound", exercises: ["클로즈그립 벤치 프레스 (Close-Grip Bench Press)", "트라이셉스 딥스 (Tricep Dips)", "케이블 푸쉬 다운 (Cable Pushdown)"] },
    { label: "이두 brachialis", role: "isolation", exercises: ["해머 컬 (Hammer Curl)", "케이블 바이셉 컬 (Cable Bicep Curl)"] },
    { label: "삼두 long head", role: "isolation", exercises: ["오버헤드 트라이셉 익스텐션 (Overhead Tricep Extension)", "스컬 크러셔 (Skullcrushers)"] },
    { label: "전완 + 그립", role: "accessory", exercises: ["리버스 컬 (Reverse Curl)", "인버티드 로우 (Inverted Row)"] },
    // 회의 ζ-5 정정 (2026-04-30): 21s/super set/drop set 표기 운동 단일로 분해 — bodyIcon 매핑 위해
    { label: "팔 펌프", role: "isolation", exercises: ["케이블 바이셉 컬 (Cable Bicep Curl)", "케이블 푸쉬 다운 (Cable Pushdown)"] },
  ],
  arms_bicep_focus: [
    { label: "이두 compound", role: "compound", exercises: ["바벨 컬 (Barbell Curl)", "친업 (Chin-ups)", "오버헤드 케이블 바이셉 컬 (Overhead Cable Bicep Curl)"] },
    { label: "이두 isolation 1", role: "isolation", exercises: ["해머 컬 (Hammer Curl)", "덤벨 프리쳐 컬 (Dumbbell Preacher Curl)"] },
    { label: "이두 isolation 2", role: "isolation", exercises: ["케이블 바이셉 컬 (Cable Bicep Curl)", "인클라인 덤벨 컬 (Incline Dumbbell Curl)"] },
    { label: "삼두 (보조)", role: "isolation", exercises: ["케이블 푸쉬 다운 (Cable Pushdown)"] },
    { label: "이두 펌프 마무리", role: "isolation", exercises: ["케이블 바이셉 컬 (Cable Bicep Curl)", "바벨 컬 (Barbell Curl)"] },
  ],
  arms_tricep_focus: [
    { label: "삼두 compound", role: "compound", exercises: ["클로즈그립 벤치 프레스 (Close-Grip Bench Press)", "트라이셉스 딥스 (Tricep Dips)"] },
    { label: "삼두 isolation 1", role: "isolation", exercises: ["오버헤드 트라이셉 익스텐션 (Overhead Tricep Extension)", "스컬 크러셔 (Skullcrushers)"] },
    { label: "삼두 isolation 2", role: "isolation", exercises: ["케이블 푸쉬 다운 (Cable Pushdown)", "트라이셉 로프 푸쉬다운 (Tricep Rope Pushdown)"] },
    { label: "이두 (보조)", role: "isolation", exercises: ["바벨 컬 (Barbell Curl)"] },
    { label: "삼두 펌프 마무리", role: "isolation", exercises: ["케이블 푸쉬 다운 (Cable Pushdown)", "트라이셉 로프 푸쉬다운 (Tricep Rope Pushdown)"] },
  ],
  arms_pump_finisher: [
    // 회의 ζ-5 정정: super set/drop set 표기 폐기. 단일 운동 + sets·rep 으로 펌프 표현.
    { label: "이두 펌프", role: "isolation", exercises: ["케이블 바이셉 컬 (Cable Bicep Curl)", "해머 컬 (Hammer Curl)", "덤벨 프리쳐 컬 (Dumbbell Preacher Curl)"] },
    { label: "삼두 펌프", role: "isolation", exercises: ["케이블 푸쉬 다운 (Cable Pushdown)", "오버헤드 트라이셉 익스텐션 (Overhead Tricep Extension)", "스컬 크러셔 (Skullcrushers)"] },
    { label: "최종 펌프", role: "isolation", exercises: ["케이블 바이셉 컬 (Cable Bicep Curl)", "케이블 푸쉬 다운 (Cable Pushdown)"] },
  ],

  // ════════════ max_strength_8w (Wendler 5/3/1) ════════════
  wendler_squat_day: [
    { label: "메인: 스쿼트 (Wendler wave)", role: "compound", exercises: ["바벨 백 스쿼트 (Barbell Back Squat)"] },
    { label: "Hinge 보조", role: "accessory", exercises: ["루마니안 데드리프트 (Romanian Deadlift)", "굿모닝 (Bodyweight Good Morning)"] },
    { label: "글루트", role: "accessory", exercises: ["바벨 힙 쓰러스트 (Barbell Hip Thrust)", "글루트 브릿지 (Glute Bridge)"] },
    { label: "코어", role: "bodyweight", exercises: ["행잉 니 레이즈 (Hanging Knee Raise)", "플랭크 (Plank)"] },
  ],
  wendler_bench_day: [
    { label: "메인: 벤치 프레스 (Wendler wave)", role: "compound", exercises: ["바벨 벤치 프레스 (Barbell Bench Press)"] },
    { label: "Pull 보조", role: "accessory", exercises: ["풀업 (Pull-ups)", "벤트오버 바벨 로우 (Bent-over Barbell Row)", "시티드 케이블 로우 (Seated Cable Row)"] },
    { label: "삼두", role: "isolation", exercises: ["케이블 푸쉬 다운 (Cable Pushdown)", "스컬 크러셔 (Skullcrushers)"] },
    { label: "코어", role: "bodyweight", exercises: ["플랭크 (Plank)", "행잉 니 레이즈 (Hanging Knee Raise)"] },
  ],
  wendler_deadlift_day: [
    { label: "메인: 데드리프트 (Wendler wave)", role: "compound", exercises: ["컨벤셔널 데드리프트 (Conventional Deadlift)"] },
    { label: "Squat 보조", role: "accessory", exercises: ["프론트 스쿼트 (Front Squat)", "워킹 런지 (Walking Lunges)", "레그 프레스 (Leg Press)"] },
    { label: "햄·글루트", role: "accessory", exercises: ["루마니안 데드리프트 (Romanian Deadlift)", "라잉 레그 컬 (Lying Leg Curl)"] },
    { label: "코어", role: "bodyweight", exercises: ["행잉 니 레이즈 (Hanging Knee Raise)", "케이블 크런치 (Cable Crunch)"] },
  ],
  wendler_ohp_day: [
    { label: "메인: OHP (Wendler wave)", role: "compound", exercises: ["바벨 오버헤드 프레스 (Barbell Overhead Press)"] },
    { label: "Pull 보조", role: "accessory", exercises: ["풀업 (Pull-ups)", "랫 풀다운 (Lat Pulldown)", "체스트 서포티드 로우 (Chest Supported Row)"] },
    { label: "어깨 isolation", role: "isolation", exercises: ["사이드 레터럴 레이즈 (Side Lateral Raises)", "케이블 페이스풀 (Cable Face Pull)"] },
    { label: "이두 + 코어", role: "isolation", exercises: ["바벨 컬 (Barbell Curl)", "행잉 니 레이즈 (Hanging Knee Raise)"] },
  ],

  // ════════════ advanced_back_4w (등 specialization) ════════════
  back_thickness: [
    { label: "horizontal pull compound", role: "compound", exercises: ["벤트오버 바벨 로우 (Bent-over Barbell Row)", "T-바 로우 (T-Bar Row)", "펜들레이 로우 (Pendlay Row)"] },
    { label: "케이블 horizontal pull", role: "compound", exercises: ["시티드 케이블 로우 와이드 (Seated Cable Row Wide)", "체스트 서포티드 로우 (Chest Supported Row)"] },
    { label: "등 두께 isolation", role: "accessory", exercises: ["덤벨 로우 (Dumbbell Row)", "머신 로우 (Machine Row)"] },
    { label: "후면 어깨 + 트랩", role: "isolation", exercises: ["케이블 페이스풀 (Cable Face Pull)", "슈러그 (Shrug)", "리어 델트 플라이 (Rear Delt Fly)"] },
    { label: "등 hold", role: "bodyweight", isStaticHold: true, holdSeconds: 30, exercises: ["인버티드 로우 (Inverted Row)", "인버티드 로우 (Inverted Row)"] },
  ],
  back_width: [
    { label: "풀업", role: "compound", exercises: ["풀업 (Pull-ups)", "친업 (Chin-ups)", "어시스티드 풀업 (Assisted Pull-up)"] },
    { label: "랫 풀다운 변형", role: "compound", exercises: ["랫 풀다운 와이드 (Lat Pulldown Wide)", "머신 풀다운 (Machine Pulldown)", "클로즈그립 풀다운 (Close-Grip Pulldown)"] },
    { label: "풀오버 (lat 분리)", role: "isolation", exercises: ["케이블 풀오버 스트레이트암 (Cable Pullover Straight Arm)", "덤벨 풀오버 (Dumbbell Pullover)", "머신 풀오버 (Machine Pullover)"] },
    { label: "등 isolation", role: "isolation", exercises: ["어시스티드 친업 lat 강조 (Assisted Chin-up Lat Focus)"] },
    { label: "데드 행 hold", role: "bodyweight", isStaticHold: true, holdSeconds: 30, exercises: ["인버티드 로우 (Inverted Row)"] },
  ],
  back_volume: [
    { label: "compound (가벼운, 고반복)", role: "compound", exercises: ["시티드 케이블 로우 (Seated Cable Row)", "T-바 로우 (T-Bar Row)"] },
    { label: "후면 어깨 펌프", role: "isolation", exercises: ["케이블 페이스풀 (Cable Face Pull)", "리어 델트 플라이 (Rear Delt Fly)"] },
    { label: "이두 super set", role: "isolation", exercises: ["바벨 컬 (Barbell Curl)", "해머 컬 (Hammer Curl)"] },
    { label: "트랩 + 어깨", role: "isolation", exercises: ["슈러그 (Shrug)", "업라이트 로우 (Upright Row)"] },
    { label: "펌프 finisher", role: "isolation", exercises: ["시티드 케이블 로우 (Seated Cable Row)", "T-바 로우 (T-Bar Row)"] },
  ],

  // ════════════ senior_4w (시니어 안전) ════════════
  senior_fullbody: [
    { label: "하체 (무릎 부담 ↓)", role: "compound", exercises: ["레그 프레스 얕은 ROM (Leg Press Shallow ROM)", "고블렛 스쿼트 가벼운 (Goblet Squat Light)", "박스 스쿼트 (Box Squat)"] },
    { label: "Push (어깨 부담 ↓)", role: "accessory", exercises: ["인클라인 덤벨 프레스 가벼운 (Incline Dumbbell Press Light)", "벽 푸쉬업 (Wall Push-Up)", "무릎 푸쉬업 (Knee Push-Up)", "머신 체스트 프레스 (Machine Chest Press)"] },
    { label: "Pull (허리 부담 ↓)", role: "accessory", exercises: ["시티드 케이블 로우 (Seated Cable Row)", "머신 로우 (Machine Row)", "어시스티드 풀업 (Assisted Pull-up)"] },
    { label: "글루트·코어 hold 30s", role: "bodyweight", isStaticHold: true, holdSeconds: 30, exercises: ["글루트 브릿지 (Glute Bridge)", "데드버그 (Dead Bug)", "버드 독 (Bird Dog)"] },
  ],

  // ════════════ cycle_diet_12w (Phase별) ════════════
  upper_low_intensity: [
    { label: "Push 가벼운", role: "accessory", exercises: ["인클라인 덤벨 프레스 (Incline Dumbbell Press)", "푸쉬업 (Push-up)", "머신 체스트 프레스 (Machine Chest Press)"] },
    { label: "Pull 가벼운", role: "accessory", exercises: ["시티드 케이블 로우 (Seated Cable Row)", "어시스티드 풀업 (Assisted Pull-up)"] },
    { label: "어깨 isolation", role: "isolation", exercises: ["사이드 레터럴 레이즈 (Side Lateral Raises)", "케이블 페이스풀 (Cable Face Pull)"] },
    { label: "코어 hold 30s", role: "bodyweight", isStaticHold: true, holdSeconds: 30, exercises: ["플랭크 (Plank)", "데드버그 (Dead Bug)"] },
  ],
  lower_low: [
    { label: "하체 가벼운 compound", role: "accessory", exercises: ["고블렛 스쿼트 (Goblet Squat)", "워킹 런지 (Walking Lunges)", "레그 프레스 (Leg Press)"] },
    { label: "글루트", role: "accessory", exercises: ["글루트 브릿지 (Glute Bridge)", "케이블 킥백 (Cable Kickback)"] },
    { label: "햄 isolation", role: "isolation", exercises: ["라잉 레그 컬 (Lying Leg Curl)"] },
    { label: "카프 + 코어", role: "isolation", exercises: ["스탠딩 카프 레이즈 (Standing Calf Raises)", "사이드 플랭크 (Side Plank)"] },
  ],
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
  const seed = ((weekIndex * 7 + dayOfWeek) * 31 + slotIndex) % exercises.length;
  return exercises[seed];
}

/** slotType 의 슬롯 메타 (label + role + isStaticHold) */
export function getSlotMeta(slotType: string, slotIndex: number): CatalogSlot | null {
  return CATALOG_SLOT_POOLS[slotType]?.[slotIndex] ?? null;
}

export function getSlotCount(slotType: string): number {
  return CATALOG_SLOT_POOLS[slotType]?.length ?? 0;
}

export function listSlotTypes(): string[] {
  return Object.keys(CATALOG_SLOT_POOLS);
}
