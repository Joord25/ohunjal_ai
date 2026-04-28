import type { Locale } from "@/hooks/useTranslation";

export interface EquipmentInfo {
  /** 단일 이미지 또는 다수 이미지(슬라이드 / 변형 보여주기 — 예: 스쿼트 랙 종류 3종). */
  imagePath: string | string[];
  /** Phase 1.5: find = 위치/외형 식별 (헬스장 안에서 "어디 있고 어떻게 생겼는지"). 안전 셋업 정보 포함 X */
  findGuide: { ko: string[]; en: string[] };
  /** Phase 1.5: use = 안전 셋업 (안전바·핀·플레이트·콜라). 폼 cue 와 별개 — cue 는 formCues.ts */
  useGuide: { ko: string[]; en: string[] };
}

/**
 * 기구 메타 (find = 헬스장에서 어디/어떻게 생겼는지, use = 안전 셋업).
 *
 * 회의 2026-04-28 (β): exerciseVideos.ts 카테고리 구조와 동일 정렬 — 운동 추가 시
 * 같은 카테고리 코멘트 아래에 entry 추가. 비슷한 운동(예: 덤벨 벤치/덤벨 플라이)은
 * 같은 평벤치를 쓰니 imagePath 공유 가능.
 *
 * 회의 2026-04-29: 케이블 운동 11종 batch 추가. 케이블 머신은 한 머신으로 다양한 운동 가능 →
 * imagePath 는 모두 cable-machine.png 공유, useGuide·formCues 만 운동별 차이.
 *
 * 신규 entry 추가 시:
 *  1) workout.ts 에 정확 일치하는 운동명 키
 *  2) imagePath 는 /public/machine/<slug>.png (없으면 새로 추가)
 *  3) find = 5 bullets (위치/외형/구별점)
 *  4) use = 5 bullets (안전 셋업, 폼 cue 와 분리)
 *  5) 한/영 동시 작성
 */

// 케이블 머신 운동 공통 findGuide — 한 머신으로 다양한 운동 (트라이셉/이두/플라이/로우 등)
const CABLE_MACHINE_FIND = {
  ko: [
    "기둥 양쪽에 케이블이 달린 큰 머신이에요 (케이블 크로스오버라고도 불러요)",
    "케이블 끝 도르래(풀리)를 위/아래로 위치 변경 가능",
    "다양한 손잡이(로프, 가로바, V바 등)를 케이블에 끼워서 사용",
    "옆에 핸들들이 정리된 거치대가 있어요",
    "단일 머신과 다르게 — 한 머신에서 다양한 운동 가능 (트라이셉/이두/플라이/풀오버)",
  ],
  en: [
    "A large machine with cables on both sides of vertical posts (also called Cable Crossover)",
    "Pulley position can be moved up or down",
    "Various handles (rope, straight bar, V-bar, etc.) attach to the cable",
    "A handle storage rack nearby",
    "Unlike single-purpose machines — one machine for many exercises (triceps, biceps, fly, pullover)",
  ],
};

