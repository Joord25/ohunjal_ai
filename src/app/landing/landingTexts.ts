export type LandingLocale = "ko" | "en";

/**
 * Hero 부제 — 단순 문자열 또는 여러 줄 배열.
 * - string: 한 줄 부제 (한국어 등)
 * - string[]: 여러 줄 부제 (영어 multi-line)
 */
export type HeroSub = string | string[];

export interface LandingTexts {
  nav: { brand: string; cta: string };
  hero: {
    line1: string;
    line1b?: string;
    line2: string;
    line2b?: string;
    line3: string;
    sub: HeroSub;
    stats: { prefix: string; suffix: string; label: string }[];
    statNote: string;
  };
  howItWorks: {
    title: string;
    steps: { title: string; desc: string; premium?: boolean }[];
  };
  trust: {
    heading: string;
    sub: string[];
  };
  reviews: { stars: number; title: string; review: string; name: string }[];
  pricing: {
    label: string;
    headingDim: string;
    headingBright: string;
    sub: string;
    free: {
      name: string;
      desc: string;
      price: string;
      unit: string;
      features: string[];
    };
    premium: {
      badge: string;
      name: string;
      desc: string;
      priceOld: string;
      price: string;
      unit: string;
      discount: string;
      features: string[];
    };
  };
  faq: {
    title: string;
    items: { q: string; a: string }[];
  };
  footer: {
    mission: string;
    company: string[];
    copyright: string;
    terms: string;
    termsHref: string;
    privacy: string;
    privacyHref: string;
  };
}

