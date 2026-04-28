import type { Locale } from "@/hooks/useTranslation";

export interface FormCueSet {
  source: string;
  cues: { ko: string[]; en: string[] };
}

/**
 * 정확한 자세 cue (출처 명시 — ACSM/NSCA/Rippetoe 등 신뢰 가능 가이드 기반).
 *
 * 회의 2026-04-28 (β): exerciseEquipment.ts 카테고리 정렬과 동일.
 * 신규 entry 추가 시:
 *  1) workout.ts 와 정확 일치하는 운동명 키
 *  2) cues = 5개 정확 (너무 많으면 오히려 헷갈림)
 *  3) source = ACSM Guidelines / NSCA Essentials / Starting Strength 등
 *  4) 한/영 동시 작성
 */
export const EXERCISE_FORM_CUES: Record<string, FormCueSet> = {
  // ══════════════════════════════════
  // ── 가슴 (PUSH - Main Compound) ──
  // ══════════════════════════════════
  "바벨 벤치 프레스 (Barbell Bench Press)": {
    source: "ACSM Guidelines 11th ch.7 + NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "발은 바닥에 단단히, 어깨너비로 고정",
        "등 아래에 큰 동전 하나 들어갈 정도의 자연스러운 아치",
        "손목은 곧게, 손등과 팔뚝이 일직선",
        "바벨은 가슴 중앙(유두선)으로 부드럽게 내리기",
        "팔꿈치는 몸통과 약 45도 — 어깨를 가장 편하게 보호해주는 각도예요",
      ],
      en: [
        "Plant feet firmly, shoulder-width apart",
        "Slight natural arch in the lower back (about a coin's thickness)",
        "Keep wrists straight, knuckles aligned with forearms",
        "Lower the bar to mid-chest (nipple line) under control",
        "Elbows tucked at ~45° — the angle that keeps shoulders safest",
      ],
    },
  },

  "덤벨 벤치 프레스 (Dumbbell Bench Press)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "양손 덤벨 가슴 옆까지 천천히 내리기 (팔꿈치 몸통과 약 45도)",
        "손목 곧게 — 덤벨이 흔들리지 않게 손바닥이 안정적으로 받쳐요",
        "어깨를 벤치에 단단히 눌러 \"고정\" — 날개뼈가 들리면 어깨 다쳐요",
        "올릴 때 양손이 가운데로 자연스럽게 모아져요 (덤벨끼리 부딪히지 않게)",
        "발은 바닥에 단단히 — 다리도 같이 운동에 참여하는 느낌으로",
      ],
      en: [
        "Lower the dumbbells slowly to chest level (elbows ~45° from torso)",
        "Wrists straight — palms support the dumbbells without wobble",
        "Press shoulders firmly into the bench (\"packed\") — lifting shoulder blades hurts the joint",
        "On the way up, hands naturally come together (don't clash dumbbells)",
        "Plant feet firmly — feel like the legs participate too",
      ],
    },
  },

  "인클라인 덤벨 프레스 (Incline Dumbbell Press)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "각도 30-45도 — 너무 세우면 어깨 운동, 너무 누우면 평벤치랑 같음",
        "덤벨을 가슴 위쪽(쇄골 살짝 아래)으로 내리기",
        "손목 직각 유지 — 손등이 위쪽으로 살짝 기우는 게 자연스러워요",
        "팔꿈치는 몸통과 약 45도 — 어깨 보호",
        "올릴 때 가슴 위쪽이 \"짜내지는\" 느낌이 들어야 정확한 자극",
      ],
      en: [
        "Angle 30-45° — too steep becomes shoulder, too flat becomes bench press",
        "Lower dumbbells to upper chest (just below collarbone)",
        "Keep wrists at right angle — knuckles tilting slightly upward is natural",
        "Elbows ~45° from torso — shoulder protection",
        "On the way up, you should feel a \"squeeze\" in the upper chest",
      ],
    },
  },

  // ══════════════════════════════════
  // ── 다리 (LEGS - Main Compound) ──
  // ══════════════════════════════════
  "바벨 백 스쿼트 (Barbell Back Squat)": {
    source: "Starting Strength 3rd Ed. (Mark Rippetoe) + NSCA Essentials",
    cues: {
      ko: [
        "발은 어깨너비 살짝 넓게, 발끝 약 15도 바깥쪽",
        "바벨은 등 위쪽 승모근 위 (목 바로 아래) — \"하이 바\"가 자연스러워요",
        "내려갈 때 무릎이 발끝 방향과 같게 — 안쪽으로 무너지지 않게",
        "허벅지가 바닥과 평행 또는 살짝 더 깊게 (개인 가동범위 안에서)",
        "올릴 때 가슴을 먼저 들어올리는 느낌 — 엉덩이가 먼저 올라가면 허리 부담",
      ],
      en: [
        "Feet slightly wider than shoulders, toes ~15° out",
        "Bar rests on upper traps (just below the neck) — \"high bar\" is most natural",
        "Knees track in line with toes — don't collapse inward",
        "Thighs parallel to floor or slightly deeper (within your range)",
        "On the way up, lift the chest first — hips rising first puts strain on the lower back",
      ],
    },
  },

  "컨벤셔널 데드리프트 (Conventional Deadlift)": {
    source: "Starting Strength 3rd Ed. (Mark Rippetoe) + NSCA Essentials",
    cues: {
      ko: [
        "바벨이 발 중앙(미드풋) 위 — 정강이가 바벨에 거의 닿을 정도",
        "그립은 어깨너비 — 양팔이 다리 바깥쪽",
        "들기 직전 등을 곧게 — \"가슴 들고 어깨를 살짝 뒤로\"",
        "다리로 바닥을 미는 느낌 — 팔로 들어올리려고 하면 안 됨",
        "내려놓을 때도 같은 자세로 천천히 — 허리 다치는 건 보통 내려놓기에서",
      ],
      en: [
        "Bar over midfoot — shins almost touching the bar",
        "Grip shoulder-width — arms outside the legs",
        "Before lifting, set the back straight — \"chest up, shoulders slightly back\"",
        "Push the floor with your legs — don't try to lift with your arms",
        "Lower with the same form — most lower-back injuries happen on the way down",
      ],
    },
  },

  "레그 프레스 (Leg Press)": {
    source: "ACSM Guidelines 11th ch.7",
    cues: {
      ko: [
        "발 위치 — 발판 가운데, 어깨너비 (좁으면 무릎, 넓으면 엉덩이 자극)",
        "발끝 약 15도 바깥쪽 — 무릎이 발끝 방향과 일치",
        "내릴 때 무릎이 가슴 쪽으로 와서 90도까지 (너무 깊으면 허리가 들려요)",
        "허리는 항상 등받이에 붙어있게 — 떨어지면 멈추기",
        "올릴 때 무릎 완전히 펴지 말기 — 마지막 5도 남기는 느낌",
      ],
      en: [
        "Foot position — center of platform, shoulder-width (narrower = knees, wider = hips)",
        "Toes ~15° out — knees track in line with toes",
        "Lower until knees come toward chest at 90° (deeper than that lifts the lower back)",
        "Lower back always pressed to the backrest — stop if it lifts off",
        "Don't fully lock the knees at the top — leave the last 5°",
      ],
    },
  },

  // ══════════════════════════════════
  // ── 어깨 (PUSH - Overhead) ──
  // ══════════════════════════════════
  "오버헤드 프레스 (Overhead Press)": {
    source: "Starting Strength 3rd Ed. + NSCA Essentials",
    cues: {
      ko: [
        "그립 너비 — 어깨너비 살짝 넓게, 손목 직각 유지",
        "바벨 시작 위치 — 쇄골 위, 가슴이 살짝 앞으로 나와있어요",
        "올릴 때 머리가 살짝 앞으로 갔다가, 바벨이 머리를 지나면 다시 가운데로",
        "팔꿈치를 완전히 펴는 자세에서 머리 바로 위가 정확한 위치",
        "복근에 힘 — 허리가 뒤로 꺾이면 \"허리로 미는\" 보상 동작 됨",
      ],
      en: [
        "Grip width — slightly wider than shoulders, wrists at right angle",
        "Starting position — bar on collarbone, chest slightly forward",
        "On the way up, head moves slightly forward, then back to center as the bar passes",
        "At full lockout, the bar should be directly over the head",
        "Brace the core — leaning back means the lower back is compensating",
      ],
    },
  },

  // ══════════════════════════════════
  // ── 등 (PULL - Main Compound) ──
  // ══════════════════════════════════
  "풀업 (Pull-ups)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "그립 — 어깨너비보다 살짝 넓게, 손등이 본인 쪽 (오버그립)",
        "매달릴 때 어깨를 살짝 끌어내려 \"고정\" — 어깨 보호",
        "당길 때 가슴을 봉 쪽으로 — 턱이 봉을 살짝 지나가는 느낌",
        "내릴 때도 천천히 — 떨어지듯 내리면 어깨/팔꿈치 무리",
        "처음이면 보조 풀업/네거티브(내려오기만)부터 — 한 개도 무리하지 않아요",
      ],
      en: [
        "Grip — slightly wider than shoulders, knuckles facing you (overhand)",
        "When hanging, pack the shoulders down — protects them",
        "Pull your chest toward the bar — chin should pass slightly above",
        "Lower slowly too — falling down stresses shoulders and elbows",
        "If new, start with assisted/negatives (lower-only) — even one rep isn't required",
      ],
    },
  },

  "랫 풀다운 (Lat Pulldown)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "그립 — 어깨너비보다 살짝 넓게, 손등이 본인 쪽",
        "앉을 때 가슴이 봉을 향해 살짝 위로 뻗는 자세",
        "당길 때 봉을 가슴 위쪽(쇄골)으로 — 너무 아래로 당기면 어깨 부담",
        "어깨 으쓱하지 않게 — 어깨가 귀에 가까워지면 등이 일하지 않음",
        "올릴 때도 천천히 — 빠르게 풀면 등 자극이 절반",
      ],
      en: [
        "Grip — slightly wider than shoulders, knuckles facing you",
        "When seated, point your chest slightly upward toward the bar",
        "Pull the bar to your upper chest (collarbone) — too low strains the shoulders",
        "Don't shrug — shoulders rising toward ears means the back isn't working",
        "Lift back up slowly — fast release halves the back's work",
      ],
    },
  },

  "바벨 로우 (Barbell Row)": {
    source: "Starting Strength 3rd Ed. + NSCA Essentials",
    cues: {
      ko: [
        "허리는 곧게 — 약 45도 굽힌 자세에서 등이 둥글어지지 않게",
        "그립 너비 — 어깨너비, 손등이 위로 (오버그립 기본)",
        "당길 때 바벨을 배꼽 쪽으로 — 가슴 쪽으로 가면 어깨가 일함",
        "팔꿈치를 뒤로 보내는 느낌 — 손목/팔이 끄는 게 아니에요",
        "허리 다치기 쉬운 운동 — 무게보다 자세 우선, 가벼운 무게로 익히기",
      ],
      en: [
        "Keep the back straight — bent ~45° but not rounded",
        "Grip width — shoulder-width, knuckles up (overhand by default)",
        "Pull the bar toward your belly button — pulling to chest engages shoulders instead",
        "Drive the elbows back — wrists/arms don't pull, the back does",
        "Higher injury risk — form before weight, learn light first",
      ],
    },
  },

  "시티드 케이블 로우 (Seated Cable Row)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "허리는 곧게 — 너무 뒤로 누워서 당기면 등이 아닌 허리가 일해요",
        "발 위치 — 발판 가운데, 무릎 살짝 굽힘",
        "당길 때 손잡이를 배꼽 쪽으로 — 어깨를 뒤로 살짝 모으는 느낌",
        "팔꿈치를 몸통 가까이 — 너무 벌어지면 어깨 운동이 됨",
        "내릴 때도 천천히 — 케이블 저항을 끝까지 받아주기",
      ],
      en: [
        "Keep the back straight — leaning too far back makes the lower back work, not the upper back",
        "Foot position — center of platform, knees slightly bent",
        "Pull the handle to the belly button — squeeze the shoulder blades slightly back",
        "Keep elbows close to the torso — flaring out shifts to shoulders",
        "Release slowly — let the cable resist all the way",
      ],
    },
  },

  // ══════════════════════════════════
  // ── 팔 (CABLE - Accessory) ──
  // ══════════════════════════════════
  "케이블 오버헤드 트라이셉 익스텐션 (Cable Overhead Tricep Extension)": {
    source: "ACSM Guidelines 11th ch.7",
    cues: {
      ko: [
        "팔꿈치 위치 고정 — 머리 옆에 붙여두고 움직이지 않게",
        "내릴 때 손이 머리 뒤쪽으로 (손목은 자연스럽게 풀림)",
        "올릴 때 팔꿈치만 펴는 느낌 — 어깨 움직이면 자극 분산",
        "복근에 힘 — 허리가 뒤로 꺾이지 않게",
        "마지막에 \"짜내는\" 1초 — 트라이셉이 짧아지는 걸 느끼기",
      ],
      en: [
        "Lock elbows in place — keep them next to your head, no movement",
        "On the way down, hands go behind the head (wrists relax naturally)",
        "On the way up, only the elbows extend — moving the shoulders dilutes the stimulus",
        "Brace the core — don't let the back arch backward",
        "1-second squeeze at the top — feel the triceps shorten",
      ],
    },
  },

  "케이블 푸쉬 다운 (Cable Pushdown)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "팔꿈치를 옆구리에 \"붙여\" 고정 — 절대 앞뒤로 안 움직이게",
        "내릴 때 손등이 위로 — 손목 곧게 유지",
        "올릴 때(시작자세 복귀) 팔꿈치 90도 정도까지만 — 너무 위로 가면 휴식 됨",
        "어깨 으쓱하지 않게 — 어깨가 일하면 트라이셉 자극 감소",
        "마지막에 팔 완전히 펴고 \"짜내는\" 1초",
      ],
      en: [
        "Glue elbows to your sides — never let them swing forward/back",
        "On the way down, knuckles face up — keep wrists straight",
        "On return, only go to ~90° — going higher means resting",
        "Don't shrug — shoulders working dilutes triceps stimulus",
        "1-second squeeze at full extension at the bottom",
      ],
    },
  },

  "케이블 바이셉 컬 (Cable Bicep Curl)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "팔꿈치 옆구리 고정 — 컬 동작에서 절대 앞으로 나가지 않게",
        "올릴 때 손목 곧게 — 손목으로 끌어당기면 손목 다침",
        "내릴 때도 천천히 — 케이블은 끝까지 저항이라 \"내려놓기\" 가 핵심 자극",
        "어깨 으쓱하지 않게 — 어깨가 보상 동작 들어오면 효과 감소",
        "복근 수축 유지 — 몸통이 뒤로 흔들리면 \"치팅\"",
      ],
      en: [
        "Lock elbows at the sides — never swing them forward during the curl",
        "Keep wrists straight on the way up — pulling with wrists invites wrist injury",
        "Lower slowly — cable resists all the way; the negative is key",
        "Don't shrug — shoulders compensating reduces effect",
        "Maintain core tension — torso rocking back is \"cheating\"",
      ],
    },
  },

  "오버헤드 케이블 바이셉 컬 (Overhead Cable Bicep Curl)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "팔을 머리 옆 라인(T자세)으로 펼친 위치 유지 — 팔꿈치 절대 떨어지지 않게",
        "양손을 머리 쪽으로 당기는 컬 동작 — 양 이두가 정점에서 \"꽃봉오리\" 모양",
        "팔꿈치 위치는 고정, 손목은 자연스럽게 회전",
        "내릴 때(되돌리기) 천천히 — 정점 다음 1-2초 컨트롤",
        "처음이면 가벼운 무게 — 어깨가 무거우면 팔이 떨어져요",
      ],
      en: [
        "Keep arms in T-position with elbows at head-level — never let them drop",
        "Curl both hands toward the head — biceps form a \"flexed\" shape at the peak",
        "Elbow position fixed, wrists rotate naturally",
        "Slow on the way back — control 1-2 seconds after peak",
        "Start light — heavy weight makes the elbows drop",
      ],
    },
  },

  // ══════════════════════════════════
  // ── 가슴 (PUSH - Cable Accessory) ──
  // ══════════════════════════════════
  "케이블 체스트 프레스 (Cable Chest Press)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "양손이 가슴 옆에서 시작 — 팔꿈치 약 45도 (어깨 보호)",
        "밀 때 양손이 앞으로 모이듯 — 가슴 앞에서 살짝 만나는 느낌",
        "복근에 힘 + 한 발 앞으로 (자세 안정성)",
        "내릴 때(되돌리기) 천천히 — 케이블이 끝까지 당기는 걸 받아주기",
        "어깨가 앞으로 꺾이지 않게 — 가슴이 짜내지는 자극 위주로",
      ],
      en: [
        "Hands start beside the chest, elbows ~45° (shoulder protection)",
        "Press handles forward AND inward — they meet softly in front of the chest",
        "Brace the core, one foot forward for stability",
        "Slow on return — let the cable pull back through the full range",
        "Don't roll the shoulders forward — focus on the chest squeeze",
      ],
    },
  },

  "케이블 크로스오버 (Cable Crossover)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "팔꿈치 살짝 굽힌 채 고정 — 컬 동작 X, 곧은 호 그리듯 움직여요",
        "양손을 가슴 앞으로 모으기 — 마지막에 \"X자\" 교차 가능 (가슴 안쪽 자극)",
        "한 발 앞으로 + 살짝 앞으로 기울기 — 가슴 위쪽 자극",
        "내릴 때 천천히 — 양팔 옆으로 벌어지는 동작도 통제",
        "복근에 힘 — 허리가 흔들리면 가슴 자극 분산",
      ],
      en: [
        "Lock elbows softly bent — no curling motion, sweep in a clean arc",
        "Bring hands together in front of the chest — can cross at the bottom for inner-chest squeeze",
        "One foot forward, slight lean forward — emphasizes upper chest",
        "Slow on the way back — control as the arms separate to the sides",
        "Brace the core — torso wobble dilutes chest stimulus",
      ],
    },
  },

  // ══════════════════════════════════
  // ── 다리 (LEGS - Cable Accessory) ──
  // ══════════════════════════════════
  "케이블 풀 스루 (Cable Pull-Through)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "엉덩이를 뒤로 빼는 \"힙 힌지\" 동작 — 무릎은 살짝만 굽히기",
        "허리 곧게 유지 — 등이 둥글면 허리 다침",
        "올라올 때 엉덩이를 앞으로 차내듯 — 골반 으로 미는 느낌",
        "정점에서 엉덩이 \"짜내기\" 1초 — 절대 허리로 꺾어 더 가지 않기",
        "처음이면 가벼운 무게 — 힙 힌지 패턴 익히기 우선",
      ],
      en: [
        "Hinge at the hips — knees only soft, push hips back",
        "Keep the back straight — rounding hurts the lower back",
        "Drive up by pushing the hips forward — pelvis pushes the rope through",
        "1-second glute squeeze at the top — never hyperextend the lower back",
        "Start light — learn the hip-hinge pattern first",
      ],
    },
  },

  // ══════════════════════════════════
  // ── 어깨 (Cable Accessory) ──
  // ══════════════════════════════════
  "케이블 레터럴 레이즈 (Cable Lateral Raises)": {
    source: "ACSM Guidelines 11th ch.7",
    cues: {
      ko: [
        "팔꿈치 살짝 굽힌 채 고정 — 컬처럼 굽혔다 펴지 않게",
        "올릴 때 손이 어깨 높이까지만 — 더 올리면 승모근 자극",
        "팔꿈치가 손보다 살짝 위로 — 새끼손가락이 살짝 위 향하는 느낌",
        "내릴 때도 천천히 — 케이블 저항 끝까지 받기",
        "처음이면 매우 가벼운 무게 — 어깨는 작은 근육이라 부상 위험",
      ],
      en: [
        "Lock the elbow softly bent — no curling motion",
        "Raise only to shoulder height — higher engages the traps",
        "Elbow leads slightly above the hand — pinky tilted slightly up",
        "Lower slowly — let the cable resist through the full range",
        "Start very light — shoulders are small muscles, easy to injure",
      ],
    },
  },

  // ══════════════════════════════════
  // ── 등 (PULL - Cable Accessory) ──
  // ══════════════════════════════════
  "시티드 로우 (Seated Cable Row)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "허리는 곧게 — 너무 뒤로 누워서 당기면 등이 아닌 허리가 일해요",
        "발 위치 — 발판 가운데, 무릎 살짝 굽힘",
        "당길 때 손잡이를 배꼽 쪽으로 — 어깨를 뒤로 살짝 모으는 느낌",
        "팔꿈치를 몸통 가까이 — 너무 벌어지면 어깨 운동이 됨",
        "내릴 때도 천천히 — 케이블 저항을 끝까지 받아주기",
      ],
      en: [
        "Keep the back straight — leaning too far back makes the lower back work, not the upper back",
        "Foot position — center of platform, knees slightly bent",
        "Pull the handle to the belly button — squeeze the shoulder blades slightly back",
        "Keep elbows close to the torso — flaring out shifts to shoulders",
        "Release slowly — let the cable resist all the way",
      ],
    },
  },

  "케이블 로우 (Cable Row)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "허리 곧게 + 약간 앞으로 기울인 자세 (시티드처럼) — 등이 둥글지 않게",
        "당길 때 손잡이를 명치/배꼽 사이로 — 등 가운데 짜내기",
        "팔꿈치를 몸통 가까이 — 어깨 으쓱 X",
        "내릴 때도 천천히 — 케이블 저항 끝까지 받아주기",
        "처음이면 시티드 케이블 로우(고정 머신)부터 익히고 진행 추천",
      ],
      en: [
        "Keep the back straight, slightly leaning forward (similar to seated) — never round",
        "Pull the handle to between sternum and belly button — squeeze mid-back",
        "Keep elbows close to the torso — no shrugging",
        "Slow release — let the cable resist all the way",
        "If new, learn on a fixed Seated Cable Row machine first",
      ],
    },
  },

  "케이블 페이스 풀 (Cable Face Pulls)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "당길 때 양손이 얼굴 양옆으로 (코·관자놀이 라인) — 가슴 쪽으로 당기면 다른 운동",
        "팔꿈치는 어깨와 같은 높이 또는 살짝 위 — 처지면 효과 감소",
        "마지막에 어깨를 뒤로 살짝 모으기 — 후면 어깨/회전근개 짜이는 느낌",
        "허리가 뒤로 꺾이지 않게 — 코어 brace",
        "가벼운 무게 + 천천히 — 어깨 안정 운동이라 컨트롤이 핵심",
      ],
      en: [
        "Pull until hands flank the face (along temple line) — pulling to chest is a different exercise",
        "Elbows at or slightly above shoulder height — drooping reduces effect",
        "At the end, squeeze the shoulders slightly back — feel the rear delts/rotator cuff",
        "Don't lean back — brace the core",
        "Light weight + slow — control is the key for this stability exercise",
      ],
    },
  },

  // ══════════════════════════════════
  // ── 코어 (CABLE - Accessory) ──
  // ══════════════════════════════════
  "케이블 우드찹 (Cable Woodchop)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "회전축은 척추(허리) — 무릎이나 골반으로 회전하지 않게",
        "팔은 거의 곧게 펴진 상태 유지 — 팔로 끌어오는 게 아님",
        "내려올 때 무릎 바깥쪽까지 대각선 — 시선도 손 따라가기",
        "복근/사선근(옆구리)이 일하는 느낌 — 가슴이나 어깨가 아닌 코어",
        "처음이면 가벼운 무게 — 회전 패턴 통제 후 무게 증가",
      ],
      en: [
        "Rotation axis is the spine — don't twist the knees or hips",
        "Arms stay nearly straight — don't pull with the arms",
        "Diagonal down to the outside of the opposite knee — eyes follow the hands",
        "Feel the abs/obliques work — not the chest or shoulders",
        "Start light — master rotation control before adding weight",
      ],
    },
  },

  "케이블 크런치 (Cable Crunch)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "엉덩이는 그대로 — 척추(복근)만 둥글게 말리는 \"크런치\"",
        "손은 머리 옆에 고정 — 팔로 끌어오면 팔 운동이 됨",
        "내려갈 때 가슴이 무릎 쪽으로 가까워지듯 — 복근 짜이는 느낌",
        "올라올 때(되돌리기) 천천히 — 케이블 저항을 끝까지 받기",
        "허리가 펴진 채로 굽히지 않게 — 척추가 아닌 고관절로 굽으면 효과 X",
      ],
      en: [
        "Hips stay put — only the spine (abs) curls forward",
        "Hands locked at the sides of the head — pulling with arms makes it an arm exercise",
        "Bring chest toward the knees — feel the abs squeeze",
        "Slow on return — let the cable resist all the way",
        "Curl the spine, not the hips — bending at the hip joint defeats the purpose",
      ],
    },
  },

  // ══════════════════════════════════
  // ── BATCH 1 (회의 2026-04-29): 바벨/덤벨 변형 15종 추가 ──
  // ══════════════════════════════════

  "인클라인 바벨 프레스 (Incline Barbell Press)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "각도 30-45도 — 너무 세우면 어깨 운동",
        "바벨 코스 — 가슴 위쪽(쇄골 아래)으로 부드럽게 내리기",
        "팔꿈치 약 45도 (몸통과) — 어깨 보호",
        "발은 바닥에 단단히, 등은 등받이에 \"고정\"",
        "올릴 때 가슴 위쪽이 \"짜이는\" 느낌이 정확한 자극",
      ],
      en: [
        "Angle 30-45° — too steep becomes shoulder",
        "Bar path — lower to upper chest (just below collarbone)",
        "Elbows ~45° from torso — shoulder protection",
        "Feet firmly planted, back \"glued\" to the backrest",
        "Squeeze in upper chest at the top — that's the right feel",
      ],
    },
  },

  "디클라인 벤치 프레스 (Decline Bench Press)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "발 고정 패드(롤러)에 발등 단단히 — 미끄러지면 위험",
        "바벨 코스 — 가슴 아래쪽으로 부드럽게",
        "팔꿈치 약 45도 — 평벤치보다 살짝 좁게도 OK",
        "머리가 아래라 어지러울 수 있음 — 호흡 안정 후 시작",
        "바벨이 떨어지지 않게 손목 직각 + 엄지 꼭 감싸기",
      ],
      en: [
        "Lock feet under the rollers — slipping is dangerous",
        "Bar path — lower to lower chest",
        "Elbows ~45° (slightly narrower than flat is OK)",
        "Head-down may cause dizziness — settle breathing first",
        "Wrists at right angle + thumb wrapped to prevent dropping the bar",
      ],
    },
  },

  "스미스 머신 벤치 프레스 (Smith Machine Bench Press)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "벤치를 머신 안 정중앙에 배치 — 바벨이 가슴 중앙으로 떨어지게",
        "그립 너비 — 어깨너비 살짝 넓게",
        "바벨이 레일 따라 직선만 움직임 — 자유 바벨보다 \"길\" 결정 X",
        "끝나면 바벨 \"돌려서\" 후크에 걸기 — 잠금 확인 필수",
        "처음이면 가벼운 무게로 후크 동작 익히기 — 잠금 안 되면 위험",
      ],
      en: [
        "Center the bench inside the machine — bar should drop over the middle of your chest",
        "Grip — slightly wider than shoulders",
        "Bar moves only along the rails — no path choice (unlike free bar)",
        "Rotate the bar to lock back into hooks at the end — confirm the lock",
        "Start light to get used to the hook mechanism — failure to lock is dangerous",
      ],
    },
  },

  "프론트 스쿼트 (Front Squat)": {
    source: "Starting Strength 3rd Ed. + NSCA Essentials",
    cues: {
      ko: [
        "바벨 위치 — 어깨 앞 쇄골 위, 팔꿈치 높이 들기 (\"선반\")",
        "발은 어깨너비, 발끝 약 15도 바깥",
        "내려갈 때 상체 거의 수직 유지 (백 스쿼트보다 더 곧게)",
        "팔꿈치가 떨어지면 바벨이 앞으로 굴러 — 항상 위로 들기",
        "허벅지 평행 이상까지 내려가기 (가동 범위 안에서)",
      ],
      en: [
        "Bar position — front shoulders over collarbone, elbows up high (\"shelf\")",
        "Feet shoulder-width, toes ~15° out",
        "Keep torso nearly vertical on the descent (more upright than back squat)",
        "If elbows drop, the bar rolls forward — keep them up",
        "Squat at least to thighs parallel (within your range)",
      ],
    },
  },

  "루마니안 데드리프트 (Romanian Deadlift)": {
    source: "Starting Strength 3rd Ed. + NSCA Essentials",
    cues: {
      ko: [
        "다리는 거의 곧게 (살짝만 굽힘) — 무릎 굽혀 내리는 게 아님",
        "엉덩이를 뒤로 밀어내며 hinge — 뒤쪽 벽을 미는 느낌",
        "허리 곧게 — 등이 둥글면 즉시 멈추기",
        "바벨이 다리 앞면을 따라 천천히 — 멀어지지 않게",
        "햄스트링이 \"늘어남\"을 느낄 때까지 — 그 이상 깊이 X",
      ],
      en: [
        "Legs almost straight (only soft knees) — don't squat down",
        "Push the hips back to hinge — like pushing a wall behind you",
        "Back straight — stop immediately if it rounds",
        "Bar slides slowly along the front of the legs — never pull away",
        "Stop when hamstrings stretch — don't go further",
      ],
    },
  },

  "스모 데드리프트 (Sumo Deadlift)": {
    source: "Starting Strength 3rd Ed. + NSCA Essentials",
    cues: {
      ko: [
        "발 위치 — 어깨너비 1.5~2배, 발끝 약 30-45도 바깥",
        "그립 — 다리 안쪽으로 들어가서 어깨너비",
        "내릴 때 무릎이 발끝 방향으로 \"열림\" — 안쪽으로 무너지면 안 됨",
        "정강이 거의 수직 + 등 곧게 — 허리 둥글면 멈춤",
        "올라올 때 엉덩이로 밀고 — 무릎과 엉덩이 동시 펴짐",
      ],
      en: [
        "Feet — 1.5-2× shoulder width, toes ~30-45° out",
        "Grip — hands inside the legs, shoulder-width",
        "Knees track outward toward the toes — don't collapse inward",
        "Shins nearly vertical + back straight — stop if back rounds",
        "Drive up by pushing the hips — knees and hips extend together",
      ],
    },
  },

  "밀리터리 프레스 (Military Press)": {
    source: "Starting Strength 3rd Ed.",
    cues: {
      ko: [
        "발 모음(\"차렷\") — 균형 어렵지만 코어 더 일함",
        "그립 너비 — 어깨너비 살짝 넓게, 손목 직각",
        "올릴 때 다리 반동 절대 X — 순수 어깨 힘",
        "복근에 힘 — 허리 뒤로 꺾이지 않게",
        "끝낼 때 머리 바로 위 — 어깨 위치까지 정렬",
      ],
      en: [
        "Feet together (\"attention\") — balance harder, core works more",
        "Grip — slightly wider than shoulders, wrists straight",
        "No leg drive — pure shoulder strength",
        "Brace the core — don't let the back arch backward",
        "At lockout, the bar is directly over the head — aligned with shoulders",
      ],
    },
  },

  "펜들레이 로우 (Pendlay Row)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "허리 곧게 + 거의 90도 굽힌 자세 (등이 바닥과 거의 평행)",
        "그립 너비 — 어깨너비, 오버그립",
        "당길 때 명치(가슴 아래) 쪽으로 — 폭발적으로",
        "매 렙 후 바닥에 \"리셋\" — 반동 없이 매번 처음부터",
        "처음이면 바벨 로우보다 가벼운 무게 — 폼이 더 어려워요",
      ],
      en: [
        "Back straight, bent ~90° (back nearly parallel to the floor)",
        "Grip — shoulder-width, overhand",
        "Pull explosively to the sternum",
        "\"Reset\" on the floor between every rep — no momentum",
        "Start lighter than Barbell Row — form is more demanding",
      ],
    },
  },

  "티바 로우 (T-Bar Row)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "발은 바벨 양옆에 어깨너비",
        "허리 곧게 + 약 45도 굽힘",
        "당길 때 손잡이를 가슴/배꼽 사이로 — 팔꿈치 뒤로",
        "회전축이 고정이라 — 자연스럽게 \"호\" 그리며 당겨짐",
        "체스트 패드가 있으면 사용 — 허리 부담 ↓",
      ],
      en: [
        "Feet straddle the bar at shoulder width",
        "Back straight, bent ~45°",
        "Pull the handle between sternum and belly — drive the elbows back",
        "Pivot is fixed — the bar naturally arcs as you pull",
        "Use the chest pad if available — reduces lower-back load",
      ],
    },
  },

  "덤벨 로우 (Dumbbell Row)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "벤치 받침 — 한 손/한 무릎 (3점 지지)",
        "허리 곧게 — 등이 바닥과 거의 평행",
        "당길 때 팔꿈치를 천장 쪽으로 — 명치/배꼽 사이로",
        "어깨 으쓱하지 않게 — 등이 일하도록",
        "처음이면 가벼운 무게 — 비대칭이라 회전 보상 위험",
      ],
      en: [
        "Bench support — one hand and one knee (3-point base)",
        "Back straight — nearly parallel to the floor",
        "Pull the elbow toward the ceiling — toward sternum/belly",
        "Don't shrug — let the back work",
        "Start light — asymmetric, easy to compensate with rotation",
      ],
    },
  },

  "싱글 암 덤벨 로우 (Single Arm Dumbbell Row)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "덤벨 로우와 동일 — 한 손씩 강조",
        "당길 때 한쪽 등이 짜이는 느낌 — 좌우 따로 의식",
        "팔꿈치를 천장 쪽으로 — 명치/배꼽 사이로",
        "허리 곧게 + 등 평행",
        "약 1초 정점에서 짜내고 천천히 내리기",
      ],
      en: [
        "Same as Dumbbell Row — emphasize one side at a time",
        "Feel one side of the back contract — focus per side",
        "Pull elbow up toward the ceiling — to between sternum and belly",
        "Back straight, parallel to the floor",
        "1-second squeeze at the top, slow on the way down",
      ],
    },
  },

  "덤벨 컬 (Dumbbell Curl)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "팔꿈치 옆구리 \"붙여\" 고정 — 절대 앞뒤로 안 움직이게",
        "올릴 때 손목 자연스럽게 회전 (\"수파인\") — 정점에서 손바닥이 천장",
        "내릴 때도 천천히 — 컨트롤이 핵심",
        "한 번에 양손 또는 번갈아 — 어떻게든 좌우 같은 무게",
        "어깨가 앞으로 빠지지 않게 — 어깨 으쓱 X",
      ],
      en: [
        "Glue elbows to the sides — never swing forward/back",
        "Rotate wrists on the way up (\"supination\") — palm faces the ceiling at the top",
        "Lower slowly — control is key",
        "Both arms together or alternating — match weight on both sides",
        "Don't roll the shoulders forward — no shrugging",
      ],
    },
  },

  "인클라인 덤벨 컬 (Incline Dumbbell Curl)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "벤치 각도 45-60도",
        "팔꿈치는 어깨 뒤쪽에 \"매달려\" 있는 위치 — 움직이지 않게",
        "내릴 때 팔이 완전히 펴진 뒤 1초 \"늘어남\" — 정점은 길어짐",
        "올릴 때 손목 회전 — 정점에서 손바닥 천장",
        "처음이면 매우 가벼운 무게 — 누운 자세에서 의외로 무거워요",
      ],
      en: [
        "Bench angle 45-60°",
        "Elbows hang behind the body — keep them fixed",
        "At the bottom, fully extend arms and pause 1s (\"stretch\") — the lengthened position is the peak",
        "Rotate wrists on the way up — palm faces the ceiling at the top",
        "Start very light — heavier than expected when lying back",
      ],
    },
  },

  "덤벨 숄더 프레스 (Seated Dumbbell Press)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "벤치 등받이 거의 수직 — 너무 누우면 가슴 운동",
        "그립 — 손목 직각, 손바닥이 앞쪽 향함",
        "올릴 때 양손이 머리 위에서 살짝 모이는 느낌 (\"A자\")",
        "내릴 때 어깨 옆 약 90도까지 — 너무 깊이 X",
        "코어 안정 — 등받이가 받쳐주지만 복근 brace 유지",
      ],
      en: [
        "Backrest near-vertical — too flat becomes a chest exercise",
        "Grip — wrists straight, palms facing forward",
        "On the way up, hands gather slightly inward (\"A-shape\") above the head",
        "Lower until elbows ~90° beside the shoulders — don't go deeper",
        "Core stable — backrest helps, but keep the abs braced",
      ],
    },
  },

  "인클라인 덤벨 플라이 (Incline Dumbbell Fly)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "각도 30-45도",
        "팔꿈치 살짝 굽힌 채 고정 — 컬처럼 굽혔다 펴지 않게",
        "내릴 때 양옆으로 호 그리듯 — 가슴 위쪽 \"늘어남\" 느낌",
        "너무 깊이 가지 않게 — 어깨 부담",
        "올릴 때 가슴 위쪽이 \"짜내지는\" 느낌 — 양손이 가슴 위에서 만나기 직전까지",
      ],
      en: [
        "Angle 30-45°",
        "Lock elbows softly bent — no curling motion",
        "Sweep arms outward in an arc — feel the upper-chest stretch",
        "Don't go too deep — shoulder strain risk",
        "Squeeze the upper chest on the way up — hands almost meet at the top",
      ],
    },
  },
};

export function getFormCues(exerciseName: string, locale: Locale): string[] {
  const set = EXERCISE_FORM_CUES[exerciseName];
  if (!set) return [];
  return locale === "en" ? set.cues.en : set.cues.ko;
}

export function getFormCueSource(exerciseName: string): string | undefined {
  return EXERCISE_FORM_CUES[exerciseName]?.source;
}
