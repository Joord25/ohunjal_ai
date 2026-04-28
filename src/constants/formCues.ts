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
};

export function getFormCues(exerciseName: string, locale: Locale): string[] {
  const set = EXERCISE_FORM_CUES[exerciseName];
  if (!set) return [];
  return locale === "en" ? set.cues.en : set.cues.ko;
}

export function getFormCueSource(exerciseName: string): string | undefined {
  return EXERCISE_FORM_CUES[exerciseName]?.source;
}