const ko: LandingTexts = {
  nav: { brand: "오운잘 AI", cta: "바로 시작" },
  hero: {
    line1: "챗GPT랑 다른게 뭐냐구요?",
    line2: "말만 하는 AI 말고,",
    line3: "오늘 뛰게 하는 앱",
    sub: ["ACSM·NASM 국제 운동 가이드라인 기반", "한체대 박사진 검수 · 다이어트, 러닝, 근력운동까지"],
    stats: [
      { prefix: "주 ", suffix: "회", label: "평균 운동 빈도" },
      { prefix: "", suffix: "%", label: "루틴 완주율" },
      { prefix: "+", suffix: "%", label: "첫 달 운동량 증가" },
    ],
    statNote: "* 2025.12 ~ 2026.03 주 2회 이상 사용자 기준",
  },
  howItWorks: {
    title: "HOW IT WORKS",
    steps: [
      { title: "AI와 대화 시작", desc: "\"3개월 다이어트 플랜\" 한마디면 끝" },
      { title: "오늘 루틴 완성", desc: "고민 0초, 바로 준비 완료" },
      { title: "[[바로 운동 시작!]]", desc: "글만 주는 AI 말고, [[오운잘 에이전트]]가 옆에서" },
      { title: "AI 코치 피드백", desc: "PT 없이도 뭘 잘했는지 알게 됨" },
      { title: "영양까지 한 번에", desc: "뭘 먹어야 하는지도 끝", premium: true },
    ],
  },
  trust: {
    heading: "Backed by\n한체대 · ACSM · NASM",
    sub: [
      "현역 트레이너가 직접 설계한 AI,",
      "한체대 운동과학 교수 및 박사의 검수와, 최신 ACSM · NASM · NSCA 국제 운동 정보가",
      "알고리즘에 녹아 있습니다.",
    ],
  },
  reviews: [
    { stars: 5, title: "헬스 초보인데 진짜 좋음ㅠㅠ", review: "운동에 ㅇ자도 모르는 초초초보예요. 뭘 해야 할지 몰라서 맨날 러닝머신만 탔는데, 이거 쓰고 나서 진짜 루틴이 생김", name: "sa****" },
    { stars: 5, title: "오! PT 받는 느낌이 나네여...", review: "저렴하게 이용하면서도 PT 받는 느낌이 날 것 같아 좋다는 작은 의견을 드립니다. 구독했어유. 정말 빛같은 앱이에요~~ 최고최고", name: "nn****" },
    { stars: 5, title: "루틴 좀 괜ㅊ낳은듯! 굿", review: "그때그때 상황에 맞게 맞춤운동을 알려줘서 너무 좋네요. AI가 알아서 짜줘서 딴 생각 안하고 바로 시작할 수 있어요!", name: "kt****" },
    { stars: 4, title: "생각보다 괜찮은 앱임 잘써봄!", review: "루틴 추천 기능 자체가 너무 좋고, 운동이 바로 보여서 좋아요. 상황별 루틴추천이 특히 좋음", name: "ej****" },
    { stars: 5, title: "홈트도 있네? 러닝도 있고?", review: "처음 헬스 시작해서 본인만의 루트가 없고, 집에서 홈트하는 초보에게 좋은듯! 처음 가는 헬스장에서 어떤 기구를 다뤄야 하는지, 어떤 자세로 해야하는지 등 운동의 처음부터 끝까지 다 알려주거 같네여. 헬스장을 못 가는 날엔 그만큼 땀흘리고 적당히 힘든 홈트 루틴을 만들어줘서 정말 편해요", name: "dy****" },
    { stars: 5, title: "진짜 매일 다른 루틴 나옴", review: "어제 상체 했으면 오늘은 하체, 컨디션 안 좋다고 하면 가볍게 나옴. 이게 진짜 AI인가 싶음", name: "mw****" },
    { stars: 5, title: "운동 끝나고 분석이 대박임", review: "세트별로 뭘 잘했는지 알려주고 다음에 뭘 바꾸라고 코칭해주네요?. PT 트레이너 없어도 혼자 성장하는 느낌. 필기한걸 토대로 문제 만들어준다는 릴스 보고 깔아봤는데 악필인 내글씨에도 불구하고 핵심내용 정확하게 파악해주고 문제 만들어주는거...", name: "jy****" },
    { stars: 4, title: "오 트레이너가 만든거 맞는듯 퀄리티 굿", review: "프리미엄 쓰면 분석이랑 영양까지 나와서 놀람. 정확한거 맞죠? ㅋㅋㅋ", name: "sh****" },
    { stars: 5, title: "개조음 ㅋㅋㅋㅋ", review: "완전 좋고 깔끔하고 누구든 쉽게 쓸 수 있을 것 같네여 강추!!", name: "hk****" },
  ],
  pricing: {
    label: "PRICING",
    headingDim: "기존 운동앱 월 19,800원",
    headingBright: "오운잘은 월 4,900원",
    sub: "로그인하고 무료 체험. 결정은 그 다음에.",
    free: {
      name: "무료 체험",
      desc: "로그인 후 첫 플랜 무료",
      price: "0원",
      unit: "/체험",
      features: ["AI 운동 플랜 1회 무료 생성", "메인 운동 2개 무료 진행", "프리미엄 전환은 운동 중에 안내"],
    },
    premium: {
      badge: "초기 특가",
      name: "프리미엄",
      desc: "모든 기능 무제한",
      priceOld: "9,900원",
      price: "4,900원",
      unit: "/월",
      discount: "50% 할인",
      features: [
        "AI 운동 플랜 무제한",
        "세션별 AI 분석 리포트",
        "AI 코치 피드백",
        "AI 영양 코칭",
        "성장 예측 리포트",
        "장기 프로그램 모드 저장",
      ],
    },
  },
  faq: {
    title: "자주 묻는 질문",
    items: [
      {
        q: "운동 기록 앱, 유튜브 루틴 다 써봤는데 뭐가 달라요?",
        a: "대부분의 앱에서 기록은 **저장되고 끝납니다.** 스쿼트 60kg 10회를 적어도 그 숫자가 나에게 돌아오는 건 없어요. 유튜브 영상은 아예 내가 뭘 했는지 모르고요. 쓰고 버려지는 데이터입니다. 오운잘에서는 그 기록이 세션 리포트로 해석되고, 성장 예측의 재료가 되고, AI 코치가 읽고 말을 겁니다. 종목별로 마지막에 든 무게도 기억해서 다음엔 거기서 시작해요. **기록이 쌓이는 게 아니라, 기록이 해석돼서 돌아옵니다.**",
      },
      {
        q: "무료로는 어디까지 써볼 수 있나요?",
        a: "로그인하면 AI 운동 플랜을 **1회** 만들어볼 수 있어요. 어떤 방식으로 묻고 어떤 루틴이 나오는지, 결이 맞는지 확인하는 용도입니다. 플랜 저장도 1개까지 되고요. 세션 리포트, 성장 예측, AI 영양 코치처럼 **기록이 쌓여야 의미가 생기는 기능**은 프리미엄에 있습니다. 한 번 써보고 판단할 수 있는 건 취향이고, 데이터가 나에게 돌아오는 경험은 쌓여야 보이거든요.",
      },
      {
        q: "AI가 짜준 운동, 믿고 따라 해도 되나요?",
        a: "오운잘의 AI는 문장을 만드는 게 아니라 **처방을 계산합니다.** 국제 가이드라인 **ACSM·NASM**과 **한체대** 운동과학 박사진 검수를 거친 규칙 위에서 돌아가고, 현장에서 회원을 가르치는 트레이너가 설계에 직접 참여했어요. 운동마다 자세 큐가 따라붙고, 세트 사이 휴식도 ACSM 권장값을 그대로 보여줍니다. 그날 몸 상태와 에너지를 입력하면 강도와 세트 수가 거기 맞춰 조정되고, 부담되는 동작은 같은 근육군의 다른 운동으로 **직접 바꿀 수 있어요.**",
      },
      {
        q: "PT 받는 거랑 비교하면 어때요?",
        a: "PT의 핵심은 **나에게 맞춘다**는 것입니다. 오운잘도 같은 걸 해요. 그날 컨디션, 가진 시간, 장비, 목표에 맞춰 매번 새로 짭니다. 차이는 그다음입니다. PT에서 오간 조정은 대부분 그 자리에서 소모되지만, 오운잘에서는 남아요. 내가 든 무게, 완주한 세션, 성장 추이가 계정에 **자산으로 쌓여서** 리포트와 예측으로 돌아옵니다. 회당 5~8만 원 대신 월 **4,900원**이라는 건 사실 두 번째 이유예요.",
      },
      {
        q: "결제 수단 / 구독 취소 / 환불 / 데이터 보호는?",
        a: "한국은 **카카오페이**, 해외는 **신용카드(Paddle)**. 프로필 탭에서 **1클릭 해지**. 결제 후 7일 이내 + AI 운동 플랜 미생성 시 전액 환불(카카오페이 3~5영업일, Paddle 5~10영업일). 모든 운동·개인 데이터는 Google Cloud 암호화 저장, 제3자 공유 없음. 계정 삭제 시 모든 데이터 영구 삭제.",
      },
    ],
  },
  footer: {
    mission: "당신의 시간을 아끼고, 성장의 즐거움과 건강을 드립니다.",
    company: [
      "주드(Joord) · 대표 임주용",
      "사업자등록번호 | 623-36-01460",
      "통신판매 | 2026-서울관악-0647",
      "서울특별시 관악구 은천로35길 40-6, 404호",
      "H.P 010-4824-2869 | ounjal.ai.app@gmail.com",
    ],
    copyright: "© 2026 Ohunjal AI. All rights reserved.",
    terms: "이용약관",
    termsHref: "/terms",
    privacy: "개인정보처리방침",
    privacyHref: "/privacy",
  },
};

