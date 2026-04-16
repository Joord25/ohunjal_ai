/**
 * 유저 입력 의도 분류 + 즉시 Ack 메시지 생성 (클라이언트 룰베이스).
 * 회의 60 Phase 6A — 마누스식 "질문 의도 파악 및 재진술" UX.
 *
 * 설계 원칙:
 * - Gemini 호출 전 클라이언트에서 3카테고리 분류 (fitness / off_topic / ambiguous)
 * - off_topic이면 parseIntent 건너뛰고 리다이렉트 (비용 절감)
 * - Ack 카피는 야심 버전 유지 (feedback_product_positioning.md 원칙)
 */

export type IntentCategory = "fitness" | "off_topic" | "ambiguous";

// 명확한 운동/피트니스 시그널
const FITNESS_PATTERN = /(운동|헬스|트레이닝|근육|근력|자극|세트|회차|rep|1rm|rpe|푸쉬업|풀업|플랭크|벤치|스쿼트|데드|덤벨|바벨|케틀벨|머신|케이블|러닝|조깅|유산소|무산소|인터벌|다이어트|감량|증량|벌크|커팅|체지방|체중|살빼|살빠|살 빼|부위|가슴|등운동|등 운동|어깨|삼각근|이두|삼두|팔운동|팔 운동|하체|다리운동|다리 운동|허벅지|엉덩|힙|둔근|복근|코어|종아리|프로틴|크레아틴|bcaa|보충제|탄단지|식단|1일\s*\d+끼|아령|컬|프레스|로우|레이즈|크런치|런지|딥스|풀다운|덤벨\w|바벨\w|스미스머신|생리주기|pms)/i;

// 명확한 off-topic 시그널 (운동과 전혀 무관)
const OFF_TOPIC_PATTERN = /(주식|코인|비트코인|이더리움|부동산|집값|대출|정치|대통령|선거|뉴스|기사|날씨|비\s*온|영화|드라마|예능|넷플릭스|유튜브|게임|롤|배그|피파|코딩|프로그래밍|파이썬|리액트|자바|업무|회사|상사|연애|썸|데이트|결혼|이혼|레시피|요리법|맛집|주문|배달|음식점|카페|메뉴\s*추천|여행|항공권|호텔|책\s*추천|소설|시험|수능|토익|자격증)/i;

/**
 * 피벗 시그널 — 이전 대화 목표(다이어트/증량)와 다른 맥락으로 전환하는 키워드.
 * 감지되면 parseIntent에 history 안 넘겨서 Gemini가 이전 목표 재소환 방지.
 */
const PIVOT_PATTERN = /(부상|통증|아파|아픈|다쳤|다치|갑자기|이제|쉴래|그만|바꿀래|바꾸|다른|새로|대신|그건\s*됐|취소|리셋|처음부터|새 요청)/i;

export function isPivot(text: string): boolean {
  return PIVOT_PATTERN.test(text);
}

export function detectCategory(text: string): IntentCategory {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return "ambiguous";
  if (OFF_TOPIC_PATTERN.test(normalized)) return "off_topic";
  if (FITNESS_PATTERN.test(normalized)) return "fitness";
  return "ambiguous";
}

interface EchoResult {
  echo: string;
  redirect: boolean;
  detectedTags: string[];
}

/**
 * 감지된 키워드 기반 Ack 메시지 생성. off_topic이면 redirect=true 반환.
 */