export const EXERCISE_EQUIPMENT: Record<string, EquipmentInfo> = {
  // ══════════════════════════════════
  // ── 가슴 (PUSH - Main Compound) ──
  // ══════════════════════════════════
  "바벨 벤치 프레스 (Barbell Bench Press)": {
    imagePath: "/machine/bench-press.png",
    findGuide: {
      ko: [
        "긴 평평한 벤치 위에 바벨 거치대가 양쪽으로 세워진 모양이에요",
        "보통 자유 웨이트존 중앙이나 한쪽 벽을 따라 줄지어 놓여있어요",
        "바벨이 거치대 위에 가로로 올려진 상태로 보여요",
        "옆에 큰 원판(플레이트)이 무게별로 정리된 거치대가 함께 있어요",
        "스미스 머신과 다르게 — 바벨이 레일에 고정되지 않고 자유롭게 움직여요",
      ],
      en: [
        "A long flat bench with a barbell rack standing at both ends",
        "Usually placed in the center of the free-weight area or along a wall",
        "The barbell sits horizontally on top of the rack",
        "Plates are organized by weight on a nearby rack",
        "Different from a Smith Machine — the bar moves freely, not locked to rails",
      ],
    },
    useGuide: {
      ko: [
        "거치대 핀 위치 — 누웠을 때 손목보다 살짝 아래가 표준이에요",
        "양쪽 플레이트 무게가 같은지 확인 (좌우 균형)",
        "안전바(세이프티) 높이 — 가슴 옆 높이로 맞추면 든든해요",
        "그립 너비 — 손목이 어깨 바로 위에 오도록 잡아요",
        "콜라(칼라)로 플레이트 끝 고정해서 흔들림 없이 준비",
      ],
      en: [
        "Pin height — set it just below your wrist when lying down",
        "Check both sides have equal plate weight (balance)",
        "Safety bars — set them at chest level for confidence",
        "Grip width — wrists directly above shoulders",
        "Lock plates with collars to keep them steady",
      ],
    },
  },

  "덤벨 벤치 프레스 (Dumbbell Bench Press)": {
    imagePath: "/machine/flat-bench.png",
    findGuide: {
      ko: [
        "팔 길이 정도의 평평한 벤치예요 (등받이가 수평으로 누워있는 형태)",
        "벤치 옆이나 가까이에 덤벨이 무게별로 세워진 덤벨 랙이 있어요",
        "거치대(랙)는 없고, 본인이 덤벨을 들어 올려서 시작해요",
        "보통 거울 앞이나 자유 웨이트존에 흩어져 있어요",
        "인클라인 벤치와 다르게 — 등받이가 기울어지지 않고 완전히 수평이에요",
      ],
      en: [
        "A flat bench about arm's length, with the back lying horizontally",
        "Dumbbells are stored on a rack nearby, organized by weight",
        "No barbell rack — you pick up the dumbbells yourself to start",
        "Usually scattered in the free-weight area or near mirrors",
        "Unlike an incline bench — the back is fully flat, not tilted",
      ],
    },
    useGuide: {
      ko: [
        "덤벨 무게 확인 — 양손에 같은 무게로 들어주세요",
        "벤치에 앉아 덤벨을 무릎 위에 올린 다음, 천천히 누우면서 가슴 옆으로 가져와요",
        "발은 바닥에 단단히, 어깨너비로 고정",
        "벤치 위에 등 전체가 안정적으로 닿게 (꼬리뼈/날개뼈 모두 접지)",
        "처음이면 한 단계 가벼운 무게로 폼 익히기 우선",
      ],
      en: [
        "Match dumbbell weight in both hands",
        "Sit on the bench with dumbbells on knees, then lie back while bringing them to chest level",
        "Plant feet firmly, shoulder-width apart",
        "Keep the entire back stable on the bench (tailbone and shoulder blades grounded)",
        "If new, drop one weight class to focus on form first",
      ],
    },
  },

  "인클라인 덤벨 프레스 (Incline Dumbbell Press)": {
    imagePath: "/machine/incline-bench.png",
    findGuide: {
      ko: [
        "등받이가 비스듬히 기울어진 벤치예요 (보통 30-45도)",
        "각도 조절 핀이 등받이 뒤에 있어 위치를 바꿀 수 있어요",
        "주변에 덤벨 랙이 함께 배치되어 있어요",
        "평벤치보다 위쪽이 살짝 높아 보이는 게 특징이에요",
        "디클라인 벤치(머리가 아래)와 반대 방향 — 인클라인은 머리가 위쪽이에요",
      ],
      en: [
        "A bench with an angled backrest (usually 30-45 degrees)",
        "There's an angle-adjusting pin behind the backrest to change positions",
        "Dumbbell rack is set up nearby",
        "Looks slightly raised at the upper end compared to a flat bench",
        "Opposite of a decline bench (head down) — incline has the head up",
      ],
    },
    useGuide: {
      ko: [
        "각도 30-45도 — 너무 세우면 어깨 운동이 되어버려요",
        "양손 덤벨 무게 같은지 확인",
        "벤치 끝까지 등이 닿게 등받이에 기대요 (목/어깨 안정)",
        "발은 바닥에 단단히 — 인클라인은 발 위치 더 중요해요",
        "처음 누울 때 덤벨을 가슴 위쪽으로 가져오는 동작이 어려우니 가벼운 무게부터",
      ],
      en: [
        "Angle 30-45° — too steep turns it into a shoulder exercise",
        "Match dumbbell weight in both hands",
        "Press your back fully against the backrest (neck and shoulders stable)",
        "Plant feet firmly — foot position matters more on incline",
        "Bringing dumbbells to upper-chest is tricky on first lay-down — start lighter",
      ],
    },
  },

  // ── 가슴 (PUSH - Cable Accessory) ──
  "케이블 체스트 프레스 (Cable Chest Press)": {
    imagePath: "/machine/cable-machine.png",
    findGuide: CABLE_MACHINE_FIND,
    useGuide: {
      ko: [
        "양쪽 풀리 위치 — 가슴 높이(중간)로 맞추기",
        "손잡이 — D핸들(한 손씩) 양손에 걸어요",
        "케이블 사이 가운데에 한 발 앞으로 나와 서기",
        "가슴 옆에서 양손을 앞으로 모으듯 밀기",
        "처음이면 가벼운 무게부터 — 자유 동작이라 흔들림 익숙해져야 안전",
      ],
      en: [
        "Set both pulleys at chest level (mid-height)",
        "Handles — one D-handle in each hand",
        "Stand between cables with one foot forward",
        "Press the handles forward and inward together (bringing hands together)",
        "Start light — free motion takes practice for stability",
      ],
    },
  },

  "케이블 크로스오버 (Cable Crossover)": {
    imagePath: "/machine/cable-machine.png",
    findGuide: CABLE_MACHINE_FIND,
    useGuide: {
      ko: [
        "양쪽 풀리 위치 — 가장 높은 위치(머리 위)로 맞추기",
        "손잡이 — 양쪽 D핸들",
        "케이블 사이에 서서 한 발 앞으로 — 약간 앞으로 기울기",
        "팔꿈치 살짝 굽힌 상태에서 양손을 가슴 앞으로 모으기 (X자 동작 가능)",
        "처음이면 가벼운 무게로 — 마지막에 가슴 가운데 짜는 느낌이 핵심",
      ],
      en: [
        "Set both pulleys at the highest position (above head)",
        "Handles — D-handle on each side",
        "Stand between cables with one foot forward, slightly leaning forward",
        "With elbows softly bent, bring hands together in front of the chest (can cross at the bottom)",
        "Start light — the squeeze in the chest center at the end is the key feel",
      ],
    },
  },

  // ══════════════════════════════════
  // ── 다리 (LEGS - Main Compound) ──
  // ══════════════════════════════════
  "바벨 백 스쿼트 (Barbell Back Squat)": {
    imagePath: ["/machine/squat-rack1.png", "/machine/squat-rack2.png", "/machine/squat-rack3.png"],
    findGuide: {
      ko: [
        "양옆에 기둥이 솟아있고 바벨이 위에 가로로 걸쳐진 큰 프레임이에요",
        "스쿼트 랙 또는 파워 랙이라고 불러요 (안전바가 양쪽에 있는 게 파워 랙)",
        "기둥에 일정 간격으로 구멍이 뚫려있어 핀 높이를 조절할 수 있어요",
        "바닥에 사각형 매트가 깔려있는 경우도 많아요 (소음 흡수용)",
        "스미스 머신과 다르게 — 바벨이 레일에 고정되지 않아요",
      ],
      en: [
        "A tall frame with vertical posts and a barbell resting horizontally on top",
        "Called a squat rack or power rack (power rack has safety bars on both sides)",
        "The posts have evenly-spaced holes for adjusting pin height",
        "Often has a square floor mat for sound absorption",
        "Different from a Smith Machine — the bar isn't locked to rails",
      ],
    },
    useGuide: {
      ko: [
        "바벨 거치대 핀 — 어깨 살짝 아래 (가슴 위쪽) 높이로 맞추기",
        "안전바(J-cup) 높이 — 스쿼트 가장 깊이 내렸을 때 가슴 옆 정도",
        "양쪽 플레이트 무게 같은지 확인 (좌우 균형)",
        "콜라(칼라)로 플레이트 고정 — 무게 흔들림 없게",
        "발 위치 — 어깨너비 살짝 넓게, 발끝 약 15도 바깥쪽",
      ],
      en: [
        "Bar rack pin — set just below shoulder height (upper chest level)",
        "Safety bars (J-cups) — at chest level when squatting deepest",
        "Equal plate weight on both sides",
        "Lock plates with collars — no shaking",
        "Foot position — slightly wider than shoulders, toes ~15° out",
      ],
    },
  },

  "컨벤셔널 데드리프트 (Conventional Deadlift)": {
    imagePath: ["/machine/deadlift-platform1.png", "/machine/deadlift-platform2.png"],
    findGuide: {
      ko: [
        "보통 데드리프트 전용 플랫폼이나 자유 웨이트존 바닥에서 진행해요",
        "바닥에 두꺼운 매트나 고무 플랫폼이 깔려있어요 (소음/충격 흡수)",
        "올림픽 바벨(20kg 표준 길이) 1개 + 플레이트만 있으면 진행 가능",
        "주변에 큰 원판들이 정리된 플레이트 트리가 있어요",
        "랙은 사용 안 해요 — 바닥에서 들어올리는 동작이라 거치대 불필요",
      ],
      en: [
        "Usually performed on a deadlift platform or in the free-weight area",
        "Thick rubber mat or platform on the floor for sound and impact absorption",
        "All you need is one Olympic barbell (20 kg / standard length) and plates",
        "A plate tree with large plates organized by weight nearby",
        "No rack used — you lift from the floor, no stand needed",
      ],
    },
    useGuide: {
      ko: [
        "바벨이 발 중앙(미드풋) 위에 오도록 위치 잡기",
        "큰 원판(45파운드/20kg)을 써야 바벨 높이가 표준이에요 (작은 원판이면 보강 매트로 높여요)",
        "양쪽 플레이트 무게 같은지 확인",
        "콜라로 플레이트 고정 (특히 데드리프트는 흔들림 위험 큼)",
        "주변 공간 확보 — 떨어뜨릴 가능성 대비, 사람이 없는지 한 번 더 체크",
      ],
      en: [
        "Position the bar so it sits over your midfoot",
        "Use 45 lb / 20 kg plates so the bar height is standard (use blocks if smaller plates)",
        "Equal plate weight on both sides",
        "Lock plates with collars — deadlift has high risk of plate shift",
        "Clear surrounding space — prepare for accidental drops, check for people",
      ],
    },
  },

  "레그 프레스 (Leg Press)": {
    imagePath: "/machine/leg-press.png",
    findGuide: {
      ko: [
        "비스듬히 누워서 발로 무게 판을 미는 큰 머신이에요",
        "등받이가 45도 정도 기울어져 있고, 위쪽에 발판이 있어요",
        "발판 양쪽에 안전 핸들(잠금 레버)이 있어요",
        "플레이트를 발판 옆에 직접 끼우는 형태가 일반적 (셀렉터라이즈 머신은 핀)",
        "스쿼트 랙과 다르게 — 등이 고정되어 있어 균형 잡을 필요 없어요",
      ],
      en: [
        "A large machine where you lie back at an angle and push a weighted plate with your feet",
        "Backrest is angled around 45°, with a foot platform at the top",
        "Safety handles (lock levers) on both sides of the platform",
        "Plates load directly onto the platform sides (selectorized machines use pins)",
        "Unlike a squat rack — your back is fixed, no balance needed",
      ],
    },
    useGuide: {
      ko: [
        "등받이가 흔들림 없이 고정되었는지 확인 (가끔 잠금 풀려있어요)",
        "발판 가운데, 어깨너비로 발 위치",
        "안전 핸들(레버) 위치 익히기 — 운동 시작/종료 시 무게 잠금/해제",
        "플레이트 양쪽 균형 (좌우 같은 무게)",
        "처음이면 빈 머신부터 — 머신 자체 무게가 꽤 무거워요",
      ],
      en: [
        "Check the backrest is locked and stable (sometimes the lock is open)",
        "Center your feet on the platform, shoulder-width apart",
        "Know where the safety levers are — they lock/unlock the weight at start and end",
        "Equal plate weight on both sides",
        "Start with empty if new — the machine itself is already heavy",
      ],
    },
  },

  // ── 다리 (LEGS - Cable Accessory) ──
  "케이블 풀 스루 (Cable Pull-Through)": {
    imagePath: "/machine/cable-machine.png",
    findGuide: CABLE_MACHINE_FIND,
    useGuide: {
      ko: [
        "풀리 위치 — 가장 낮은 위치(발목 높이)로 맞추기",
        "손잡이 — 로프(이중 끈) — 양손으로 잡고 다리 사이로 통과",
        "케이블 등지고 서서 — 다리 사이로 손잡이를 잡고 두 발자국 앞으로",
        "발 — 어깨너비 살짝 넓게, 발끝 약간 바깥",
        "엉덩이 뒤로 빼는 \"힙 힌지\" 동작 — 무릎은 살짝만 굽혀요",
      ],
      en: [
        "Pulley — set at the lowest position (ankle height)",
        "Handle — rope (double strap), held with both hands passing between the legs",
        "Stand facing away from the cable — grab the rope between your legs and step two paces forward",
        "Feet — slightly wider than shoulders, toes slightly out",
        "Hinge at the hips — knees only soft, hip-hinge dominant movement",
      ],
    },
  },

  // ══════════════════════════════════
  // ── 어깨 (PUSH - Overhead) ──
  // ══════════════════════════════════
  "오버헤드 프레스 (Overhead Press)": {
    imagePath: ["/machine/squat-rack1.png", "/machine/squat-rack2.png", "/machine/squat-rack3.png"],
    findGuide: {
      ko: [
        "스쿼트 랙(파워 랙)을 그대로 사용해요 — 별도 기구 아님",
        "랙 안에 들어가서 바벨을 어깨 높이에서 잡고 진행해요",
        "스쿼트랑 다르게 핀 위치를 더 높여요 (어깨/쇄골 높이)",
        "안전바는 거의 안 쓰지만 있으면 가슴 위쪽에 맞춰두면 좋아요",
        "밀리터리 프레스, 푸시 프레스도 같은 랙에서 진행돼요",
      ],
      en: [
        "Uses the same squat rack (power rack) — no separate equipment",
        "Step into the rack and grab the bar at shoulder height",
        "Pin height is higher than squat (shoulder / collarbone level)",
        "Safety bars are rarely used here, but set them at upper-chest if used",
        "Military Press and Push Press are done on the same rack",
      ],
    },
    useGuide: {
      ko: [
        "랙 핀 — 쇄골 살짝 아래 (어깨 높이) — 너무 높으면 받기 위험",
        "양쪽 플레이트 무게 같은지 확인",
        "콜라로 플레이트 고정 (머리 위에서 흔들리면 위험)",
        "그립 너비 — 어깨너비 살짝 넓게, 손목 직각",
        "랙에서 한 발자국 뒤로 빠진 후 시작 (랙 안에서 하면 머리 부딪힘)",
      ],
      en: [
        "Pin height — just below the collarbone (shoulder level) — too high is hard to catch",
        "Equal plate weight on both sides",
        "Lock plates with collars (shaking overhead is dangerous)",
        "Grip width — slightly wider than shoulders, wrists straight",
        "Step one pace back from the rack before starting (head bumps the rack otherwise)",
      ],
    },
  },

  // ── 어깨 (Cable Accessory) ──
  "케이블 레터럴 레이즈 (Cable Lateral Raises)": {
    imagePath: "/machine/cable-machine.png",
    findGuide: CABLE_MACHINE_FIND,
    useGuide: {
      ko: [
        "풀리 위치 — 가장 낮은 위치(발목 높이)",
        "손잡이 — D핸들(한 손) — 한 팔씩 진행",
        "운동 팔 반대쪽으로 케이블 옆에 서기 (예: 오른팔 운동 시 왼쪽 어깨가 케이블 쪽)",
        "운동 팔 손잡이는 반대 손에서 시작 — 몸 앞 가로질러 잡고 옆으로 들어올리기",
        "처음이면 매우 가벼운 무게부터 — 어깨는 작은 근육이라 무리 쉬워요",
      ],
      en: [
        "Pulley — set at the lowest position (ankle height)",
        "Handle — D-handle (single) — train one arm at a time",
        "Stand alongside the cable on the opposite side from the working arm (e.g., right arm = left shoulder near cable)",
        "Grab the handle across your body and raise it out to the side",
        "Start very light — shoulders are small muscles, easy to overload",
      ],
    },
  },

  // ══════════════════════════════════
  // ── 등 (PULL - Main Compound) ──
  // ══════════════════════════════════
  "풀업 (Pull-ups)": {
    imagePath: "/machine/pull-up-bar.png",
    findGuide: {
      ko: [
        "천장이나 벽에 고정된 가로 봉이에요 (보통 머리 위 30-50cm 위)",
        "대형 멀티 스테이션의 일부로 있는 경우도 많아요",
        "주변에 어시스트 풀업 머신(밴드/카운터웨이트)이 있을 수 있어요",
        "친업·풀업 둘 다 같은 봉에서 진행 (그립만 다름)",
        "가끔 매트나 점프대가 옆에 있어서 봉에 매달리기 도와줘요",
      ],
      en: [
        "A horizontal bar fixed to the ceiling or wall (usually 30-50 cm above head height)",
        "Often part of a large multi-station structure",
        "May have an assisted pull-up machine (bands or counterweight) nearby",
        "Same bar for chin-ups and pull-ups (grip is the only difference)",
        "Sometimes a mat or jump platform is placed alongside for getting up to the bar",
      ],
    },
    useGuide: {
      ko: [
        "처음이면 어시스트 머신/밴드부터 시작 (관절 적응 우선)",
        "그립 너비 — 어깨너비보다 살짝 넓게 (오버그립)",
        "어깨를 먼저 살짝 끌어내려 \"고정\"한 후 당겨요 (어깨 다치는 거 방지)",
        "친업(언더그립)과 다르게 — 풀업은 손등이 본인 쪽이에요",
        "도움 없이 못 올라가도 부정직 X — 매달려서 버티는 것도 훈련",
      ],
      en: [
        "If new, start with an assisted machine or bands (joints need to adapt first)",
        "Grip width — slightly wider than shoulders (overhand grip)",
        "Lock your shoulders down first (\"shoulder packing\") before pulling — protects shoulders",
        "Unlike chin-up (underhand) — pull-up has your knuckles facing you",
        "If you can't go up without help, that's fine — even hanging counts as training",
      ],
    },
  },

  "랫 풀다운 (Lat Pulldown)": {
    imagePath: "/machine/lat-pulldown.png",
    findGuide: {
      ko: [
        "앉아서 머리 위 봉을 아래로 당기는 머신이에요",
        "위쪽 케이블에 긴 가로 봉(랫 바)이 매달려 있어요",
        "앉는 자리 위에 허벅지 패드(다리 고정용)가 있어요",
        "옆에 무게 핀(셀렉터)이 있어 무게를 빠르게 바꿀 수 있어요",
        "케이블 머신이지만 풀다운 전용 — 핸들 교체 잘 안 해요",
      ],
      en: [
        "A machine where you sit and pull a bar down from above your head",
        "Long horizontal bar (lat bar) hangs from the cable up top",
        "A thigh pad above the seat to keep your legs anchored",
        "Pin selector on the side for quick weight changes",
        "It's a cable machine but dedicated to pulldown — handle rarely changes",
      ],
    },
    useGuide: {
      ko: [
        "허벅지 패드 높이 조절 — 너무 헐겁거나 조이지 않게 딱 맞춰요",
        "무게 핀 꼽을 때 정확히 끝까지 (반쯤 꽂히면 빠질 수 있어요)",
        "그립 너비 — 어깨너비보다 살짝 넓게",
        "앉을 때 가슴이 봉을 향해 살짝 위로 뻗는 자세 만들기",
        "당기는 동안 어깨 으쓱하지 않게 — 등이 일하도록",
      ],
      en: [
        "Adjust the thigh pad — neither loose nor tight, snug fit",
        "Insert the weight pin all the way (half-inserted may slip out)",
        "Grip width — slightly wider than shoulders",
        "When seated, point your chest slightly upward toward the bar",
        "Don't shrug while pulling — let the back do the work",
      ],
    },
  },

  "바벨 로우 (Barbell Row)": {
    imagePath: ["/machine/deadlift-platform1.png", "/machine/deadlift-platform2.png"],
    findGuide: {
      ko: [
        "데드리프트와 같은 자유 웨이트존이나 플랫폼에서 진행해요",
        "별도 거치대 없이 바닥에서 바벨을 들고 시작",
        "큰 원판으로 바벨이 적당한 높이로 떠 있어야 자세가 편해요",
        "보통 거울 앞에 자리 잡기 (등 자세 확인용)",
        "바닥 매트가 깔려있어 바벨 내려놓기 편한 자리 추천",
      ],
      en: [
        "Performed in the free-weight area or platform — same as deadlifts",
        "No rack — pick the barbell up from the floor",
        "Use larger plates so the bar sits at a comfortable height",
        "Usually set up in front of a mirror (to check back posture)",
        "A spot with a rubber mat helps for setting the bar down",
      ],
    },
    useGuide: {
      ko: [
        "바벨 위치 — 발 중앙(미드풋) 위",
        "양쪽 플레이트 무게 같은지 확인 + 콜라 고정",
        "큰 원판(45파운드/20kg) 또는 보강 매트로 바벨 높이 확보",
        "주변 공간 확보 — 등 펴는 동작 공간 + 떨어뜨림 대비",
        "처음이면 가벼운 무게로 등 자세 익히기 우선 (허리 다치기 쉬워요)",
      ],
      en: [
        "Bar position — over your midfoot",
        "Equal plate weight + collar lock",
        "Use 45 lb / 20 kg plates or block to set bar at proper height",
        "Clear space — room for back extension + drop preparation",
        "If new, focus on back posture with light weight first (back-injury risk is high)",
      ],
    },
  },

  "시티드 케이블 로우 (Seated Cable Row)": {
    imagePath: "/machine/seated-cable-row.png",
    findGuide: {
      ko: [
        "앉아서 손잡이를 몸쪽으로 당기는 머신이에요",
        "낮은 위치에 케이블이 있고, 발판 위에 발을 대고 앉아요",
        "보통 V자 또는 가로형 손잡이가 케이블에 달려있어요",
        "옆에 무게 핀(셀렉터)이 있어 무게를 핀으로 조절",
        "케이블 머신이지만 로우 전용 — 머신 모양이 시티드 셋업으로 고정",
      ],
      en: [
        "A machine where you sit and pull a handle toward your body",
        "Low cable position, with footrests where you place your feet",
        "Usually has a V-handle or straight bar attached to the cable",
        "Pin selector on the side for weight adjustment",
        "It's a cable machine but dedicated to row — fixed in seated setup",
      ],
    },
    useGuide: {
      ko: [
        "손잡이 종류 확인 — V바, 가로바, 클로즈 그립 핸들 중 본인 운동에 맞게",
        "발 위치 — 발판 가운데, 무릎 살짝 굽힌 채 안정",
        "무게 핀 정확히 끝까지 꽂기",
        "허리 곧게 — 너무 뒤로 누워 당기면 허리 다쳐요",
        "처음이면 가벼운 무게부터 — 케이블 저항이 일정해서 느낌이 다름",
      ],
      en: [
        "Choose handle — V-bar, straight bar, or close-grip — depending on the workout",
        "Foot position — center of platform, knees slightly bent and stable",
        "Insert weight pin all the way",
        "Keep back straight — leaning too far back hurts the lower back",
        "If new, start light — cable resistance is constant and feels different",
      ],
    },
  },

  // ── 등 (PULL - Cable Accessory) ──
  "시티드 로우 (Seated Cable Row)": {
    imagePath: "/machine/seated-cable-row.png",
    findGuide: {
      ko: [
        "앉아서 손잡이를 몸쪽으로 당기는 머신이에요",
        "낮은 위치에 케이블이 있고, 발판 위에 발을 대고 앉아요",
        "보통 V자 또는 가로형 손잡이가 케이블에 달려있어요",
        "옆에 무게 핀(셀렉터)이 있어 무게를 핀으로 조절",
        "케이블 머신이지만 로우 전용 — 머신 모양이 시티드 셋업으로 고정",
      ],
      en: [
        "A machine where you sit and pull a handle toward your body",
        "Low cable position, with footrests where you place your feet",
        "Usually has a V-handle or straight bar attached to the cable",
        "Pin selector on the side for weight adjustment",
        "It's a cable machine but dedicated to row — fixed in seated setup",
      ],
    },
    useGuide: {
      ko: [
        "손잡이 종류 확인 — V바, 가로바, 클로즈 그립 핸들 중 본인 운동에 맞게",
        "발 위치 — 발판 가운데, 무릎 살짝 굽힌 채 안정",
        "무게 핀 정확히 끝까지 꽂기",
        "허리 곧게 — 너무 뒤로 누워 당기면 허리 다쳐요",
        "처음이면 가벼운 무게부터 — 케이블 저항이 일정해서 느낌이 다름",
      ],
      en: [
        "Choose handle — V-bar, straight bar, or close-grip — depending on the workout",
        "Foot position — center of platform, knees slightly bent and stable",
        "Insert weight pin all the way",
        "Keep back straight — leaning too far back hurts the lower back",
        "If new, start light — cable resistance is constant and feels different",
      ],
    },
  },

  "케이블 로우 (Cable Row)": {
    imagePath: "/machine/cable-machine.png",
    findGuide: CABLE_MACHINE_FIND,
    useGuide: {
      ko: [
        "풀리 위치 — 가장 낮은 위치(발목 높이)",
        "손잡이 — V바, 로프, D핸들 등 — 본인 편한 핸들",
        "케이블 앞에서 무릎 살짝 굽힌 채 발을 단단히 고정 — 발판이 없으면 미끄러짐 주의",
        "허리는 곧게 — 시티드 로우와 동일하게 등이 둥글면 허리 부담",
        "처음이면 시티드 케이블 로우(고정 머신)부터 익히고 진행 추천",
      ],
      en: [
        "Pulley — set at the lowest position (ankle height)",
        "Handle — V-bar, rope, D-handle, etc. — pick what's comfortable",
        "Stand in front of the cable with knees slightly bent and feet planted firmly",
        "Keep the back straight — rounding causes lower-back strain (same as seated row)",
        "If new, learn on a fixed Seated Cable Row machine first",
      ],
    },
  },

  "케이블 페이스 풀 (Cable Face Pulls)": {
    imagePath: "/machine/cable-machine.png",
    findGuide: CABLE_MACHINE_FIND,
    useGuide: {
      ko: [
        "풀리 위치 — 얼굴 높이 또는 살짝 위 (어깨~머리 사이)",
        "손잡이 — 로프(이중 끈) — 양 끝을 양손으로 잡기 (엄지가 끝쪽)",
        "케이블 앞에 서서 한 발 앞으로 — 약간 뒤로 기댄 자세",
        "당길 때 양손이 얼굴 양옆으로 가도록 — 코·관자놀이 라인",
        "후면 어깨/회전근개 운동이라 가벼운 무게부터 — 어깨 다치기 쉬움",
      ],
      en: [
        "Pulley — at face height or slightly above (between shoulder and head)",
        "Handle — rope (double strap), with thumbs at the ends",
        "Stand in front of the cable with one foot forward, slightly leaning back",
        "Pull until your hands flank your face (along the temple line)",
        "Targets rear delts / rotator cuff — start light, easy to strain shoulders",
      ],
    },
  },

  // ══════════════════════════════════
  // ── 팔 (CABLE - Accessory) ──
  // ══════════════════════════════════
  "케이블 오버헤드 트라이셉 익스텐션 (Cable Overhead Tricep Extension)": {
    imagePath: "/machine/cable-machine.png",
    findGuide: CABLE_MACHINE_FIND,
    useGuide: {
      ko: [
        "풀리(도르래) 위치 — 가장 높은 위치로 설정 (오버헤드 운동이라)",
        "손잡이 — 보통 로프(이중 끈) 사용 — 손목 자유롭고 마지막에 짜내기 좋아요",
        "무게 핀 정확히 끝까지 꽂기",
        "케이블 앞에 등 돌리고 서서, 머리 위로 손잡이를 올리고 시작",
        "처음이면 가벼운 무게부터 — 어깨 안정성 익숙해져야 안전",
      ],
      en: [
        "Pulley position — set at the highest point (overhead movement)",
        "Handle — usually a rope (double strap) — wrists stay free, easier to squeeze at the end",
        "Insert weight pin all the way",
        "Stand facing away from the cable, lift the handle overhead to start",
        "If new, start light — get used to shoulder stability first for safety",
      ],
    },
  },

  "케이블 푸쉬 다운 (Cable Pushdown)": {
    imagePath: "/machine/cable-machine.png",
    findGuide: CABLE_MACHINE_FIND,
    useGuide: {
      ko: [
        "풀리 위치 — 가장 높은 위치(머리 위)",
        "손잡이 — 로프 또는 가로바(스트레이트 바)",
        "케이블 앞에 마주 서기 — 한 발 살짝 앞 (균형용)",
        "팔꿈치를 옆구리에 고정 — 어깨 움직이지 않게",
        "팔꿈치만 펴서 아래로 누르기 — 어깨로 미는 보상 동작 X",
      ],
      en: [
        "Pulley — at the highest position (above head)",
        "Handle — rope or straight bar",
        "Stand facing the cable, one foot slightly forward for balance",
        "Lock elbows at your sides — shoulders don't move",
        "Only the elbows extend, pushing down — don't let shoulders push (compensation)",
      ],
    },
  },

  "케이블 바이셉 컬 (Cable Bicep Curl)": {
    imagePath: "/machine/cable-machine.png",
    findGuide: CABLE_MACHINE_FIND,
    useGuide: {
      ko: [
        "풀리 위치 — 가장 낮은 위치(발목 높이)",
        "손잡이 — 가로바(스트레이트 바) 또는 EZ바",
        "케이블 앞에 마주 서기 — 어깨너비",
        "팔꿈치 옆구리에 고정 — 컬 동작에서 절대 앞뒤로 움직이지 않게",
        "처음이면 가벼운 무게부터 — 케이블은 끝까지 저항이 있어 덤벨보다 어려워요",
      ],
      en: [
        "Pulley — at the lowest position (ankle height)",
        "Handle — straight bar or EZ-bar",
        "Stand facing the cable, shoulder-width",
        "Lock elbows at your sides — never let them swing forward/back during the curl",
        "Start light — cable resistance is constant through the range, harder than dumbbells",
      ],
    },
  },

  "오버헤드 케이블 바이셉 컬 (Overhead Cable Bicep Curl)": {
    imagePath: "/machine/cable-machine.png",
    findGuide: CABLE_MACHINE_FIND,
    useGuide: {
      ko: [
        "양쪽 풀리 위치 — 가장 높은 위치(머리 위) 양쪽 다",
        "손잡이 — 양쪽 D핸들",
        "케이블 사이 가운데에 서서 양손 손잡이 — 양팔을 머리 옆으로 일자 펼치기 (T자세)",
        "팔꿈치 위치 고정 — 머리 옆 라인 유지, 절대 떨어뜨리지 않게",
        "양손을 머리 쪽으로 당겨오는 컬 — 이두 정점 자극이 핵심",
      ],
      en: [
        "Both pulleys — at the highest position (above head) on each side",
        "Handles — D-handle in each hand",
        "Stand in the center, arms extended out wide (T-position) holding both handles",
        "Lock elbows at head-level line — never let them drop",
        "Curl hands toward the head — key feel is biceps peak contraction",
      ],
    },
  },

  // ══════════════════════════════════
  // ── 코어 (CABLE - Accessory) ──
  // ══════════════════════════════════
  "케이블 우드찹 (Cable Woodchop)": {
    imagePath: "/machine/cable-machine.png",
    findGuide: CABLE_MACHINE_FIND,
    useGuide: {
      ko: [
        "풀리 위치 — 가장 높은 위치(머리 위) — 한쪽만",
        "손잡이 — 로프 또는 D핸들",
        "운동 측면 반대쪽으로 케이블 옆에 서기 (예: 오른쪽으로 내릴 때 왼쪽 어깨 케이블 쪽)",
        "양손으로 손잡이를 잡고 — 대각선으로 무릎 바깥쪽까지 회전하며 당겨내기",
        "팔이 아닌 코어가 일하는 운동 — 회전축은 척추, 가벼운 무게부터",
      ],
      en: [
        "Pulley — at the highest position (above head), one side only",
        "Handle — rope or D-handle",
        "Stand alongside the cable on the opposite side from where you'll chop down",
        "Hold the handle with both hands and rotate diagonally down to outside the opposite knee",
        "Core does the work — not the arms; rotation is at the spine, start light",
      ],
    },
  },

  "케이블 크런치 (Cable Crunch)": {
    imagePath: "/machine/cable-machine.png",
    findGuide: CABLE_MACHINE_FIND,
    useGuide: {
      ko: [
        "풀리 위치 — 가장 높은 위치(머리 위)",
        "손잡이 — 로프(이중 끈) — 양손으로 잡아 머리 양옆에 가져옴",
        "케이블 앞에 무릎 꿇고 앉아 — 손은 머리 옆에 고정",
        "엉덩이는 그대로 — 척추(복근)만 둥글게 말리는 동작",
        "팔로 끌어오지 않게 — 복근이 짜이는 느낌이 핵심",
      ],
      en: [
        "Pulley — at the highest position (above head)",
        "Handle — rope (double strap), held with both hands beside the head",
        "Kneel in front of the cable, hands locked at the sides of the head",
        "Hips stay put — only the spine (abs) curls forward",
        "Don't pull with the arms — the abs squeezing is the key feel",
      ],
    },
  },

  // ══════════════════════════════════
  // ── BATCH 1 (회의 2026-04-29): 바벨/덤벨 변형 15종 추가 ──
  // ══════════════════════════════════

  // ── 가슴 (PUSH - 변형) ──
  "인클라인 바벨 프레스 (Incline Barbell Press)": {
    imagePath: "/machine/incline-bench.png",
    findGuide: {
      ko: [
        "인클라인 벤치(30-45도) 위에 바벨 거치대가 양쪽으로 있는 셋업이에요",
        "보통 자유 웨이트존에 바벨 벤치 프레스 옆에 함께 배치",
        "각도 조절 핀이 등받이 뒤에 있어요",
        "옆에 큰 플레이트 거치대가 함께 있어요",
        "평벤치(바벨 벤치)와 다르게 — 등받이가 비스듬히 기울어져 있어요",
      ],
      en: [
        "Incline bench (30-45°) with a barbell rack on both sides",
        "Usually placed next to flat bench press in the free-weight area",
        "Angle-adjusting pin is behind the backrest",
        "A plate rack with large plates is next to it",
        "Unlike a flat bench — the backrest is tilted up",
      ],
    },
    useGuide: {
      ko: [
        "벤치 각도 30-45도 (너무 세우면 어깨 운동이 됨)",
        "거치대 핀 — 누웠을 때 손목 살짝 아래",
        "양쪽 플레이트 무게 같은지 + 콜라 고정",
        "그립 너비 — 어깨너비 살짝 넓게, 손목 직각",
        "백 스쿼트 셋업과 비슷 — 단지 바벨이 가슴 위쪽에 위치",
      ],
      en: [
        "Bench angle 30-45° (too steep becomes a shoulder exercise)",
        "Pin height — just below your wrist when lying down",
        "Equal plate weight + collar lock",
        "Grip width — slightly wider than shoulders, wrists straight",
        "Setup similar to back squat — but bar lands on upper chest",
      ],
    },
  },

  "디클라인 벤치 프레스 (Decline Bench Press)": {
    imagePath: "/machine/bench-press.png",
    findGuide: {
      ko: [
        "머리가 발보다 아래로 가는 디클라인 벤치 위에 바벨이 있는 셋업",
        "벤치 끝에 발을 고정시킬 패드(롤러) 있어요",
        "보통 평벤치/인클라인 벤치 옆에 함께 배치",
        "옆에 플레이트 거치대",
        "인클라인과 반대 — 디클라인은 머리가 아래쪽이에요",
      ],
      en: [
        "Decline bench (head lower than feet) with a barbell rack",
        "Rollers/pads at the foot end to anchor your feet",
        "Usually placed near flat and incline benches",
        "Plate rack alongside",
        "Opposite of incline — decline has the head lower",
      ],
    },
    useGuide: {
      ko: [
        "발 고정 패드(롤러) 위치 단단히 끼우기 — 미끄러지면 위험",
        "거치대 핀 위치 — 누웠을 때 손이 닿는 높이",
        "양쪽 플레이트 무게 + 콜라 고정",
        "처음이면 보조 한 명이 옆에 있는 게 좋아요 (디클라인은 머리 아래라 위험)",
        "바벨이 가슴 아래쪽으로 떨어지는 코스 — 평벤치와 다른 궤적",
      ],
      en: [
        "Lock feet firmly under the rollers — slipping is dangerous",
        "Pin height — within arm's reach when lying down",
        "Equal plates + collars",
        "If new, have a spotter (head-down position carries risk)",
        "Bar travels to lower chest — different path from flat bench",
      ],
    },
  },

  "스미스 머신 벤치 프레스 (Smith Machine Bench Press)": {
    imagePath: "/machine/cable-machine.png",
    findGuide: {
      ko: [
        "양쪽 기둥(레일)에 바벨이 고정되어 수직으로만 움직이는 큰 머신이에요",
        "안전 후크가 있어 바벨을 어떤 위치에서든 멈출 수 있어요",
        "벤치는 머신 안에 따로 넣어 사용 (이동식)",
        "기둥에 일정 간격 후크가 있어 시작 위치 조절 가능",
        "자유 바벨(스쿼트랙)과 다르게 — 좌우 흔들림 없이 레일 따라 움직임",
      ],
      en: [
        "A large machine with the bar fixed to vertical rails",
        "Safety hooks let you lock the bar at any height",
        "A movable bench is placed inside the machine for use",
        "Pegs along the rails for adjustable start positions",
        "Unlike free barbell — the bar moves only along the rails (no side wobble)",
      ],
    },
    useGuide: {
      ko: [
        "벤치 위치 — 바벨이 가슴 중앙 위로 떨어지도록 정렬",
        "시작 후크 — 누웠을 때 손이 닿는 높이",
        "양쪽 플레이트 무게 + 콜라 고정",
        "그립 후 바벨을 \"돌려서\" 후크 풀고 시작 (1/4 회전)",
        "끝나면 다시 \"돌려서\" 후크에 걸기 — 잠금 확인 필수",
      ],
      en: [
        "Bench position — bar should drop over the center of your chest",
        "Start hook — within arm's reach when lying down",
        "Equal plates + collars",
        "Rotate the bar a quarter-turn to release the hooks at the start",
        "End by rotating to lock back into the hooks — confirm the lock",
      ],
    },
  },

  // ── 다리 (LEGS - 변형) ──
  "프론트 스쿼트 (Front Squat)": {
    imagePath: ["/machine/squat-rack1.png", "/machine/squat-rack2.png", "/machine/squat-rack3.png"],
    findGuide: {
      ko: [
        "백 스쿼트와 같은 스쿼트 랙(파워 랙) 사용 — 별도 머신 아님",
        "바닥에 매트가 깔려있는 경우 많아요",
        "옆에 플레이트 거치대",
        "백 스쿼트와 차이 없음 — 셋업 동일, 바벨 거치 위치만 앞쪽",
        "손목/팔꿈치 유연성 부족하면 어려움 — 처음이면 가벼운 무게로 자세부터",
      ],
      en: [
        "Same squat rack used as back squat — no separate machine",
        "Often has a floor mat for sound absorption",
        "Plate rack alongside",
        "No difference from back squat in setup — only bar rests on front shoulders",
        "Tough if wrist/elbow mobility is limited — start light to learn the rack position",
      ],
    },
    useGuide: {
      ko: [
        "거치대 핀 — 어깨 살짝 아래 (백 스쿼트와 동일)",
        "안전바 높이 — 가장 깊이 내릴 때 가슴 옆",
        "양쪽 플레이트 + 콜라 고정",
        "바벨 거치 — 어깨 앞 (쇄골 위), 팔꿈치 높이 들어 \"선반\" 만들기",
        "그립 — 바벨 위에 손가락 올림 (\"클린 그립\") 또는 X자 교차 (\"크로스 그립\")",
      ],
      en: [
        "Pin height — same as back squat (just below shoulder)",
        "Safety bars at chest level for deepest squat",
        "Equal plates + collars",
        "Bar rest — front of shoulders (over collarbone), elbows high to create a \"shelf\"",
        "Grip — fingertips on the bar (\"clean grip\") or arms crossed (\"cross grip\")",
      ],
    },
  },

  "루마니안 데드리프트 (Romanian Deadlift)": {
    imagePath: ["/machine/deadlift-platform1.png", "/machine/deadlift-platform2.png"],
    findGuide: {
      ko: [
        "데드리프트와 같은 자유 웨이트존/플랫폼에서 진행",
        "올림픽 바벨 + 플레이트 (컨벤셔널과 동일)",
        "랙에서 들고 시작하는 게 일반적 (바닥에서 시작 X)",
        "주변 거울 있는 자리 추천 (등 자세 확인)",
        "컨벤셔널 데드리프트와 다르게 — 무릎 거의 굽히지 않아 시작 위치도 더 높아요",
      ],
      en: [
        "Same free-weight area / platform as deadlift",
        "Olympic bar + plates (same as conventional)",
        "Usually starts from a rack (not from the floor like conventional)",
        "Mirror nearby helps for back form check",
        "Unlike conventional — knees stay almost straight, so the start position is higher",
      ],
    },
    useGuide: {
      ko: [
        "랙에서 바벨 들고 한 발자국 뒤로 — 시작 자세는 직립",
        "양쪽 플레이트 무게 + 콜라",
        "그립 너비 — 어깨너비 (양팔이 다리 바깥)",
        "다리는 거의 곧게 (살짝만 굽힘) — 무릎 굽혀서 내리는 게 아님",
        "엉덩이로만 hinge — 컨벤셔널과 가장 큰 차이",
      ],
      en: [
        "Lift bar from the rack and step back — start in a standing position",
        "Equal plates + collars",
        "Grip width — shoulder-width (arms outside legs)",
        "Legs almost straight (only soft knees) — don't squat down",
        "Hinge at the hips only — biggest difference from conventional",
      ],
    },
  },

  "스모 데드리프트 (Sumo Deadlift)": {
    imagePath: ["/machine/deadlift-platform1.png", "/machine/deadlift-platform2.png"],
    findGuide: {
      ko: [
        "컨벤셔널 데드리프트와 같은 플랫폼 사용",
        "바닥에서 시작 — 바벨 + 플레이트만 있으면 됨",
        "주변 공간 확보 (발 넓게 벌리는 자세라 더 필요)",
        "큰 원판으로 바벨 높이 표준 맞추기 (작은 원판이면 매트로 보강)",
        "컨벤셔널과 다르게 — 발이 매우 넓게, 양팔이 다리 안쪽",
      ],
      en: [
        "Same platform as conventional deadlift",
        "Start from the floor — just bar + plates",
        "Need more clearance (wider stance)",
        "Use 45 lb / 20 kg plates for standard bar height",
        "Unlike conventional — feet very wide, arms inside legs",
      ],
    },
    useGuide: {
      ko: [
        "발 위치 — 어깨너비의 1.5~2배, 발끝 약 30-45도 바깥",
        "양손 그립 — 다리 안쪽으로 들어가서 잡기",
        "양쪽 플레이트 + 콜라 고정",
        "정강이가 거의 수직 — 무릎이 발끝 방향으로 \"열림\"",
        "내전근/엉덩이 자극이 컨벤셔널보다 큼 — 처음이면 가볍게",
      ],
      en: [
        "Foot stance — 1.5-2× shoulder width, toes ~30-45° out",
        "Grip — hands inside the legs",
        "Equal plates + collars",
        "Shins nearly vertical — knees \"open\" in line with toes",
        "More adductor/glute load than conventional — start light",
      ],
    },
  },

  // ── 어깨 (OVERHEAD - 변형) ──
  "밀리터리 프레스 (Military Press)": {
    imagePath: ["/machine/squat-rack1.png", "/machine/squat-rack2.png", "/machine/squat-rack3.png"],
    findGuide: {
      ko: [
        "스쿼트 랙(파워 랙) 사용 — 오버헤드 프레스와 동일 셋업",
        "랙 핀 위치 어깨 높이",
        "옆에 플레이트 거치대",
        "오버헤드 프레스의 \"엄격한\" 변형 — 발을 모은 \"차렷\" 자세",
        "푸시 프레스(다리 반동 사용)와 반대 — 밀리터리는 다리 반동 X",
      ],
      en: [
        "Uses the squat rack (power rack) — same setup as overhead press",
        "Pin at shoulder height",
        "Plate rack alongside",
        "Stricter version of OHP — feet together (\"attention\" stance)",
        "Opposite of push press (which uses leg drive) — military uses no leg drive",
      ],
    },
    useGuide: {
      ko: [
        "랙 핀 — 쇄골 살짝 아래 (오버헤드와 동일)",
        "양쪽 플레이트 + 콜라",
        "그립 너비 — 어깨너비 살짝 넓게, 손목 직각",
        "발 위치 — 양발 모음 (\"차렷\") — 균형 어려워 코어 더 일함",
        "오버헤드와 같지만 다리 반동 절대 X — 순수 어깨 힘으로",
      ],
      en: [
        "Pin height — just below the collarbone (same as OHP)",
        "Equal plates + collars",
        "Grip width — slightly wider than shoulders, wrists straight",
        "Stance — feet together (\"attention\") — balance is harder, core works more",
        "Same as OHP but no leg drive — pure shoulder strength",
      ],
    },
  },

  // ── 등 (PULL - 변형) ──
  "펜들레이 로우 (Pendlay Row)": {
    imagePath: ["/machine/deadlift-platform1.png", "/machine/deadlift-platform2.png"],
    findGuide: {
      ko: [
        "데드리프트와 같은 자유 웨이트존/플랫폼에서 진행",
        "바벨이 항상 바닥에서 시작 (바벨 로우와 다름)",
        "큰 원판으로 바벨 높이 표준 맞추기",
        "주변 공간 확보",
        "바벨 로우와 다르게 — 매 렙마다 바벨이 바닥에 \"착지\"하고 다시 들어올림",
      ],
      en: [
        "Same free-weight area / platform as deadlift",
        "The bar always starts from the floor (unlike a regular Barbell Row)",
        "Use 45 lb / 20 kg plates for standard bar height",
        "Clear surrounding space",
        "Different from Barbell Row — the bar lands on the floor between every rep",
      ],
    },
    useGuide: {
      ko: [
        "바벨 위치 — 발 중앙(미드풋) 위",
        "양쪽 플레이트 + 콜라",
        "허리 곧게 + 거의 90도 굽힌 자세 (등이 바닥과 거의 평행)",
        "그립 너비 — 어깨너비, 오버그립",
        "당길 때 명치 쪽으로 — 매 렙 후 바닥에 \"리셋\"",
      ],
      en: [
        "Bar position — over your midfoot",
        "Equal plates + collars",
        "Back straight, bent ~90° (back nearly parallel to the floor)",
        "Grip width — shoulder-width, overhand",
        "Pull to the sternum — \"reset\" on the floor between every rep",
      ],
    },
  },

  "티바 로우 (T-Bar Row)": {
    imagePath: "/machine/cable-machine.png",
    findGuide: {
      ko: [
        "한쪽 끝이 바닥에 고정된 바벨에 V바 또는 가로형 손잡이를 끼우는 머신",
        "보통 별도 T바 로우 머신 또는 랜드마인 어태치먼트 사용",
        "바벨 다른 쪽 끝에 플레이트를 끼워요",
        "가슴 패드가 있는 머신도 있음 (체스트 서포티드 형태)",
        "바벨 로우와 다르게 — 바벨 한쪽이 고정되어 회전축으로 동작",
      ],
      en: [
        "One end of the bar anchored to the floor, with a V-handle or grip attached at the working end",
        "Usually a dedicated T-Bar Row machine or landmine attachment",
        "Plates load on the other end of the bar",
        "Some machines have a chest pad (chest-supported version)",
        "Different from Barbell Row — one end of the bar pivots from a fixed point",
      ],
    },
    useGuide: {
      ko: [
        "바벨 한쪽이 회전축에 단단히 들어갔는지 확인",
        "플레이트 끼울 때 콜라 사용 — 흔들림 위험",
        "손잡이 종류 — V바, 클로즈 그립, 와이드 등",
        "발 — 바벨 양옆에 어깨너비",
        "허리 곧게 약 45도 굽힘 — 바벨 로우와 동일 등 자세",
      ],
      en: [
        "Confirm the bar's pivot end is fully seated in the anchor",
        "Use a collar when loading plates — risk of shifting",
        "Handle options — V-bar, close grip, wide grip",
        "Feet — straddle the bar at shoulder width",
        "Back straight, hinged ~45° — same back posture as Barbell Row",
      ],
    },
  },

  "덤벨 로우 (Dumbbell Row)": {
    imagePath: "/machine/flat-bench.png",
    findGuide: {
      ko: [
        "평벤치 + 덤벨 1개로 진행 (한 손씩)",
        "벤치에 한 손과 한 무릎을 올려 \"3점 지지\" 자세",
        "덤벨 랙은 가까이 있어야 함",
        "보통 자유 웨이트존에 평벤치 옆에서 진행",
        "바벨 로우와 다르게 — 한 손씩 비대칭으로, 등 한쪽 집중 자극",
      ],
      en: [
        "Flat bench + one dumbbell (one arm at a time)",
        "Place one hand and one knee on the bench (3-point base)",
        "Dumbbell rack should be nearby",
        "Usually performed in the free-weight area near flat benches",
        "Unlike Barbell Row — one arm at a time, asymmetric loading targets each side",
      ],
    },
    useGuide: {
      ko: [
        "덤벨 무게 좌우 같이 (한 손씩 진행하지만 무게는 같게 — 균형용)",
        "벤치 — 한 손과 한 무릎으로 받침 (지지 한 쪽 다리는 바닥)",
        "허리 곧게 — 바닥과 거의 평행한 등",
        "당길 때 명치/배꼽 쪽으로 — 팔꿈치를 천장으로 끌어올림",
        "처음이면 가벼운 무게 — 비대칭 운동이라 회전 보상 위험",
      ],
      en: [
        "Match dumbbell weight on both sides (even though one-arm-at-a-time, balance matters)",
        "Bench support — one hand and one knee (the other foot on the floor)",
        "Back straight — nearly parallel to the floor",
        "Pull toward the sternum/belly — drive the elbow up to the ceiling",
        "Start light — asymmetric loading invites rotational compensation",
      ],
    },
  },

  "싱글 암 덤벨 로우 (Single Arm Dumbbell Row)": {
    imagePath: "/machine/flat-bench.png",
    findGuide: {
      ko: [
        "덤벨 로우와 동일 셋업 — 평벤치 + 덤벨 1개",
        "\"싱글 암\" 명시적 변형 — 한 손씩 정확하게 격리",
        "벤치에 한 손/한 무릎 받침은 동일",
        "덤벨 랙 가까이",
        "덤벨 로우와 거의 같음 — 운동학적으로 동일, 강조점만 달라요",
      ],
      en: [
        "Same setup as Dumbbell Row — flat bench + one dumbbell",
        "Explicit \"single arm\" — precise isolation per side",
        "Same 3-point base on the bench",
        "Dumbbell rack nearby",
        "Effectively the same as Dumbbell Row — biomechanically identical",
      ],
    },
    useGuide: {
      ko: [
        "덤벨 무게 좌우 같게",
        "벤치 받침 — 한 손/한 무릎",
        "허리 곧게 — 등이 바닥과 거의 평행",
        "당길 때 한쪽 등이 짜이는 느낌 — 좌우 따로 집중",
        "처음이면 가벼운 무게부터",
      ],
      en: [
        "Match weight on both sides",
        "3-point support — one hand and one knee on the bench",
        "Back straight — nearly parallel to the floor",
        "Feel one side of the back contract — focus on each side independently",
        "Start light",
      ],
    },
  },

  // ── 팔 (CURL - 덤벨/바벨) ──
  "덤벨 컬 (Dumbbell Curl)": {
    imagePath: "/machine/flat-bench.png",
    findGuide: {
      ko: [
        "덤벨 1쌍만 있으면 진행 — 별도 기구 불필요",
        "보통 자유 웨이트존이나 거울 앞에서 서서 또는 앉아서",
        "덤벨 랙 옆에서 진행하는 게 일반적",
        "바벨 컬과 다르게 — 양손이 독립적으로 움직여 회전 가능",
        "스탠딩(서서) / 시티드(앉아서) / 인클라인(누워서) 변형 다양",
      ],
      en: [
        "Just need a pair of dumbbells — no other equipment",
        "Usually done standing or seated in the free-weight area or in front of a mirror",
        "Performed near the dumbbell rack",
        "Unlike a Barbell Curl — hands move independently, allowing supination",
        "Variations: standing / seated / incline (lying back)",
      ],
    },
    useGuide: {
      ko: [
        "덤벨 무게 좌우 같이",
        "팔꿈치 옆구리에 \"붙여\" 고정 — 컬에서 절대 앞뒤로 안 움직이게",
        "스탠딩일 때 발 어깨너비, 무릎 살짝 굽힘 (안정성)",
        "올릴 때 손목 자연스럽게 회전 (\"수파인\") — 마지막에 손바닥이 천장",
        "내릴 때도 천천히 — 컨트롤이 핵심",
      ],
      en: [
        "Match weight on both sides",
        "Glue elbows to the sides — never let them swing forward/back",
        "Standing — feet shoulder-width, knees slightly bent (stability)",
        "Rotate the wrists naturally on the way up (\"supination\") — palm faces the ceiling at the top",
        "Lower slowly — control is key",
      ],
    },
  },

  "인클라인 덤벨 컬 (Incline Dumbbell Curl)": {
    imagePath: "/machine/incline-bench.png",
    findGuide: {
      ko: [
        "인클라인 벤치(45-60도) + 덤벨 1쌍",
        "덤벨 랙 가까이",
        "덤벨 컬과 다르게 — 누운 자세라 어깨 뒤로 빠진 위치에서 컬",
        "이두 \"긴 머리\"(longhead) 더 자극되는 변형",
        "각도가 더 클수록 (45도→60도) 이두 늘어남 강도 ↑",
      ],
      en: [
        "Incline bench (45-60°) + a pair of dumbbells",
        "Dumbbell rack nearby",
        "Unlike standing curl — shoulders are behind the body, biceps stretched",
        "Targets the long head of the biceps more",
        "Steeper angle (45→60°) increases the stretch on the biceps",
      ],
    },
    useGuide: {
      ko: [
        "벤치 각도 45-60도 — 너무 누우면 어깨 부담",
        "덤벨 무게 좌우 같이",
        "팔꿈치 위치 고정 — 어깨 뒤쪽에 매달려 있는 느낌",
        "내릴 때 팔이 완전히 펴진 뒤 1초 \"늘어남\" — 컬의 정점은 길어짐",
        "처음이면 가벼운 무게 — 누운 자세에서 의외로 무거워요",
      ],
      en: [
        "Bench angle 45-60° — too flat strains the shoulders",
        "Match weight on both sides",
        "Elbow position fixed — they hang behind the body",
        "At the bottom, fully extend arms and pause 1s (\"stretch\") — the lengthened position is the peak",
        "Start light — lying-back position is heavier than expected",
      ],
    },
  },

  // ── 어깨 (덤벨 변형) ──
  "덤벨 숄더 프레스 (Seated Dumbbell Press)": {
    imagePath: "/machine/incline-bench.png",
    findGuide: {
      ko: [
        "인클라인 벤치를 거의 수직(90도)으로 세운 + 덤벨 1쌍",
        "덤벨 랙 가까이",
        "보통 인클라인 벤치 + 등받이 위로 강하게 세운 형태",
        "오버헤드 프레스와 다르게 — 등받이가 받쳐주어 코어 부담 적음",
        "양손 독립이라 어깨 자연스러운 궤도로 움직임",
      ],
      en: [
        "Incline bench set nearly vertical (90°) + a pair of dumbbells",
        "Dumbbell rack nearby",
        "Usually an incline bench with the back fully upright",
        "Unlike Overhead Press — backrest supports the spine, less core demand",
        "Hands move independently, allowing the shoulders' natural arc",
      ],
    },
    useGuide: {
      ko: [
        "등받이 각도 — 거의 수직 (살짝 뒤로 젖혀도 OK)",
        "덤벨 무게 좌우 같이",
        "벤치에 앉아 덤벨을 무릎 위에 — 한쪽씩 어깨 옆으로 \"올려치기\"",
        "발은 바닥 단단히 (등받이는 받침)",
        "올릴 때 양손이 머리 위에서 모이는 느낌 — 수직보다 살짝 안쪽",
      ],
      en: [
        "Backrest angle — near-vertical (slightly tilted back is OK)",
        "Match weight on both sides",
        "Sit on the bench, dumbbells on knees — \"kick up\" one at a time to shoulder height",
        "Feet planted firmly (backrest takes care of support)",
        "On the way up, hands gather slightly inward (not pure vertical) — meet softly above the head",
      ],
    },
  },

  // ── 가슴 (덤벨 - 추가 Accessory) ──
  "인클라인 덤벨 플라이 (Incline Dumbbell Fly)": {
    imagePath: "/machine/incline-bench.png",
    findGuide: {
      ko: [
        "인클라인 벤치(30-45도) + 덤벨 1쌍",
        "덤벨 랙 가까이",
        "벤치 셋업은 인클라인 덤벨 프레스와 동일",
        "프레스와 다르게 — 팔꿈치 거의 펴지 않고 호 그리듯 양옆으로",
        "가슴 위쪽 + 안쪽 자극 강조",
      ],
      en: [
        "Incline bench (30-45°) + a pair of dumbbells",
        "Dumbbell rack nearby",
        "Same setup as Incline Dumbbell Press",
        "Unlike Press — arms stay nearly straight, sweep in an arc to the sides",
        "Targets upper chest + inner chest squeeze",
      ],
    },
    useGuide: {
      ko: [
        "각도 30-45도",
        "덤벨 무게 좌우 같이 (프레스보다 가벼운 무게가 일반적)",
        "팔꿈치 살짝 굽혀서 고정 — 컬처럼 굽혔다 펴지 않게",
        "발 바닥 단단히, 등 안정",
        "내릴 때 가슴 늘어남 끝까지 — 너무 깊이 가면 어깨 부담",
      ],
      en: [
        "Angle 30-45°",
        "Match weight on both sides (typically lighter than press)",
        "Lock elbows in soft bend — no curling motion",
        "Feet planted firmly, back stable",
        "Lower until chest stretch — too deep stresses the shoulders",
      ],
    },
  },

  // ══════════════════════════════════
  // ── BATCH 2 (회의 2026-04-29): 머신/케틀벨/TRX/풀업 변형 25종 추가 ──
  // ══════════════════════════════════

  // ── 가슴 (MACHINE) ──
  "체스트 프레스 머신 (Chest Press Machine)": {
    imagePath: "/machine/bench-press.png",
    findGuide: {
      ko: [
        "앉아서 손잡이를 앞으로 미는 셀렉터라이즈 머신",
        "양옆 손잡이 위치 조절 가능 (그립 너비)",
        "옆에 무게 핀(셀렉터)으로 빠르게 무게 변경",
        "벤치 프레스와 다르게 — 머신이 궤도 고정해줘 초보 안전",
        "보통 가슴 운동 머신 영역에 펙덱과 함께 배치",
      ],
      en: [
        "A selectorized machine where you sit and push handles forward",
        "Handles adjustable for grip width",
        "Pin selector on the side for quick weight changes",
        "Unlike Bench Press — fixed path, beginner-friendly",
        "Usually grouped with chest machines (next to Pec Deck)",
      ],
    },
    useGuide: {
      ko: [
        "좌석 높이 — 손잡이가 가슴 중앙 옆에 오도록 조절",
        "발 바닥 단단히 + 등 등받이에 \"붙여\" 고정",
        "무게 핀 정확히 끝까지",
        "그립 너비 — 너무 넓으면 어깨, 좁으면 트라이셉",
        "처음이면 가벼운 무게 + 좌석 위치 잡기 우선",
      ],
      en: [
        "Seat height — handles aligned at mid-chest level",
        "Feet planted firmly, back \"glued\" to backrest",
        "Insert weight pin all the way",
        "Grip width — too wide = shoulders, too narrow = triceps",
        "Start light + dial in seat position first",
      ],
    },
  },

  "펙덱 플라이 (Pec Deck Fly)": {
    imagePath: "/machine/cable-machine.png",
    findGuide: {
      ko: [
        "앉아서 양손/팔꿈치를 앞으로 모으는 플라이 전용 머신",
        "양옆에 패드(또는 손잡이) — 팔꿈치를 댈 수 있어요",
        "셀렉터 핀으로 무게 조절",
        "체스트 프레스 머신과 다르게 — 미는 게 아니라 호 그리며 모으기",
        "가슴 안쪽 자극 집중 머신",
      ],
      en: [
        "A dedicated fly machine where you sit and bring arms together",
        "Side pads or handles for elbow placement",
        "Pin selector for weight",
        "Unlike Chest Press Machine — sweeping arc, not pressing",
        "Targets inner-chest squeeze",
      ],
    },
    useGuide: {
      ko: [
        "좌석 높이 — 팔꿈치/손잡이가 어깨 높이",
        "등 등받이에 단단히 고정",
        "팔꿈치 패드형이면 살짝 굽힘 / 손잡이형이면 팔꿈치 살짝 굽힘 고정",
        "양손/팔꿈치를 가운데로 모으는 호 동작 — 직선으로 미는 게 아님",
        "정점에서 1초 가슴 짜내기",
      ],
      en: [
        "Seat height — elbows/handles at shoulder level",
        "Back firmly on the backrest",
        "Elbow-pad style: soft bend at elbow / handle style: lock elbow softly bent",
        "Sweeping arc to bring arms together — not a straight push",
        "1-second squeeze at the center",
      ],
    },
  },

  // ── 다리 (MACHINE) ──
  "레그 익스텐션 (Leg Extension)": {
    imagePath: "/machine/leg-press.png",
    findGuide: {
      ko: [
        "앉아서 발목 패드를 앞으로 차올리는 머신",
        "발목 앞에 롤러 패드, 셀렉터 핀으로 무게 조절",
        "허벅지 앞면(대퇴사두) 격리 머신",
        "보통 레그 컬과 함께 배치 (앞·뒤 짝)",
        "스쿼트와 다르게 — 무릎 관절만 움직이는 단관절 운동",
      ],
      en: [
        "A machine where you sit and extend your knees forward against a pad",
        "Ankle roller in front, pin selector for weight",
        "Isolates the quadriceps",
        "Usually paired with Leg Curl (quad/hamstring pair)",
        "Unlike Squat — single-joint (knee only)",
      ],
    },
    useGuide: {
      ko: [
        "좌석 깊이 조절 — 무릎이 머신 회전축과 같은 선에 위치",
        "발목 롤러 — 발등 살짝 위에 닿게",
        "엉덩이 좌석에 단단히 — 들리지 않게",
        "올릴 때 무릎 끝까지 펴지 말기 (잠그지 않기) — 마지막 5도 남기기",
        "내릴 때 천천히 — 떨어뜨리듯 X",
      ],
      en: [
        "Seat depth — knees aligned with the machine's pivot axis",
        "Ankle roller — just above the top of the foot",
        "Hips planted on the seat — don't let them lift",
        "Don't fully lock knees at the top — leave the last 5°",
        "Lower slowly — no dropping",
      ],
    },
  },

  "레그 컬 (Leg Curl)": {
    imagePath: "/machine/leg-press.png",
    findGuide: {
      ko: [
        "엎드리거나 앉아서 발목으로 패드를 뒤로/아래로 당기는 머신",
        "엎드린 형태(라잉) 또는 앉은 형태(시티드) 두 종류",
        "허벅지 뒷면(햄스트링) 격리 머신",
        "보통 레그 익스텐션 옆 (앞·뒤 짝)",
        "데드리프트와 다르게 — 무릎 관절만 굽히는 단관절 운동",
      ],
      en: [
        "A machine where you curl your ankles back/down against a pad (lying or seated)",
        "Two types: prone (lying) or seated",
        "Isolates the hamstrings",
        "Usually next to Leg Extension (quad/hamstring pair)",
        "Unlike Deadlift — single-joint (knee only)",
      ],
    },
    useGuide: {
      ko: [
        "패드 위치 — 발목 뒤(아킬레스 살짝 위)에 닿게",
        "엎드린 형태면 엉덩이 살짝 들리지 않게 — 허리 둥글면 멈춤",
        "당길 때 햄스트링 \"짜이는\" 느낌 — 엉덩이로 들지 않게",
        "끝까지 굽히고 1초 정점",
        "내릴 때 천천히 — 떨어뜨리듯 X",
      ],
      en: [
        "Pad position — behind the ankle (just above the Achilles)",
        "On prone version, don't lift the hips — stop if back rounds",
        "Feel the hamstrings \"squeeze\" on the curl — don't drive with hips",
        "Full flexion + 1-second peak",
        "Lower slowly — no dropping",
      ],
    },
  },

  "핵 스쿼트 (Hack Squat)": {
    imagePath: "/machine/leg-press.png",
    findGuide: {
      ko: [
        "비스듬한 등받이에 어깨를 대고 발판에 발을 올려 미는 머신",
        "레그 프레스와 비슷하지만 — 등이 직립에 가까워 자세가 \"스쿼트\" 같음",
        "양옆 또는 위쪽에 안전 핸들",
        "플레이트로 무게 추가",
        "스쿼트 랙과 다르게 — 등이 패드에 받쳐져 균형 부담 X",
      ],
      en: [
        "A machine where you lean back on a pad with shoulders against a yoke and push the platform",
        "Similar to Leg Press, but more upright — feels like a squat",
        "Safety handles on the sides or top",
        "Plates load on the bar/sled",
        "Unlike a squat rack — back is supported, no balance demand",
      ],
    },
    useGuide: {
      ko: [
        "어깨 패드(요크) 단단히 고정 — 들썩이지 않게",
        "발 위치 — 발판 가운데 어깨너비, 발끝 약 15도 바깥",
        "안전 핸들 위치 익히기 — 시작/종료 잠금 해제용",
        "양쪽 플레이트 균형",
        "처음이면 빈 머신 — 머신 자체 무게가 무거움",
      ],
      en: [
        "Shoulder yoke pressed firmly — no shifting",
        "Foot position — center of platform, shoulder-width, toes ~15° out",
        "Know the safety handles — for start/end locking",
        "Equal plate weight",
        "Start with empty if new — the machine itself is heavy",
      ],
    },
  },

  "힙 어덕션 머신 (Hip Adduction Machine)": {
    imagePath: "/machine/leg-press.png",
    findGuide: {
      ko: [
        "앉아서 양 무릎 안쪽 패드를 모으는 머신 (다리 모으기)",
        "셀렉터 핀으로 무게 조절",
        "보통 힙 어브덕션과 같은 머신 또는 옆에 배치 (반대 동작 짝)",
        "내전근(허벅지 안쪽) 격리 머신",
        "스쿼트와 다르게 — 단관절·격리 운동",
      ],
      en: [
        "A seated machine where you squeeze your inner thighs together (adduction)",
        "Pin selector for weight",
        "Usually the same machine as Hip Abduction or right next to it (paired movements)",
        "Isolates the adductors (inner thigh)",
        "Unlike Squat — single-joint isolation",
      ],
    },
    useGuide: {
      ko: [
        "패드 위치 조절 — 무릎 안쪽에 닿게 (좌우 같이)",
        "엉덩이 좌석에 단단히 + 등받이에 등 \"고정\"",
        "양 무릎을 안쪽으로 모으듯 천천히",
        "정점에서 1초 \"짜내기\"",
        "처음이면 가벼운 무게 + 너무 넓게 시작하지 말기 (사타구니 부담)",
      ],
      en: [
        "Adjust pads to touch the inside of the knees (symmetric)",
        "Hips firmly on the seat + back glued to backrest",
        "Squeeze knees together slowly",
        "1-second squeeze at the center",
        "Start light + don't open too wide initially (groin strain risk)",
      ],
    },
  },

  "힙 어브덕션 머신 (Hip Abduction Machine)": {
    imagePath: "/machine/leg-press.png",
    findGuide: {
      ko: [
        "앉아서 양 무릎 바깥 패드를 벌리는 머신 (다리 벌리기)",
        "셀렉터 핀으로 무게 조절",
        "어덕션 머신과 같은 머신 또는 옆에 배치",
        "외전근/중둔근(엉덩이 옆) 격리 머신",
        "스쿼트와 다르게 — 단관절·격리 운동",
      ],
      en: [
        "A seated machine where you push your knees outward (abduction)",
        "Pin selector for weight",
        "Same machine as Hip Adduction or right next to it",
        "Isolates the abductors / glute medius (outer hip)",
        "Unlike Squat — single-joint isolation",
      ],
    },
    useGuide: {
      ko: [
        "패드 위치 조절 — 무릎 바깥쪽에 닿게",
        "엉덩이 좌석 + 등 등받이 단단히",
        "양 무릎을 바깥쪽으로 벌리듯 천천히",
        "정점에서 1초 \"짜내기\"",
        "처음이면 가벼운 무게 — 좌석에서 들썩이지 않게",
      ],
      en: [
        "Adjust pads to touch the outside of the knees",
        "Hips on seat + back on backrest firmly",
        "Push knees outward slowly",
        "1-second squeeze at the top",
        "Start light — don't bounce on the seat",
      ],
    },
  },

  "백익스텐션 머신 (Back Extension Machine)": {
    imagePath: "/machine/bench-press.png",
    findGuide: {
      ko: [
        "허리 위쪽이 패드, 발목 아래가 롤러로 고정된 머신 (45도 또는 90도)",
        "허리 폄(extension) 동작용 — 후면 사슬(허리/엉덩이/햄스트링)",
        "보통 코어 운동 영역에 배치",
        "데드리프트와 다르게 — 등 각도 변화로 자극, 무게 부담 적음",
        "Hyperextension 또는 Roman Chair라고도 불러요",
      ],
      en: [
        "A machine with a hip/thigh pad and ankle roller (45° or 90°)",
        "For back extension — posterior chain (low back / glutes / hamstrings)",
        "Usually placed in the core area",
        "Unlike Deadlift — extension via angle change, less spinal load",
        "Also called Hyperextension or Roman Chair",
      ],
    },
    useGuide: {
      ko: [
        "패드 높이 조절 — 골반 위 허벅지 윗부분에 닿게 (배 압박 X)",
        "발목 롤러 단단히 고정",
        "엉덩이가 패드 위에서 자유롭게 굽힘 (\"hinge\")",
        "올라올 때 허리가 뒤로 꺾이지 않게 — 직선까지만",
        "처음이면 맨몸으로 폼부터 — 무게 들고 하면 부담 큼",
      ],
      en: [
        "Pad height — at the upper thighs / hip crease (not pressing the belly)",
        "Ankle rollers firmly locked",
        "Hips hinge freely over the pad",
        "Don't hyperextend at the top — stop at the straight line",
        "Start with bodyweight — adding weight too early stresses the back",
      ],
    },
  },

  // ── 등 (MACHINE/BW) ──
  "인버티드 로우 (Inverted Row)": {
    imagePath: "/machine/squat-rack1.png",
    findGuide: {
      ko: [
        "스쿼트 랙 / 스미스 머신 / 바벨 거치대에 바벨/봉을 가슴 높이로 설정",
        "TRX 스트랩으로도 가능 (TRX 로우와 거의 같음)",
        "맨몸 또는 발 받침으로 강도 조절",
        "풀업의 \"수평 버전\" — 등 후면 자극",
        "풀업 못 하는 초보자에게 좋은 단계 (보조 풀업과 함께)",
      ],
      en: [
        "Set a bar in a squat rack / Smith machine / barbell rack at chest height",
        "TRX straps work too (similar to TRX Row)",
        "Bodyweight or foot support to adjust intensity",
        "\"Horizontal pull-up\" — targets posterior back",
        "Great progression for beginners who can't do pull-ups (along with Assisted Pull-ups)",
      ],
    },
    useGuide: {
      ko: [
        "바벨 높이 — 누워서 팔 펴면 봉이 손에 닿는 높이",
        "그립 — 어깨너비 살짝 넓게, 오버그립",
        "몸을 곧게 — 머리부터 발끝까지 일직선 유지",
        "당길 때 가슴이 봉으로 — 어깨를 뒤로 모으는 느낌",
        "발 받침 추가하면 더 어려워짐 — 처음이면 발 바닥에",
      ],
      en: [
        "Bar height — bar should touch your hand when lying with arms extended",
        "Grip — slightly wider than shoulders, overhand",
        "Body straight — head to feet in one line",
        "Pull until chest meets the bar — squeeze shoulders back",
        "Elevating the feet makes it harder — start with feet on the floor",
      ],
    },
  },

  "어시스티드 풀업 (Assisted Pull-ups)": {
    imagePath: "/machine/pull-up-bar.png",
    findGuide: {
      ko: [
        "카운터웨이트로 체중 일부를 빼주는 어시스트 머신",
        "패드(무릎/발판) 위에 무릎 또는 발을 올림",
        "셀렉터 핀이 \"빼주는\" 무게 — 클수록 더 쉬워짐",
        "풀업과 다르게 — 머신이 도와줘 초보 진입 가능",
        "밴드 어시스트(밴드를 봉에 걸어 발 받침)도 가능",
      ],
      en: [
        "An assist machine that counterweights part of your bodyweight",
        "Place knees or feet on the pad/platform",
        "Pin selector controls assistance — more weight = easier",
        "Unlike Pull-ups — machine helps, beginner-friendly",
        "Band assistance also possible (band looped on bar, foot in band)",
      ],
    },
    useGuide: {
      ko: [
        "무릎/발 패드 단단히 — 떨어뜨리지 않게",
        "셀렉터 핀 위치 — 처음이면 \"빼는 무게\" 크게 시작",
        "그립 — 어깨너비보다 살짝 넓게 (오버그립)",
        "어깨 \"고정\" 후 당기기 — 풀업과 동일 폼",
        "어시스트 무게 점진적 감소 → 자력 풀업으로 진행",
      ],
      en: [
        "Knees/feet firmly on the pad — don't fall off",
        "Pin position — start with high assist (more counterweight)",
        "Grip — slightly wider than shoulders (overhand)",
        "Pack the shoulders before pulling — same form as Pull-up",
        "Reduce assist over time → graduate to bodyweight pull-up",
      ],
    },
  },

  "친업 (Chin-ups)": {
    imagePath: "/machine/pull-up-bar.png",
    findGuide: {
      ko: [
        "풀업 봉을 그대로 사용 — 그립만 다름",
        "친업 = 언더그립 (손바닥이 본인 쪽), 풀업 = 오버그립",
        "이두 동원이 더 큼 — 풀업보다 살짝 쉬워요",
        "보조 풀업 머신/밴드도 동일하게 적용 가능",
        "맨몸 풀업 못 하면 친업부터 시도 추천",
      ],
      en: [
        "Same bar as Pull-up — only the grip differs",
        "Chin-up = underhand (palms facing you), Pull-up = overhand",
        "More biceps involvement — slightly easier than pull-ups",
        "Assisted machine/band works the same way",
        "If pull-up is too hard, start with chin-ups",
      ],
    },
    useGuide: {
      ko: [
        "그립 — 어깨너비, 손바닥이 본인 쪽 (언더그립)",
        "어깨 \"고정\" 후 당기기 — 어깨 다치지 않게",
        "당길 때 턱이 봉을 살짝 지나가는 느낌",
        "내릴 때도 천천히 — 떨어지듯 내리면 팔꿈치 부담",
        "처음이면 보조 머신/밴드부터 — 한 개도 무리 X",
      ],
      en: [
        "Grip — shoulder-width, palms facing you (underhand)",
        "Pack the shoulders before pulling — protect them",
        "Pull until the chin passes slightly above the bar",
        "Lower slowly — falling stresses elbows",
        "Start with assisted machine/band — even one rep isn't required",
      ],
    },
  },

  "중량 풀업 (Weighted Pull-ups)": {
    imagePath: "/machine/pull-up-bar.png",
    findGuide: {
      ko: [
        "풀업 봉 + 디핑 벨트(허리에 두르고 플레이트 매달기)",
        "디핑 벨트 없으면 덤벨을 발 사이로 잡거나 조끼 사용",
        "맨몸 풀업 5~10개 안정적으로 가능한 후 진입",
        "풀업과 동일 그립 (오버그립)",
        "벨트 + 플레이트 셋업이 가장 안정적",
      ],
      en: [
        "Pull-up bar + dipping belt (chain around waist, plate hangs)",
        "No belt? Hold dumbbell between feet or wear weighted vest",
        "Progress here only after 5-10 strict bodyweight pull-ups",
        "Same grip as Pull-up (overhand)",
        "Belt + plate setup is most stable",
      ],
    },
    useGuide: {
      ko: [
        "디핑 벨트를 허리에 단단히 — 너무 헐렁하면 흔들림 위험",
        "플레이트 콜라/카라비너로 고정",
        "처음이면 가벼운 플레이트(2.5~5kg)부터",
        "맨몸 풀업과 동일 폼 — 무게가 폼 깨면 보조 줄이기",
        "내릴 때 더 천천히 — 무게 있어 어깨/팔꿈치 부담 큼",
      ],
      en: [
        "Belt secured firmly — too loose risks swinging",
        "Lock the plate with a collar/carabiner",
        "Start light (2.5-5 kg) when adding weight",
        "Same form as bodyweight — drop weight if form breaks",
        "Lower more slowly — weight stresses shoulders/elbows",
      ],
    },
  },

  // ── 케틀벨 (KETTLEBELL) ──
  "케틀벨 스윙 (Kettlebell Swing)": {
    imagePath: "/machine/flat-bench.png",
    findGuide: {
      ko: [
        "케틀벨 1개 + 빈 공간 (앞으로 1m 이상)",
        "보통 자유 웨이트존이나 케틀벨 거치대 옆",
        "양손 또는 한 손 변형 (양손이 표준)",
        "데드리프트와 다르게 — 폭발적 \"hip hinge\" 동작",
        "초보자도 쉽게 시작 가능 (단, 폼이 매우 중요)",
      ],
      en: [
        "One kettlebell + clear space (1m+ in front)",
        "Free-weight area or near the kettlebell rack",
        "Two-handed or one-handed variations (two-handed is standard)",
        "Unlike Deadlift — explosive hip-hinge movement",
        "Beginner-friendly to start, but form is critical",
      ],
    },
    useGuide: {
      ko: [
        "케틀벨 위치 — 발 앞 약 30cm",
        "발 — 어깨너비 살짝 넓게, 발끝 약간 바깥",
        "허리 곧게 + 엉덩이 뒤로 — 무릎 살짝만 굽힘",
        "엉덩이로 \"차내듯\" 폭발적으로 앞으로 (어깨 높이까지만)",
        "팔로 들지 않게 — 케틀벨은 자연스럽게 떠올라야",
      ],
      en: [
        "Kettlebell — about 30 cm in front of your feet",
        "Feet — slightly wider than shoulders, toes slightly out",
        "Back straight, hips hinged back — only soft knee bend",
        "Drive the hips forward explosively (kettlebell rises to shoulder height max)",
        "Don't lift with arms — the kettlebell should float up",
      ],
    },
  },

  "케틀벨 고블릿 스쿼트 (Kettlebell Goblet Squat)": {
    imagePath: "/machine/flat-bench.png",
    findGuide: {
      ko: [
        "케틀벨 1개를 가슴 앞에 들고 스쿼트",
        "별도 거치대 X — 스쿼트 랙 불필요",
        "케틀벨 거치대 옆에 넓은 공간 추천",
        "백 스쿼트와 다르게 — 무게가 앞쪽이라 코어 더 일함",
        "초보자가 스쿼트 폼 익히기에 가장 좋은 변형",
      ],
      en: [
        "Hold one kettlebell at chest level and squat",
        "No rack needed",
        "Open space near the kettlebell rack",
        "Unlike Back Squat — front-loaded, more core demand",
        "Best beginner squat variation for learning form",
      ],
    },
    useGuide: {
      ko: [
        "케틀벨 — 손잡이 양쪽 \"뿔\"을 양손으로 잡고 가슴 앞 (잔 모양처럼)",
        "발 — 어깨너비 살짝 넓게, 발끝 약 15도 바깥",
        "내려갈 때 무릎이 발끝 방향, 허벅지 평행까지",
        "상체 거의 수직 — 무게가 앞이라 자연스럽게 곧음",
        "처음이면 가벼운 케틀벨로 폼부터",
      ],
      en: [
        "Hold the kettlebell by the \"horns\" with both hands at chest (like a goblet)",
        "Feet — slightly wider than shoulders, toes ~15° out",
        "Knees track in line with toes, thighs parallel",
        "Torso nearly vertical — front-load keeps it upright",
        "Start with a light kettlebell to drill form",
      ],
    },
  },

  "케틀벨 데드리프트 (Kettlebell Deadlift)": {
    imagePath: "/machine/flat-bench.png",
    findGuide: {
      ko: [
        "케틀벨 1개 (또는 2개) — 양 발 사이",
        "케틀벨 거치대 옆 또는 자유 공간",
        "바벨 데드리프트의 \"입문\" 버전 — 폼 익히기 좋음",
        "한 손 / 양손 / 더블 케틀벨 변형",
        "컨벤셔널 데드리프트와 동일한 hip hinge 패턴",
      ],
      en: [
        "One (or two) kettlebell — between your feet",
        "Near the kettlebell rack or open space",
        "\"Entry-level\" version of barbell deadlift — great for learning form",
        "One-handed / two-handed / double-kettlebell variants",
        "Same hip-hinge pattern as conventional deadlift",
      ],
    },
    useGuide: {
      ko: [
        "케틀벨 — 발 중앙 사이",
        "발 — 어깨너비, 발끝 약간 바깥",
        "허리 곧게 + 엉덩이 뒤로 — 정강이 거의 수직",
        "올라올 때 다리로 바닥 미는 느낌",
        "처음이면 가벼운 케틀벨로 hip hinge 익히기",
      ],
      en: [
        "Kettlebell — between the midfeet",
        "Feet shoulder-width, toes slightly out",
        "Back straight, hips hinged back — shins nearly vertical",
        "Drive up by pushing the floor with the legs",
        "Start light to drill the hip-hinge",
      ],
    },
  },

  "케틀벨 로우 (Kettlebell Row)": {
    imagePath: "/machine/flat-bench.png",
    findGuide: {
      ko: [
        "케틀벨 1개 — 한 손 로우 형태가 표준",
        "벤치 또는 무릎 위에 한 손 받침 (덤벨 로우와 비슷)",
        "케틀벨 거치대 가까이",
        "덤벨 로우와 다르게 — 손잡이가 위쪽이라 자연스러운 그립",
        "더블 케틀벨로 양손 동시 변형도 가능",
      ],
      en: [
        "One kettlebell — single-arm row is standard",
        "One hand on a bench or knee for support (like dumbbell row)",
        "Near the kettlebell rack",
        "Unlike Dumbbell Row — handle on top gives natural grip",
        "Double-kettlebell version possible (two-arm)",
      ],
    },
    useGuide: {
      ko: [
        "벤치 받침 — 한 손/한 무릎",
        "허리 곧게 — 등 바닥과 거의 평행",
        "당길 때 팔꿈치를 천장 쪽으로",
        "정점에서 1초 등 짜내기",
        "처음이면 가벼운 케틀벨",
      ],
      en: [
        "Bench support — one hand and one knee",
        "Back straight — nearly parallel to the floor",
        "Pull the elbow toward the ceiling",
        "1-second back squeeze at the top",
        "Start light",
      ],
    },
  },

  "케틀벨 오버헤드 프레스 (Kettlebell Overhead Press)": {
    imagePath: "/machine/flat-bench.png",
    findGuide: {
      ko: [
        "케틀벨 1개 — 한 손 프레스 표준 (또는 양손 더블)",
        "별도 머신 불필요 — 자유 공간",
        "오버헤드 프레스와 다르게 — 케틀벨 손잡이 회전 자유로워 어깨 자연 궤도",
        "한쪽씩 진행 — 좌우 균형 + 코어 자극",
        "케틀벨 거치대 옆에서",
      ],
      en: [
        "One kettlebell — single-arm press is standard (or double)",
        "No machine needed — open space",
        "Unlike Overhead Press — kettlebell rotates freely, allowing the shoulder's natural arc",
        "One arm at a time — balance + core demand",
        "Near the kettlebell rack",
      ],
    },
    useGuide: {
      ko: [
        "케틀벨 \"랙 포지션\" — 어깨 앞, 손잡이 약간 회전 (손바닥 안쪽)",
        "발 어깨너비, 코어 brace",
        "올릴 때 손목 자연스럽게 회전 — 정점에서 손바닥 앞쪽",
        "팔꿈치 잠그고 머리 위 정렬",
        "처음이면 가벼운 무게 + 한쪽씩",
      ],
      en: [
        "Kettlebell \"rack position\" — at the front of the shoulder, handle rotated (palm in)",
        "Feet shoulder-width, brace the core",
        "Rotate the wrist on the way up — palm faces forward at the top",
        "Lock elbow + bar overhead aligned",
        "Start light + one arm at a time",
      ],
    },
  },

  "더블 케틀벨 프론트 스쿼트 (Double Kettlebell Front Squat)": {
    imagePath: "/machine/flat-bench.png",
    findGuide: {
      ko: [
        "케틀벨 2개 — 양 어깨 앞 \"랙 포지션\"",
        "스쿼트 랙 불필요 — 자유 공간",
        "고블릿 스쿼트의 발전형 — 무게 더 무겁게 가능",
        "프론트 스쿼트(바벨)와 다르게 — 그립이 자유로워 손목 부담 적음",
        "케틀벨 2개 거치대 옆에서 진행",
      ],
      en: [
        "Two kettlebells — at the front of each shoulder (\"rack position\")",
        "No squat rack — open space",
        "Progression from Goblet Squat — heavier loading possible",
        "Unlike Front Squat (barbell) — free grip, less wrist strain",
        "Near the kettlebell rack",
      ],
    },
    useGuide: {
      ko: [
        "양 케틀벨 \"랙 포지션\" — 손목 직각, 손잡이 어깨 앞",
        "팔꿈치 위치 — 살짝 들어 안정적인 \"선반\"",
        "발 — 어깨너비 살짝 넓게, 발끝 약 15도 바깥",
        "내려갈 때 상체 수직 유지 — 프론트 스쿼트와 동일",
        "처음이면 가벼운 케틀벨 한 쌍",
      ],
      en: [
        "Both kettlebells in rack position — wrists straight, handles at shoulder front",
        "Elbows slightly raised for a stable \"shelf\"",
        "Feet — slightly wider than shoulders, toes ~15° out",
        "Keep torso vertical on the descent — same as Front Squat",
        "Start with a light pair",
      ],
    },
  },

  // ── TRX/매달리기 ──
  "TRX 로우 (TRX Row)": {
    imagePath: "/machine/pull-up-bar.png",
    findGuide: {
      ko: [
        "천장이나 봉에 매달린 TRX 스트랩 (Y자 모양)",
        "두 손잡이를 양손에 잡고 누운 자세에서 당김",
        "맨몸 운동 — 발 위치로 강도 조절 (가까울수록 어려움)",
        "인버티드 로우와 비슷 — 다만 그립이 \"중립\"이라 어깨 친화적",
        "주변 충분한 공간 필요 (몸 길이 + α)",
      ],
      en: [
        "TRX straps hanging from a bar or ceiling (Y-shape)",
        "Grip both handles, body angled back — pull yourself up",
        "Bodyweight only — foot position controls difficulty (closer = harder)",
        "Similar to Inverted Row — but neutral grip is more shoulder-friendly",
        "Need clear space (body length + extra)",
      ],
    },
    useGuide: {
      ko: [
        "스트랩 길이 — 누웠을 때 손잡이가 가슴 옆 정도",
        "그립 — 양손 중립 (손바닥 마주 보기)",
        "몸을 곧게 — 머리부터 발끝까지 일직선",
        "당길 때 어깨를 뒤로 모으기 — 등이 일하도록",
        "발 위치로 강도 조절 — 처음이면 발 멀리 (쉬움)",
      ],
      en: [
        "Strap length — handles at chest-side when lying back",
        "Grip — neutral (palms facing each other)",
        "Body straight — head to feet in one line",
        "Pull and squeeze the shoulders back — let the back work",
        "Foot position controls difficulty — start with feet farther out (easier)",
      ],
    },
  },

  "TRX 바이셉스 컬 (TRX Biceps Curl)": {
    imagePath: "/machine/pull-up-bar.png",
    findGuide: {
      ko: [
        "TRX 스트랩 사용 — 로우와 동일 셋업",
        "그립만 다름 — 언더그립(손바닥이 본인 쪽)으로 컬",
        "맨몸 컬 변형 — 발 위치로 강도 조절",
        "덤벨 컬과 다르게 — 정점에서 케이블 같은 일정 저항",
        "초보자에게 좋은 컬 입문",
      ],
      en: [
        "TRX straps — same setup as TRX Row",
        "Underhand grip (palms facing you) for the curl",
        "Bodyweight curl variation — foot position controls difficulty",
        "Unlike Dumbbell Curl — constant resistance like a cable",
        "Beginner-friendly curl entry",
      ],
    },
    useGuide: {
      ko: [
        "스트랩 길이 — 팔 펼쳤을 때 손잡이가 가슴 옆",
        "그립 — 언더그립",
        "팔꿈치 \"고정\" 위치 — 어깨 앞쪽, 절대 떨어뜨리지 않게",
        "당길 때 손이 머리 쪽으로 — 컬 동작",
        "발 위치로 강도 조절 — 처음이면 발 멀리",
      ],
      en: [
        "Strap length — handles at chest-side when arms extended",
        "Grip — underhand (palms facing you)",
        "Lock elbows in place — at the front of the shoulders, never drop",
        "Pull hands toward the head — curling motion",
        "Foot position controls difficulty — start with feet farther out",
      ],
    },
  },

  "행잉 레그 레이즈 (Hanging Leg Raise)": {
    imagePath: "/machine/pull-up-bar.png",
    findGuide: {
      ko: [
        "풀업 봉에 매달려 다리 들어올리는 운동",
        "별도 머신 X — 풀업 봉과 동일 시설",
        "캡틴스 체어(Captain's Chair, 팔꿈치 받침대)도 가능 — 더 쉬움",
        "코어(복근) 운동의 결정판 — 스트레이트 레그 = 가장 어려움",
        "행잉 니 레이즈가 입문 변형",
      ],
      en: [
        "Hang from a pull-up bar and raise the legs",
        "No extra equipment — same as pull-up bar",
        "Captain's Chair (forearm rests) also works — easier version",
        "Top-tier core exercise — straight legs = hardest",
        "Hanging Knee Raise is the beginner variation",
      ],
    },
    useGuide: {
      ko: [
        "그립 — 어깨너비, 오버그립",
        "어깨 \"고정\" — 매달릴 때 어깨 으쓱 X",
        "다리 들어올릴 때 골반이 살짝 말림 — 복근 짜내는 느낌",
        "내릴 때도 천천히 — 흔들림 통제",
        "처음이면 행잉 니 레이즈부터",
      ],
      en: [
        "Grip — shoulder-width, overhand",
        "Pack the shoulders — no shrugging when hanging",
        "On the lift, the pelvis tucks slightly — feel the abs squeeze",
        "Lower slowly — control any swinging",
        "Start with Hanging Knee Raise",
      ],
    },
  },

  "행잉 니 레이즈 (Hanging Knee Raise)": {
    imagePath: "/machine/pull-up-bar.png",
    findGuide: {
      ko: [
        "풀업 봉에 매달려 무릎을 가슴 쪽으로 올림",
        "행잉 레그 레이즈의 입문 변형 — 무릎 굽혀서 가벼움",
        "캡틴스 체어로도 가능 — 더 쉬움",
        "코어/복근 입문 운동",
        "팔과 어깨도 같이 운동되는 효과",
      ],
      en: [
        "Hang from a pull-up bar and raise the knees toward the chest",
        "Beginner version of Hanging Leg Raise — bent knees = lighter",
        "Captain's Chair works too — even easier",
        "Beginner-level core/abs exercise",
        "Also works the arms and shoulders as a side effect",
      ],
    },
    useGuide: {
      ko: [
        "그립 — 어깨너비, 오버그립",
        "어깨 \"고정\" 후 매달리기",
        "무릎을 가슴 쪽으로 올리며 골반 살짝 말기",
        "정점 1초, 내릴 때 천천히 — 흔들리지 않게",
        "행잉 니 레이즈 → 행잉 레그 레이즈 → 토스 투 바 순서로 진행",
      ],
      en: [
        "Grip — shoulder-width, overhand",
        "Pack the shoulders before hanging",
        "Raise knees toward the chest, slight pelvic tuck",
        "1-second peak + slow lower — control swinging",
        "Progression: Knee Raise → Leg Raise → Toes-to-Bar",
      ],
    },
  },

  // ── 종아리 (CALF MACHINES) ──
  "스탠딩 카프 레이즈 (Standing Calf Raises)": {
    imagePath: "/machine/leg-press.png",
    findGuide: {
      ko: [
        "어깨 패드가 있는 머신에서 발끝으로 \"까치발\" 동작",
        "스미스 머신/덤벨/케틀벨로도 변형 가능",
        "발끝이 받침대(또는 발판) 위에, 뒤꿈치 자유롭게 내려가게",
        "종아리 격리 운동",
        "보통 종아리 운동 머신 영역에 배치",
      ],
      en: [
        "A machine with shoulder pads where you raise onto your toes",
        "Variations with Smith machine, dumbbells, or kettlebells",
        "Toes on a platform, heels free to drop below",
        "Isolates the calves",
        "Usually grouped with calf machines",
      ],
    },
    useGuide: {
      ko: [
        "어깨 패드 단단히 — 머리/목으로 받지 않게",
        "발끝 받침대 위 — 뒤꿈치 가능한 한 깊이 내림",
        "올릴 때 발끝까지 — 정점에서 1초 짜내기",
        "내릴 때 천천히 — 종아리 늘어남 끝까지",
        "처음이면 가벼운 무게 — 가동범위 익히기 우선",
      ],
      en: [
        "Shoulder pads firmly — not on the head/neck",
        "Toes on the platform — heels drop as deep as possible",
        "Rise to the tips of the toes — 1-second squeeze at the top",
        "Lower slowly — full calf stretch at the bottom",
        "Start light — drill the range first",
      ],
    },
  },

  "시티드 카프 레이즈 (Seated Calf Raises)": {
    imagePath: "/machine/leg-press.png",
    findGuide: {
      ko: [
        "앉아서 무릎 위 패드를 올리는 머신",
        "스탠딩과 다르게 — 무릎이 굽혀 \"솔레우스(가자미근)\" 자극",
        "발끝이 받침대 위, 무릎 위에 패드",
        "종아리 운동 머신 영역에 배치",
        "스탠딩 + 시티드 둘 다 하면 종아리 전체 자극",
      ],
      en: [
        "A seated machine where you raise a pad sitting over the knees",
        "Unlike Standing — knees bent target the soleus",
        "Toes on the platform, pad over the knees",
        "Grouped with calf machines",
        "Standing + Seated together hits the full calf",
      ],
    },
    useGuide: {
      ko: [
        "패드 위치 — 무릎 바로 위 (대퇴 X)",
        "발끝 받침대 — 뒤꿈치 자유롭게 내려가게",
        "올릴 때 발끝 끝까지",
        "정점 1초 + 내릴 때 천천히",
        "솔레우스는 작은 근육이라 무리하지 말기",
      ],
      en: [
        "Pad position — directly over the knees (not the thighs)",
        "Toes on the platform — heels drop freely",
        "Rise to the tips of the toes",
        "1-second peak + slow descent",
        "Soleus is a small muscle — don't overload",
      ],
    },
  },

  "동키 카프 레이즈 (Donkey Calf Raises)": {
    imagePath: "/machine/leg-press.png",
    findGuide: {
      ko: [
        "허리 굽힌 자세 + 등 위에 무게(또는 머신)",
        "전용 머신 또는 다른 사람이 등에 무게로 앉기 (\"동키\" 이름의 유래)",
        "스탠딩과 다르게 — 허리 굽힘이 종아리 늘어남 강조",
        "무게 머신이 없으면 레그 프레스 머신 응용 가능",
        "보통 시설 흔치 않아 변형으로 진행",
      ],
      en: [
        "Bent-over posture with weight on the back (or machine)",
        "Dedicated machine or someone sitting on your back (origin of \"donkey\")",
        "Unlike Standing — bent posture emphasizes the calf stretch",
        "If no machine, use Leg Press as a substitute",
        "Equipment is rare in many gyms — often substituted",
      ],
    },
    useGuide: {
      ko: [
        "전용 머신: 허리 굽혀 패드를 등 위에 올림 — 발끝 받침대 위",
        "허리 곧게 — 둥글면 부담",
        "발끝 끝까지 올림 + 정점 1초",
        "내릴 때 천천히 — 종아리 늘어남 충분히",
        "전용 머신 없는 경우 다른 카프 변형으로 대체 가능",
      ],
      en: [
        "Dedicated machine: bend forward, pad rests on the back, toes on the platform",
        "Back straight — rounding strains it",
        "Rise to the tips of the toes + 1-second peak",
        "Lower slowly — full calf stretch",
        "Substitute with another calf variation if machine isn't available",
      ],
    },
  },
};

export function getEquipmentInfo(exerciseName: string): EquipmentInfo | undefined {
  return EXERCISE_EQUIPMENT[exerciseName];
}

export function getEquipmentFindGuide(
  exerciseName: string,
  locale: Locale,
): string[] {
  const info = EXERCISE_EQUIPMENT[exerciseName];
  if (!info) return [];
  return locale === "en" ? info.findGuide.en : info.findGuide.ko;
}

export function getEquipmentUseGuide(
  exerciseName: string,
  locale: Locale,
): string[] {
  const info = EXERCISE_EQUIPMENT[exerciseName];
  if (!info) return [];
  return locale === "en" ? info.useGuide.en : info.useGuide.ko;
}

/** 정확 매칭 — overlay 마운트 + 휴식 분기 공유. 신규 entry 추가하면 자동 확장. */
export function isBeginnerSupportedExercise(exerciseName: string): boolean {
  return exerciseName in EXERCISE_EQUIPMENT;
}
