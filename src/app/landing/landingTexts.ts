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
    line3: string;
    sub: HeroSub;
    stats: { prefix: string; suffix: string; label: string }[];
    statNote: string;
  };
  howItWorks: {
    title: string;
    steps: { title: string; desc: string }[];
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
    line1: "체중감량, 벌크업, 러닝",
    line2: "어떻게 할지,",
    line3: "AI가 3초 만에 끝내줌.",
    sub: "10명 중 9명이 끝까지 함. PT 없이, 매일 내 컨디션에 맞게.",
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
      { title: "컨디션 체크", desc: "터치 한 번, 오늘 내 상태 끝" },
      { title: "오늘 루틴 완성", desc: "고민 0초, 바로 운동 시작" },
      { title: "AI 코치 피드백", desc: "PT 없이도 뭘 잘했는지 알게 됨" },
      { title: "영양까지 한 번에", desc: "뭘 먹어야 하는지도 끝" },
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
  reviews: [],
  pricing: {
    label: "PRICING",
    headingDim: "PT 월 660,000원",
    headingBright: "오운잘은 월 6,900원",
    sub: "먼저 써보고, 결정은 그 다음에.",
    free: {
      name: "무료",
      desc: "부담 없이 시작",
      price: "0원",
      unit: "/월",
      features: ["비로그인 1회 체험", "하루 4회 AI 운동 플랜", "운동 기록 저장"],
    },
    premium: {
      badge: "초기 특가",
      name: "프리미엄",
      desc: "모든 기능 무제한",
      priceOld: "9,900원",
      price: "6,900원",
      unit: "/월",
      discount: "30% 할인",
      features: [
        "AI 운동 플랜 무제한",
        "세션별 AI 분석 리포트",
        "AI 코치 피드백",
        "AI 영양 코칭",
        "성장 예측 리포트",
        "주간 퀘스트 + 시즌 티어",
      ],
    },
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
    line1: "Lose Weight",
    line1b: "Build Muscle",
    line2: "Run Further",
    line3: "No PT needed",
    sub: "Your daily workout, built by AI in 3 seconds",
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
      { title: "Condition Check", desc: "One tap, your status is set" },
      { title: "Today's Routine Ready", desc: "Zero thinking, start working out" },
      { title: "AI Coach Feedback", desc: "Know what you did right, no PT needed" },
      { title: "Nutrition Included", desc: "What to eat — done" },
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
    headingDim: "Personal training: $500/mo",
    headingBright: "Ohunjal: $4.99/mo",
    sub: "Try it first, decide later.",
    free: {
      name: "Free",
      desc: "No commitment",
      price: "$0",
      unit: "/mo",
      features: ["1 free trial without sign-up", "4 AI workout plans per day", "Workout history saved"],
    },
    premium: {
      badge: "Early Bird",
      name: "Premium",
      desc: "Everything, unlimited",
      priceOld: "$7.99",
      price: "$4.99",
      unit: "/mo",
      discount: "30% off",
      features: [
        "Unlimited AI workout plans",
        "AI analysis report per session",
        "AI coach feedback",
        "AI nutrition coaching",
        "Growth prediction report",
        "Weekly quests + season tiers",
      ],
    },
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