const en: LandingTexts = {
  nav: { brand: "Ohunjal AI", cta: "Get Started" },
  hero: {
    line1: "ChatGPT talks",
    line2: "You've got a",
    line2b: "body to train",
    line3: "Let's go",
    sub: ["Built on ACSM·NASM international standards", "Reviewed by KNSU PhDs · Diet, running, strength"],
    stats: [
      { prefix: "", suffix: "x", label: "Avg. weekly sessions" },
      { prefix: "", suffix: "%", label: "Completion rate" },
      { prefix: "+", suffix: "%", label: "Volume increase (1st mo)" },
    ],
    statNote: "* Based on users working out 2+ times/week, Dec 2025 - Mar 2026",
  },
  howItWorks: {
    title: "HOW IT WORKS",
    steps: [
      { title: "Talk to AI", desc: "\"3-month diet plan\" — one line, done" },
      { title: "Today's Routine Ready", desc: "Zero thinking, ready to go" },
      { title: "[[Start — for real]]", desc: "Not text-only AI. [[Ohunjal agent]], right beside you" },
      { title: "AI Coach Feedback", desc: "Know what you did right, no PT needed" },
      { title: "Nutrition Included", desc: "What to eat — done", premium: true },
    ],
  },
  trust: {
    heading: "Backed by\nKNSU · ACSM · NASM",
    sub: [
      "Built by a 10-year certified trainer.",
      "Reviewed by KNSU exercise science PhDs, powered by the latest ACSM · NASM · NSCA international standards.",
      "",
    ],
  },
  reviews: [],
  pricing: {
    label: "PRICING",
    headingDim: "Other fitness apps: $15.99/mo",
    headingBright: "Ohunjal: $4.99/mo",
    sub: "Sign in for a free trial. Decide later.",
    free: {
      name: "Free Trial",
      desc: "First plan free, after sign-in",
      price: "$0",
      unit: "/trial",
      features: ["Generate 1 AI plan free", "Run 2 main exercises free", "Premium upgrade prompt mid-workout"],
    },
    premium: {
      badge: "Early Bird",
      name: "Premium",
      desc: "Everything, unlimited",
      priceOld: "$7.99",
      price: "$4.99",
      unit: "/mo",
      discount: "50% off",
      features: [
        "Unlimited AI workout plans",
        "AI analysis report per session",
        "AI coach feedback",
        "AI nutrition coaching",
        "Growth prediction report",
        "Save long-term programs",
      ],
    },
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        q: "I have tried workout trackers and YouTube routines. What is different here?",
        a: "In most apps your log is **where data goes to die.** You write down 60kg for 10 reps and nothing ever comes back. A YouTube video does not even know you exist. Ohunjal reads it instead: sessions become reports, reports become growth predictions, and your AI coach talks to you about what actually happened. It remembers the last weight you lifted on every exercise, so you start there next time. **Your log does not pile up. It comes back to you.**",
      },
      {
        q: "How far can I get on the free plan?",
        a: "Sign in and you can generate **1 AI plan** free, plus keep 1 saved plan. That is enough to see how it asks, what it builds, and whether the two of you get along. Session reports, growth predictions and the AI nutrition coach sit in Premium, because **those features need history to mean anything.** Taste you can judge in one session. Compounding you have to stack.",
      },
      {
        q: "Is an AI-built routine actually safe to follow?",
        a: "Ohunjal AI does not write sentences. It **calculates prescriptions.** It runs on rules built from **ACSM and NASM** guidelines and reviewed by KNSU exercise science PhDs, designed hands-on by a trainer who coaches real clients. Every exercise carries form cues, and rest between sets shows the ACSM-recommended value. Tell it how your body feels and how much energy you have, and intensity and set count adjust to match. Anything that feels wrong, you **swap yourself** for another exercise in the same muscle group.",
      },
      {
        q: "How does this compare to a personal trainer?",
        a: "A trainer's real job is **fitting the work to you**, and that is what Ohunjal does too, rebuilding every session around your condition, time, equipment and goal. The difference comes after. What a trainer adjusts in the room mostly disappears with the session. Here it stays: every weight, every completed session, every trend **compounds in your account** and returns as reports and predictions. Costing **$4.99/mo** instead of $75-100 a session is honestly the second reason.",
      },
      {
        q: "Payment, cancellation, refunds, data protection?",
        a: "Pay by **card via Paddle** (international) or **KakaoPay** (Korea). **1-click cancel** in Profile. Refundable within 7 days if no AI plans were generated (KakaoPay 3-5 business days, Paddle 5-10 business days). All data encrypted on Google Cloud, never shared with third parties. Delete your account and all data is permanently wiped.",
      },
    ],
  },
  footer: {
    mission: "Save your time, enjoy growth and health.",
    company: [
      "Joord Inc. · CEO Juyong Lim",
      "Business Reg. | 623-36-01460",
      "Seoul, South Korea",
      "ounjal.ai.app@gmail.com",
    ],
    copyright: "© 2026 Ohunjal AI. All rights reserved.",
    terms: "Terms of Service",
    termsHref: "/en/terms",
    privacy: "Privacy Policy",
    privacyHref: "/en/privacy",
  },
};

export const LANDING_TEXTS: Record<LandingLocale, LandingTexts> = { ko, en };