export function buildIntentEcho(text: string, locale: "ko" | "en" = "ko"): EchoResult {
  const category = detectCategory(text);
  const tags: string[] = [];

  if (category === "off_topic") {
    tags.push("off_topic");
    return {
      echo: locale === "en"
        ? "Looks off-topic from fitness! Tell me what body part or how long you want to train today."
        : "운동 외 얘기 같은데요! 오늘 어떤 부위 운동할지 / 몇 분 할지 알려주시면 바로 준비해드릴게요 ㅎㅎ",
      redirect: true,
      detectedTags: tags,
    };
  }

  const lower = text.toLowerCase();
  const hasLongProgram = /(3개월|12주|장기|분기)/.test(text);
  const hasMenstrual = /(생리주기|pms|생리)/i.test(text);
  const hasShortBurst = /(7일|1주일|단기|휴가\s*전|휴가전)/.test(text);
  const hasAdvanced = /(상급자|고급|전문가|헬창)/.test(text);
  const hasRehab = /(부상|재활|회피|안\s*아프|통증\s*없)/.test(text);
  const hasPosture = /(거북목|굽은등|자세\s*교정|체형\s*교정)/.test(text);
  const hasDiet = /(다이어트|감량|살빼|살 빼|체지방)/.test(text);
  const hasBulk = /(증량|벌크|근육.*키|늘리|찌우)/.test(text);

  // 부위 감지
  const bodyParts: Array<{ re: RegExp; ko: string; en: string; tag: string }> = [
    { re: /(가슴|chest)/i, ko: "가슴", en: "chest", tag: "part:chest" },
    { re: /(등|back)/i, ko: "등", en: "back", tag: "part:back" },
    { re: /(어깨|shoulder)/i, ko: "어깨", en: "shoulders", tag: "part:shoulders" },
    { re: /(팔|이두|삼두|arm)/i, ko: "팔", en: "arms", tag: "part:arms" },
    { re: /(하체|다리|legs?)/i, ko: "하체", en: "legs", tag: "part:legs" },
    { re: /(복근|코어|abs?|core)/i, ko: "복근", en: "abs", tag: "part:core" },
    { re: /(전신|full\s*body)/i, ko: "전신", en: "full body", tag: "part:full" },
  ];
  const matchedPart = bodyParts.find((p) => p.re.test(lower));

  // 시간 감지
  const timeMatch = text.match(/(\d+)\s*분|(\d+)\s*min/i);
  const minutes = timeMatch ? Number(timeMatch[1] ?? timeMatch[2]) : null;

  // 러닝 거리 감지
  const runMatch = text.match(/(\d+)\s*km/i);
  const runKm = runMatch ? Number(runMatch[1]) : null;
  const isRun = /(러닝|조깅|달리기|run|jog)/i.test(text);

  let echo = "";

  if (locale === "en") {
    if (hasMenstrual && hasDiet) {
      echo = "Got it — cycle-synced diet plan request.";
    } else if (hasLongProgram && hasDiet) {
      echo = "Got it — 3-month fat-loss plan.";
    } else if (hasShortBurst) {
      echo = "Got it — short-burst focused plan.";
    } else if (hasPosture) {
      echo = "Got it — posture correction routine.";
    } else if (hasRehab) {
      echo = "Got it — injury-safe workout.";
    } else if (hasAdvanced && matchedPart) {
      echo = `Got it — advanced ${matchedPart.en} routine.`;
    } else if (isRun && runKm) {
      echo = `Got it — ${runKm}km run target.`;
    } else if (matchedPart && minutes) {
      echo = `Got it — ${matchedPart.en} ${minutes}-min session.`;
    } else if (matchedPart) {
      echo = `Got it — ${matchedPart.en} focus.`;
    } else if (hasBulk) {
      echo = "Got it — muscle-gain focus.";
    } else if (hasDiet) {
      echo = "Got it — fat-loss session.";
    } else if (category === "ambiguous") {
      echo = "Tell me a bit more so I can prep the right session.";
    } else {
      echo = "Got it.";
    }
  } else {
    if (hasMenstrual && hasDiet) {
      echo = "생리주기 반영 다이어트 플랜으로 이해했어요.";
      tags.push("menstrual_diet");
    } else if (hasLongProgram && hasDiet) {
      echo = "3개월 체지방 감량 플랜으로 이해했어요.";
      tags.push("long_diet");
    } else if (hasShortBurst) {
      echo = "단기 집중 플랜 요청이네요.";
      tags.push("short_burst");
    } else if (hasPosture) {
      echo = "체형 교정 루틴 요청이네요.";
      tags.push("posture");
    } else if (hasRehab) {
      echo = "부상 회피 운동 요청으로 이해했어요.";
      tags.push("rehab");
    } else if (hasAdvanced && matchedPart) {
      echo = `상급자 ${matchedPart.ko} 루틴 요청이네요.`;
      tags.push("advanced", matchedPart.tag);
    } else if (isRun && runKm) {
      echo = `${runKm}km 러닝 목표로 이해했어요.`;
      tags.push("run");
    } else if (matchedPart && minutes) {
      echo = `${matchedPart.ko} ${minutes}분 세션으로 이해했어요.`;
      tags.push(matchedPart.tag, `time:${minutes}`);
    } else if (matchedPart) {
      echo = `${matchedPart.ko} 중심 운동 요청이네요.`;
      tags.push(matchedPart.tag);
    } else if (hasBulk) {
      echo = "근육량 증대 요청으로 이해했어요.";
      tags.push("bulk");
    } else if (hasDiet) {
      echo = "체지방 감량 세션 요청이네요.";
      tags.push("diet");
    } else if (category === "ambiguous") {
      echo = "조금 더 구체적으로 말씀해주시면 딱 맞게 짜드릴게요.";
      tags.push("ambiguous");
    } else {
      echo = "요청 확인했어요.";
    }
  }

  return { echo, redirect: false, detectedTags: tags };
}
