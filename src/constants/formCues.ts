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

  // ══════════════════════════════════
  // ── BATCH 2 (회의 2026-04-29): 머신/케틀벨/TRX/풀업 변형 25종 ──
  // ══════════════════════════════════

  "체스트 프레스 머신 (Chest Press Machine)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "좌석 높이 — 손잡이 가슴 중앙",
        "등 등받이 \"고정\" + 어깨 으쓱 X",
        "팔꿈치 약 45도 — 어깨 보호",
        "끝까지 펴지 말고 잠그지 않기",
        "내릴 때 천천히 — 정점 1초",
      ],
      en: [
        "Seat height — handles at mid-chest",
        "Back glued to backrest + no shrugging",
        "Elbows ~45° — shoulder protection",
        "Don't fully lock the elbows",
        "Lower slowly + 1-second peak",
      ],
    },
  },

  "펙덱 플라이 (Pec Deck Fly)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "팔꿈치 살짝 굽혀서 고정 — 컬 동작 X",
        "양 팔/팔꿈치 가운데로 호 그리며 모으기",
        "정점에서 1초 가슴 안쪽 짜내기",
        "어깨 으쓱하지 않게",
        "내릴 때 가슴 늘어남 끝까지",
      ],
      en: [
        "Lock elbows softly bent — no curling motion",
        "Arms/elbows sweep to the center in an arc",
        "1-second inner-chest squeeze at the center",
        "Don't shrug",
        "Full chest stretch on the way back",
      ],
    },
  },

  "레그 익스텐션 (Leg Extension)": {
    source: "ACSM Guidelines 11th ch.7",
    cues: {
      ko: [
        "무릎이 머신 회전축과 같은 선",
        "엉덩이 좌석에 단단히 — 들리지 않게",
        "올릴 때 무릎 끝까지 펴지 말기 (마지막 5도 남기기)",
        "정점 1초 — 대퇴사두 짜내기",
        "내릴 때 천천히 — 떨어뜨리듯 X",
      ],
      en: [
        "Knees aligned with machine pivot axis",
        "Hips planted on the seat — don't lift",
        "Don't fully lock the knees (leave last 5°)",
        "1-second peak — quad squeeze",
        "Lower slowly — no dropping",
      ],
    },
  },

  "레그 컬 (Leg Curl)": {
    source: "ACSM Guidelines 11th ch.7",
    cues: {
      ko: [
        "패드 — 발목 뒤(아킬레스 살짝 위)",
        "엎드린 형태면 엉덩이 들리지 않게",
        "당길 때 햄스트링 \"짜이는\" 느낌",
        "끝까지 굽히고 정점 1초",
        "내릴 때 천천히",
      ],
      en: [
        "Pad behind the ankle (just above the Achilles)",
        "On prone version, don't lift the hips",
        "Feel the hamstrings \"squeeze\" on the curl",
        "Full flexion + 1-second peak",
        "Lower slowly",
      ],
    },
  },

  "핵 스쿼트 (Hack Squat)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "어깨 패드 단단히 + 발 어깨너비",
        "발끝 약 15도 바깥, 무릎이 발끝 방향",
        "허벅지 평행 또는 살짝 더 깊게",
        "올릴 때 무릎 완전히 펴지 말기",
        "허리는 등받이에 \"붙여\" 고정",
      ],
      en: [
        "Shoulders firmly under the yoke + feet shoulder-width",
        "Toes ~15° out, knees track in line with toes",
        "Thighs parallel or slightly deeper",
        "Don't fully lock the knees at the top",
        "Lower back \"glued\" to backrest",
      ],
    },
  },

  "힙 어덕션 머신 (Hip Adduction Machine)": {
    source: "ACSM Guidelines 11th ch.7",
    cues: {
      ko: [
        "패드 — 무릎 안쪽에 닿게",
        "엉덩이 좌석/등 등받이 단단히",
        "양 무릎 천천히 모으기 — 반동 X",
        "정점 1초 \"짜내기\"",
        "처음이면 가벼운 무게 — 사타구니 부담",
      ],
      en: [
        "Pads on the inside of the knees",
        "Hips on seat + back on backrest firmly",
        "Squeeze knees together slowly — no momentum",
        "1-second center squeeze",
        "Start light — groin strain risk",
      ],
    },
  },

  "힙 어브덕션 머신 (Hip Abduction Machine)": {
    source: "ACSM Guidelines 11th ch.7",
    cues: {
      ko: [
        "패드 — 무릎 바깥에 닿게",
        "엉덩이/등 단단히 고정",
        "양 무릎 천천히 벌리기 — 반동 X",
        "정점 1초 \"짜내기\" — 엉덩이 옆 자극",
        "좌석에서 들썩이지 않게",
      ],
      en: [
        "Pads on the outside of the knees",
        "Hips/back firmly anchored",
        "Open knees outward slowly — no momentum",
        "1-second top squeeze — feel the outer hip",
        "Don't bounce on the seat",
      ],
    },
  },

  "백익스텐션 머신 (Back Extension Machine)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "패드 — 골반 위 허벅지 윗부분 (배 압박 X)",
        "엉덩이로 hinge — 허리 둥글지 않게",
        "올라올 때 척추 직선까지만 — 뒤로 꺾지 않기",
        "처음이면 맨몸 — 무게 들면 부담",
        "내릴 때 천천히",
      ],
      en: [
        "Pad at upper thighs / hip crease (not pressing the belly)",
        "Hinge at the hips — back stays flat",
        "Rise only to a straight line — don't hyperextend",
        "Start with bodyweight — adding weight stresses the back",
        "Lower slowly",
      ],
    },
  },

  "인버티드 로우 (Inverted Row)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "몸 곧게 — 머리부터 발끝까지 일직선",
        "그립 어깨너비 살짝 넓게, 오버그립",
        "당길 때 가슴이 봉으로 — 어깨 뒤로",
        "복근 brace + 엉덩이 처지지 않게",
        "발 위치로 강도 조절 — 멀수록 어려움",
      ],
      en: [
        "Body straight — head to feet in one line",
        "Grip slightly wider than shoulders, overhand",
        "Pull until chest meets the bar — squeeze shoulders back",
        "Brace the core + hips don't sag",
        "Feet farther = harder",
      ],
    },
  },

  "어시스티드 풀업 (Assisted Pull-ups)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "그립 — 어깨너비 살짝 넓게, 오버그립",
        "어깨 \"고정\" 후 당기기",
        "당길 때 가슴이 봉으로",
        "내릴 때도 천천히 — 케이블 같은 일정 저항",
        "어시스트 무게 점진적 감소",
      ],
      en: [
        "Grip — slightly wider than shoulders, overhand",
        "Pack the shoulders before pulling",
        "Pull until chest meets the bar",
        "Lower slowly — constant resistance",
        "Reduce assist over time",
      ],
    },
  },

  "친업 (Chin-ups)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "그립 — 어깨너비, 언더그립 (손바닥 본인 쪽)",
        "어깨 \"고정\" 후 당기기",
        "턱이 봉을 살짝 지나가는 느낌",
        "이두 활약 — 풀업보다 살짝 쉬워요",
        "내릴 때도 천천히",
      ],
      en: [
        "Grip — shoulder-width, underhand (palms toward you)",
        "Pack the shoulders before pulling",
        "Chin passes slightly above the bar",
        "More biceps — slightly easier than pull-ups",
        "Lower slowly",
      ],
    },
  },

  "중량 풀업 (Weighted Pull-ups)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "맨몸 풀업 5~10개 안정 후 진입",
        "벨트/조끼 단단히 — 흔들림 위험",
        "처음 무게 가볍게 (2.5~5kg)",
        "맨몸과 동일 폼 — 무게가 폼 깨면 줄이기",
        "내릴 때 더 천천히 — 어깨/팔꿈치 부담 ↑",
      ],
      en: [
        "Progress here only after 5-10 strict bodyweight pull-ups",
        "Belt/vest secured firmly — swaying is risky",
        "Start light (2.5-5 kg)",
        "Same form as bodyweight — reduce if form breaks",
        "Lower more slowly — extra stress on shoulders/elbows",
      ],
    },
  },

  "케틀벨 스윙 (Kettlebell Swing)": {
    source: "Pavel Tsatsouline, Hardstyle Kettlebell + NSCA Essentials",
    cues: {
      ko: [
        "엉덩이로 폭발적으로 차내기 — 팔로 들지 X",
        "스윙 정점 어깨 높이까지만 — 더 높으면 허리 부담",
        "허리 곧게 + 엉덩이 뒤로 hinge — 무릎 살짝만",
        "케틀벨 다리 사이로 통과할 때 정강이 가깝게",
        "정점에서 \"짜내기\" — 엉덩이/코어/대둔근 동시 수축",
      ],
      en: [
        "Drive the hips explosively — don't lift with arms",
        "Peak at shoulder height — higher stresses the back",
        "Back straight + hips hinged — only soft knees",
        "Kettlebell passes close to the shins between legs",
        "At the top: squeeze hips/core/glutes together",
      ],
    },
  },

  "케틀벨 고블릿 스쿼트 (Kettlebell Goblet Squat)": {
    source: "Dan John, Goblet Squat + NSCA Essentials",
    cues: {
      ko: [
        "케틀벨을 가슴 앞 \"잔\" 자세 — 손잡이 양쪽 \"뿔\" 잡기",
        "발 어깨너비 살짝 넓게, 발끝 약 15도 바깥",
        "허벅지 평행까지, 무릎 발끝 방향",
        "상체 거의 수직 — 무게가 앞이라 자연스럽게 곧음",
        "팔꿈치가 무릎 안쪽 닿는 느낌까지 깊이 OK",
      ],
      en: [
        "Hold kettlebell at chest by the \"horns\" (goblet position)",
        "Feet slightly wider than shoulders, toes ~15° out",
        "Squat to thighs parallel, knees track over toes",
        "Torso nearly vertical — front-load keeps it upright",
        "Elbows touching insides of knees is OK if mobility allows",
      ],
    },
  },

  "케틀벨 데드리프트 (Kettlebell Deadlift)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "케틀벨 발 사이 중앙",
        "허리 곧게 + 엉덩이 뒤로 — 정강이 거의 수직",
        "다리로 바닥 미는 느낌으로 일어남",
        "올라온 정점에서 엉덩이 짜내기 — 1초",
        "내릴 때도 동일 폼 — 둥글지 않게",
      ],
      en: [
        "Kettlebell centered between feet",
        "Back straight + hips back — shins nearly vertical",
        "Drive up by pushing the floor with the legs",
        "Glute squeeze at the top — 1 second",
        "Lower with same form — don't round",
      ],
    },
  },

  "케틀벨 로우 (Kettlebell Row)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "벤치/무릎 받침 — 한 손/한 무릎",
        "허리 곧게 + 등 평행",
        "당길 때 팔꿈치를 천장 쪽으로",
        "정점 1초 등 짜내기",
        "처음이면 가벼운 케틀벨",
      ],
      en: [
        "Bench/knee support — one hand and one knee",
        "Back straight + parallel to floor",
        "Pull elbow toward the ceiling",
        "1-second back squeeze at the top",
        "Start light",
      ],
    },
  },

  "케틀벨 오버헤드 프레스 (Kettlebell Overhead Press)": {
    source: "Pavel Tsatsouline + NSCA Essentials",
    cues: {
      ko: [
        "랙 포지션 — 손목 직각, 손바닥 안쪽",
        "올릴 때 손목 자연스럽게 회전 (외전) — 정점 손바닥 앞",
        "팔꿈치 잠그고 머리 위 정렬",
        "발 어깨너비, 코어 brace — 허리 꺾이지 않게",
        "한쪽씩 — 좌우 균형",
      ],
      en: [
        "Rack position — wrists straight, palm in",
        "Rotate the wrist on the way up — palm faces forward at the top",
        "Lock elbow + bar overhead aligned",
        "Feet shoulder-width, core braced — no back arch",
        "One arm at a time — balance",
      ],
    },
  },

  "더블 케틀벨 프론트 스쿼트 (Double Kettlebell Front Squat)": {
    source: "Pavel Tsatsouline + NSCA Essentials",
    cues: {
      ko: [
        "양 케틀벨 랙 포지션 — 손잡이 어깨 앞",
        "팔꿈치 살짝 들어 \"선반\"",
        "내려갈 때 상체 수직 유지 — 프론트 스쿼트와 동일",
        "허벅지 평행 또는 살짝 더 깊게",
        "올라올 때 엉덩이/다리 동시 펴짐",
      ],
      en: [
        "Both kettlebells in rack — handles at shoulder front",
        "Elbows slightly raised for \"shelf\"",
        "Torso vertical on the descent — same as Front Squat",
        "Thighs parallel or slightly deeper",
        "Hips/legs extend together on the way up",
      ],
    },
  },

  "TRX 로우 (TRX Row)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "몸 곧게 — 머리부터 발끝까지 일직선",
        "그립 중립 (손바닥 마주 보기)",
        "당길 때 어깨 뒤로 모으기 — 등이 일하도록",
        "엉덩이/허리 처지지 않게 brace",
        "발 위치로 강도 조절 — 멀수록 쉬움",
      ],
      en: [
        "Body straight — head to feet in one line",
        "Neutral grip (palms facing each other)",
        "Pull and squeeze shoulders back — let the back work",
        "Brace hips/back — no sag",
        "Foot position controls intensity — farther = easier",
      ],
    },
  },

  "TRX 바이셉스 컬 (TRX Biceps Curl)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "그립 언더 (손바닥 본인 쪽)",
        "팔꿈치 어깨 앞 \"고정\" — 절대 떨어뜨리지 않게",
        "당길 때 손이 머리 쪽으로",
        "정점 1초 + 천천히 내림",
        "발 멀수록 쉬움",
      ],
      en: [
        "Underhand grip (palms facing you)",
        "Lock elbows at shoulder front — never drop",
        "Pull hands toward the head",
        "1-second peak + slow descent",
        "Feet farther = easier",
      ],
    },
  },

  "행잉 레그 레이즈 (Hanging Leg Raise)": {
    source: "ACSM Guidelines 11th ch.7",
    cues: {
      ko: [
        "그립 어깨너비 + 어깨 \"고정\"",
        "다리 들어올릴 때 골반 살짝 말기 — 복근 짜내는 느낌",
        "정점 — 다리가 가슴 옆/봉 높이",
        "내릴 때 천천히 — 흔들리지 않게",
        "처음이면 행잉 니 레이즈부터",
      ],
      en: [
        "Grip shoulder-width + pack the shoulders",
        "Tuck the pelvis slightly on the lift — feel the abs squeeze",
        "Peak — legs at chest level / bar height",
        "Lower slowly — no swinging",
        "Start with Knee Raise",
      ],
    },
  },

  "행잉 니 레이즈 (Hanging Knee Raise)": {
    source: "ACSM Guidelines 11th ch.7",
    cues: {
      ko: [
        "그립 어깨너비 + 어깨 \"고정\"",
        "무릎을 가슴 쪽으로 — 골반 살짝 말기",
        "정점 1초",
        "내릴 때 천천히 — 흔들림 X",
        "행잉 레그 레이즈 입문 변형",
      ],
      en: [
        "Grip shoulder-width + pack the shoulders",
        "Knees toward the chest — slight pelvic tuck",
        "1-second peak",
        "Lower slowly — no swinging",
        "Beginner variation of Hanging Leg Raise",
      ],
    },
  },

  "스탠딩 카프 레이즈 (Standing Calf Raises)": {
    source: "ACSM Guidelines 11th ch.7",
    cues: {
      ko: [
        "발끝 받침대 위, 뒤꿈치 자유롭게 깊이 내림",
        "올릴 때 발끝 끝까지 — 정점 1초",
        "내릴 때 천천히 — 종아리 늘어남 끝까지",
        "어깨 패드는 어깨로 받음 (목 X)",
        "무릎은 펴진 상태 (시티드와 차이)",
      ],
      en: [
        "Toes on the platform, heels drop deep",
        "Rise to the toes + 1-second peak",
        "Lower slowly — full calf stretch",
        "Shoulder pads on shoulders (not the neck)",
        "Knees stay extended (vs. seated)",
      ],
    },
  },

  "시티드 카프 레이즈 (Seated Calf Raises)": {
    source: "ACSM Guidelines 11th ch.7",
    cues: {
      ko: [
        "패드 — 무릎 바로 위",
        "발끝 받침대, 뒤꿈치 자유",
        "올릴 때 발끝 끝까지 + 정점 1초",
        "내릴 때 천천히 — 솔레우스 늘어남",
        "솔레우스 작은 근육 — 무리하지 말기",
      ],
      en: [
        "Pad directly over the knees",
        "Toes on platform, heels free",
        "Rise to the toes + 1-second peak",
        "Lower slowly — soleus stretch",
        "Soleus is small — don't overload",
      ],
    },
  },

  "동키 카프 레이즈 (Donkey Calf Raises)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "허리 굽힌 자세 + 등 곧게",
        "발끝 끝까지 + 정점 1초",
        "내릴 때 천천히 — 종아리 늘어남 충분히",
        "허리 둥글면 멈춤 — 부담",
        "전용 머신 없으면 다른 카프 변형으로 대체",
      ],
      en: [
        "Bent-over posture + back straight",
        "Rise to the toes + 1-second peak",
        "Lower slowly — full calf stretch",
        "Stop if back rounds — strain risk",
        "Substitute another calf variation if no machine",
      ],
    },
  },

  // ══════════════════════════════════
  // ── BATCH 3 (회의 2026-04-29): 잡다 25종 ──
  // ══════════════════════════════════

  "바벨 컬 (Barbell Curl)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "그립 어깨너비, 언더그립",
        "팔꿈치 옆구리 \"고정\"",
        "올릴 때 손목 직각",
        "내릴 때 천천히",
        "EZ바면 손목 부담 ↓",
      ],
      en: [
        "Grip shoulder-width, underhand",
        "Glue elbows to sides",
        "Wrists straight on the way up",
        "Lower slowly",
        "EZ bar reduces wrist strain",
      ],
    },
  },

  "바벨 슈러그 (Barbell Shrug)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "그립 어깨너비, 오버그립",
        "팔 곧게 — 컬 X",
        "어깨를 귀로 \"으쓱\" — 회전 X",
        "정점 1초 + 천천히",
        "가벼운 무게부터",
      ],
      en: [
        "Grip shoulder-width, overhand",
        "Arms straight — no curling",
        "Shrug to ears — no rolling",
        "1-second peak + slow",
        "Start light",
      ],
    },
  },

  "랙 풀 (Rack Pull)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "핀 높이 — 무릎/허벅지",
        "허리 곧게 + 가슴 들고",
        "그립 어깨너비, 오버그립",
        "다리로 미는 느낌",
        "내릴 때 핀 위 \"리셋\"",
      ],
      en: [
        "Pin at knee/thigh",
        "Back straight + chest up",
        "Grip shoulder-width, overhand",
        "Drive with the legs",
        "Reset on pins between reps",
      ],
    },
  },

  "바벨 힙 쓰러스트 (Barbell Hip Thrust)": {
    source: "Bret Contreras + NSCA Essentials",
    cues: {
      ko: [
        "어깨갈비뼈 벤치 끝",
        "발 어깨너비, 엉덩이 가까이",
        "올릴 때 엉덩이 짜내기 + 정점 1초",
        "허리 꺾이지 않게 — 갈비뼈 닫음",
        "패드 사용 — 골반 통증 방지",
      ],
      en: [
        "Shoulder blades on bench edge",
        "Feet shoulder-width, close to hips",
        "Squeeze glutes + 1-second peak",
        "Don't hyperextend — ribs softly tucked",
        "Use a pad to protect the hips",
      ],
    },
  },

  "트랩바 데드리프트 (Trap Bar Deadlift)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "트랩바 가운데 서기 — 손잡이 골반 라인",
        "허리 곧게 + 가슴 들고 — 컨벤셔널보다 직립",
        "그립 양 손잡이 단단히 (중립)",
        "다리로 바닥 미는 느낌",
        "정점 직립 + 엉덩이 짜내기",
      ],
      en: [
        "Stand inside the bar — handles at hip line",
        "Back straight + chest up — more upright than conventional",
        "Grip both handles firmly (neutral)",
        "Drive with legs",
        "Stand tall + glute squeeze at the top",
      ],
    },
  },

  "헤머 벤치 프레스 (Hammer Bench Press)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "좌석 — 손잡이 가슴 중앙",
        "등 등받이 \"붙여\"",
        "팔꿈치 약 45도 — 어깨 보호",
        "끝까지 펴지 말고",
        "좌우 균형 신경 (독립 동작)",
      ],
      en: [
        "Seat — handles at mid-chest",
        "Back glued to backrest",
        "Elbows ~45° — shoulder protection",
        "Don't fully lock at top",
        "Mind left/right balance (independent arms)",
      ],
    },
  },

  "업라이트 로우 (Upright Row)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "그립 어깨너비 — 좁으면 어깨 부담",
        "팔꿈치를 위로 끌기 — 손목으로 끌지 X",
        "바벨 가슴~턱까지만",
        "정점 1초 + 천천히",
        "어깨 충돌 위험 — 가벼운 무게",
      ],
      en: [
        "Grip shoulder-width — narrower stresses shoulders",
        "Drive elbows up — don't pull with wrists",
        "Bar to chest/chin only",
        "1-second peak + slow",
        "Impingement risk — start light",
      ],
    },
  },

  "덤벨 루마니안 데드리프트 (Dumbbell Romanian Deadlift)": {
    source: "Starting Strength + NSCA Essentials",
    cues: {
      ko: [
        "덤벨 좌우 같이",
        "직립 시작 — 다리 살짝만 굽힘",
        "엉덩이 뒤로 hinge",
        "햄스트링 늘어남까지",
        "정점 엉덩이 짜내기",
      ],
      en: [
        "Match weight on both sides",
        "Start standing — soft knees",
        "Hinge at the hips",
        "Stop at hamstring stretch",
        "Glute squeeze at the top",
      ],
    },
  },

  "덤벨 와이드 스쿼트 (Dumbbell Wide Squat)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "발 1.5~2배 어깨너비, 발끝 30-45도 바깥",
        "무릎이 발끝 방향",
        "허벅지 평행, 상체 거의 수직",
        "내전근/엉덩이 자극",
        "처음이면 가벼운 무게",
      ],
      en: [
        "Feet 1.5-2× shoulder width, toes 30-45° out",
        "Knees track over toes",
        "Thighs parallel, torso vertical",
        "Adductor/glute focus",
        "Start light",
      ],
    },
  },

  "덤벨 쓰러스터 (Dumbbell Thruster)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "시작 — 덤벨 어깨 옆 \"랙\"",
        "스쿼트 + 일어나며 동시에 프레스",
        "스쿼트 추진력으로 프레스 보조",
        "정점 — 머리 위 + 직립",
        "처음이면 분리 동작부터",
      ],
      en: [
        "Start — dumbbells at shoulders (rack)",
        "Squat + press in one fluid motion",
        "Use squat drive to assist press",
        "Top — overhead + standing",
        "Drill components separately first",
      ],
    },
  },

  "덤벨 플로어 프레스 (Dumbbell Floor Press)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "바닥 누워 — 무릎 자세 자유",
        "덤벨 좌우 같이",
        "팔꿈치 바닥 닿으면 멈춤",
        "올릴 때 가슴 짜내기",
        "어깨 부상자 친화적",
      ],
      en: [
        "Lie on floor — knees free",
        "Match weight",
        "Stop when elbows hit the floor",
        "Squeeze chest on the way up",
        "Shoulder-friendly variation",
      ],
    },
  },

  "덤벨 힙 쓰러스트 (Dumbbell Hip Thrust)": {
    source: "Bret Contreras + NSCA Essentials",
    cues: {
      ko: [
        "어깨갈비뼈 벤치 끝",
        "덤벨 골반 위 + 패드",
        "발 어깨너비, 엉덩이 가까이",
        "엉덩이 짜내기 + 정점 1초",
        "허리 꺾이지 않게",
      ],
      en: [
        "Shoulder blades on bench edge",
        "Dumbbell on hips + pad",
        "Feet shoulder-width, close to hips",
        "Squeeze glutes + 1-second peak",
        "Don't hyperextend the back",
      ],
    },
  },

  "덤벨 프리쳐 컬 (Dumbbell Preacher Curl)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "패드 높이 — 겨드랑이 패드 끝",
        "팔꿈치 단단히 — 떨어지지 않게",
        "한 손씩, 좌우 균형",
        "내릴 때 완전히 펴지 않게",
        "정점 1초 짜내기",
      ],
      en: [
        "Pad — armpit catches the top",
        "Elbow firm — never lift off",
        "One arm at a time",
        "Don't fully extend at the bottom",
        "1-second peak squeeze",
      ],
    },
  },

  "아놀드 프레스 (Arnold Press)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "시작 — 손바닥 본인 쪽",
        "올리며 손목 회전 — 정점 손바닥 앞",
        "팔꿈치 자연스럽게 옆으로",
        "정점 잠금 + 회전하며 내림",
        "처음이면 가벼운 무게",
      ],
      en: [
        "Start — palms toward you",
        "Rotate as you press — palms forward at top",
        "Elbows naturally flare out",
        "Lock at top + rotate back down",
        "Start light",
      ],
    },
  },

  "워킹 런지 (Walking Lunges)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "한 발 크게 앞 — 무릎 90도",
        "뒷 무릎 바닥 직전",
        "다음 걸음으로 — 제자리 X",
        "상체 곧게 + 코어 brace",
        "처음이면 맨몸 + 짧은 거리",
      ],
      en: [
        "Step forward — knee at 90°",
        "Back knee just above floor",
        "Step into next — don't return",
        "Torso upright + brace core",
        "Bodyweight + short distance first",
      ],
    },
  },

  "고블렛 스쿼트 (Goblet Squat)": {
    source: "Dan John, Goblet Squat",
    cues: {
      ko: [
        "양손으로 가슴 앞 잡기",
        "발 어깨너비 살짝 넓게, 발끝 약 15도 바깥",
        "허벅지 평행, 무릎 발끝 방향",
        "상체 거의 수직",
        "팔꿈치가 무릎 안쪽 닿을 정도까지 OK",
      ],
      en: [
        "Hold at chest with both hands",
        "Feet slightly wider than shoulders, toes ~15° out",
        "Thighs parallel, knees track over toes",
        "Torso nearly vertical",
        "Elbows touching insides of knees is OK",
      ],
    },
  },

  "불가리안 스플릿 스쿼트 (Bulgarian Split Squat)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "벤치 거리 — 무릎이 발끝 안 넘게",
        "뒷발 — 발등 또는 발끝 받침",
        "내려갈 때 상체 거의 수직",
        "앞다리로 일어남",
        "처음이면 맨몸",
      ],
      en: [
        "Bench distance — knee shouldn't pass the toe",
        "Back foot — top-of-foot or toe-down",
        "Torso nearly vertical on the descent",
        "Drive up with front leg",
        "Start with bodyweight",
      ],
    },
  },

  "리버스 런지 (Reverse Lunges)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "한 발 크게 뒤로 — 뒷 무릎 바닥 직전",
        "앞다리 90도",
        "상체 곧게",
        "앞다리로 일어나 시작 자세",
        "포워드 런지보다 무릎 부담 ↓",
      ],
      en: [
        "Step back — back knee just above floor",
        "Front knee ~90°",
        "Torso upright",
        "Drive up with front leg",
        "Less knee load than forward lunges",
      ],
    },
  },

  "스텝업 (Step-Up)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "벤치 높이 — 무릎 약 90도",
        "발 전체 벤치 위에",
        "앞 다리로 \"밀어올리기\"",
        "내려올 때 천천히",
        "처음이면 낮은 박스 + 맨몸",
      ],
      en: [
        "Bench height — gives ~90° at knee",
        "Full foot on the bench",
        "Push up with front leg",
        "Step down slowly",
        "Low box + bodyweight first",
      ],
    },
  },

  "케틀벨 워킹 런지 (Kettlebell Walking Lunge)": {
    source: "Pavel Tsatsouline + NSCA Essentials",
    cues: {
      ko: [
        "케틀벨 어깨 앞 랙 포지션",
        "한 발 크게 앞 — 무릎 90도",
        "뒷 무릎 바닥 직전",
        "다음 걸음으로",
        "코어 brace — 케틀벨 흔들리지 않게",
      ],
      en: [
        "Kettlebell at the shoulder (rack)",
        "Step forward — knee at 90°",
        "Back knee just above floor",
        "Step into next rep",
        "Brace the core — kettlebell stays put",
      ],
    },
  },

  "싱글 레그 케틀벨 RDL (Single-Leg Kettlebell RDL)": {
    source: "Pavel Tsatsouline + NSCA Essentials",
    cues: {
      ko: [
        "케틀벨 — 운동 다리 반대 손",
        "한 다리 살짝 굽힘 + hinge",
        "뒷다리 천장으로 + 등 곧게",
        "햄스트링 늘어남까지",
        "올라올 때 엉덩이 짜내기",
      ],
      en: [
        "Hold kettlebell on opposite-side hand",
        "Slight bend in working knee + hinge",
        "Back leg extends + back straight",
        "Lower until hamstring stretch",
        "Glute squeeze on the way up",
      ],
    },
  },

  "케틀벨 플로어 프레스 (Kettlebell Floor Press)": {
    source: "Pavel Tsatsouline + NSCA Essentials",
    cues: {
      ko: [
        "바닥 누워 — 편한 다리",
        "케틀벨 랙 — 손바닥 안쪽",
        "팔꿈치 바닥 닿으면 멈춤",
        "올릴 때 손목 회전 — 정점 손바닥 앞",
        "한쪽씩 — 코어 자극",
      ],
      en: [
        "Lie on floor — comfortable legs",
        "Rack position — palm in",
        "Stop when elbow hits the floor",
        "Rotate wrist on the way up — palm forward at top",
        "One arm — extra core demand",
      ],
    },
  },

  "케틀벨 윈드밀 (Kettlebell Windmill)": {
    source: "Pavel Tsatsouline",
    cues: {
      ko: [
        "케틀벨 머리 위 직선 (락아웃)",
        "케틀벨 쪽 발 약 45도 바깥",
        "케틀벨에서 시선 떼지 말기",
        "허리로 옆 굽혀 반대 손 바닥 쪽",
        "처음이면 가벼운 + 짧은 가동범위",
      ],
      en: [
        "Lock kettlebell overhead in straight arm",
        "Foot under kettlebell turned ~45° out",
        "Eyes on kettlebell at all times",
        "Side-bend at the waist, opposite hand toward floor",
        "Start light + short range",
      ],
    },
  },

  "원 암 랫 풀다운 (One Arm Lat Pulldown)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "허벅지 패드 + 무게 핀 끝까지",
        "D핸들 그립",
        "당길 때 손이 어깨 옆으로",
        "반대 손 자유 (좌석 받침)",
        "한쪽 끝나면 반대 같은 횟수",
      ],
      en: [
        "Thigh pad + pin all the way",
        "D-handle grip",
        "Pull to shoulder side",
        "Other hand free (resting on seat)",
        "Switch sides for equal reps",
      ],
    },
  },

  "체스트 서포티드 로우 (Chest Supported Row)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "패드 — 가슴/배 단단히 (배 압박 X)",
        "그립 — 머신 종류 따라 V바/평행/와이드",
        "당길 때 어깨 뒤로 + 등 가운데 짜내기",
        "허리 둥글지 않게 — 패드가 받침",
        "팔로 끌지 않게 — 등이 일하도록",
      ],
      en: [
        "Pad — chest/belly firmly (not pressing too hard)",
        "Grip — V-bar / parallel / wide depending on machine",
        "Pull elbows back + squeeze mid-back",
        "Back stays straight — pad supports",
        "Don't pull with the arms — let the back work",
      ],
    },
  },

  "하이로우 머신 (High Row Machine)": {
    source: "NSCA Essentials of Strength Training 2nd Ed.",
    cues: {
      ko: [
        "좌석 — 손잡이 가슴 위쪽",
        "체스트 패드에 가슴 단단히",
        "팔꿈치 뒤로 — 등 가운데 짜내기",
        "어깨 으쓱 X",
        "양손 또는 한쪽씩",
      ],
      en: [
        "Seat — handles at upper-chest",
        "Chest firmly on the pad",
        "Pull elbows back — squeeze mid-back",
        "No shrugging",
        "Both arms or one side",
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
