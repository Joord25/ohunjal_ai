import type { Locale } from "@/hooks/useTranslation";

export interface EquipmentInfo {
  imagePath: string;
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
 * 신규 entry 추가 시:
 *  1) workout.ts 에 정확 일치하는 운동명 키
 *  2) imagePath 는 /public/machine/<slug>.png (없으면 새로 추가)
 *  3) find = 5 bullets (위치/외형/구별점)
 *  4) use = 5 bullets (안전 셋업, 폼 cue 와 분리)
 *  5) 한/영 동시 작성
 */
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

  // ══════════════════════════════════
  // ── 다리 (LEGS - Main Compound) ──
  // ══════════════════════════════════
  "바벨 백 스쿼트 (Barbell Back Squat)": {
    imagePath: "/machine/squat-rack.png",
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
    imagePath: "/machine/deadlift-platform.png",
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

  // ══════════════════════════════════
  // ── 어깨 (PUSH - Overhead) ──
  // ══════════════════════════════════
  "오버헤드 프레스 (Overhead Press)": {
    imagePath: "/machine/squat-rack.png",
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
    imagePath: "/machine/deadlift-platform.png",
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

  // ══════════════════════════════════
  // ── 팔 (CABLE - Accessory) ──
  // ══════════════════════════════════
  "케이블 오버헤드 트라이셉 익스텐션 (Cable Overhead Tricep Extension)": {
    imagePath: "/machine/cable-tricep.png",
    findGuide: {
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
    },
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
