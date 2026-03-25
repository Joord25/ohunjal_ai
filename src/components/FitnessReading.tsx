"use client";

import React, { useState, useEffect } from "react";
import { saveUserProfile } from "@/utils/userProfile";

/* ─── types ─── */
export interface FitnessProfile {
  weeklyFrequency: number;       // 주 몇 회
  sessionMinutes: number;        // 1회 운동 시간(분)
  place: "gym" | "home" | "both";
  equipment: ("barbell" | "dumbbell" | "machine" | "bodyweight")[];
  goal: "fat_loss" | "muscle_gain" | "endurance" | "health";
}

interface Props {
  userName: string;
  onComplete: (profile: FitnessProfile) => void;
}

/* ─── constants ─── */
const FREQ_OPTIONS = [
  { value: 0, label: "안 해봤어요", sub: "처음이에요" },
  { value: 2, label: "주 1~2회", sub: "가볍게" },
  { value: 3, label: "주 3~4회", sub: "꾸준히" },
  { value: 5, label: "주 5회+", sub: "열심히" },
];

const TIME_OPTIONS = [
  { value: 30, label: "30분" },
  { value: 45, label: "50분" },
  { value: 60, label: "60분" },
  { value: 90, label: "90분+" },
];

const GOAL_OPTIONS: { value: FitnessProfile["goal"]; label: string }[] = [
  { value: "fat_loss", label: "체지방 감량" },
  { value: "muscle_gain", label: "근력 증가" },
  { value: "endurance", label: "기초 체력" },
  { value: "health", label: "건강 유지" },
];

/* ─── 목표별 예측 항목 ─── */
interface PredictionItem {
  label: string;
}

const PREDICTIONS_BY_GOAL: Record<string, { title: string; items: PredictionItem[] }> = {
  fat_loss: {
    title: "체지방 감량",
    items: [
      { label: "목표 체중 도달 예상 기간" },
      { label: "주간 예상 칼로리 소모량" },
      { label: "내 또래 평균 체지방률 비교" },
    ],
  },
  muscle_gain: {
    title: "근력 증가",
    items: [
      { label: "주요 운동 중량 성장 예측" },
      { label: "내 또래 평균 근력 도달까지" },
      { label: "주간 목표 볼륨 가이드" },
    ],
  },
  endurance: {
    title: "기초 체력",
    items: [
      { label: "심폐 능력 향상 예측" },
      { label: "내 또래 체력 수준 비교" },
      { label: "주간 목표 운동량 가이드" },
    ],
  },
  health: {
    title: "건강 유지",
    items: [
      { label: "건강 위험도 감소 예측" },
      { label: "주간 최소 운동량 달성률" },
      { label: "내 또래 활동량 비교" },
    ],
  },
};

/* ─── reading results (논문 기반) ─── */
interface ReadingResult {
  typeName: string;
  typeEmoji: string;
  message: string;
  growthStars: number;
  freePeek: string;
}

function computeReading(p: FitnessProfile): ReadingResult {
  // 주간 총 운동 시간(분)
  const weeklyMin = p.weeklyFrequency * p.sessionMinutes;

  // ACSM 권고: 주 150분 moderate or 75분 vigorous
  const acsmPct = Math.round((weeklyMin / 150) * 100);

  // 성장 포텐셜 별점 (1~5)
  let stars = 3;
  if (p.weeklyFrequency === 0) stars = 3; // 초보자 = 가장 빠른 성장 구간
  else if (p.weeklyFrequency >= 4 && p.sessionMinutes >= 60) stars = 5;
  else if (p.weeklyFrequency >= 3 && p.sessionMinutes >= 45) stars = 4;
  else if (p.weeklyFrequency <= 2 && p.sessionMinutes <= 30) stars = 2;


  // 타입 결정
  let typeName: string;
  let typeEmoji: string;
  if (p.goal === "fat_loss") {
    typeName = p.weeklyFrequency >= 4 ? "불꽃 연소형" : "꾸준한 연소형";
    typeEmoji = "🔥";
  } else if (p.goal === "muscle_gain") {
    typeName = p.weeklyFrequency >= 4 ? "폭발 성장형" : "안정 성장형";
    typeEmoji = "💪";
  } else if (p.goal === "endurance") {
    typeName = "끈기 상승형";
    typeEmoji = "⚡";
  } else {
    typeName = "균형 유지형";
    typeEmoji = "🌿";
  }

  // 메시지
  const message =
    p.weeklyFrequency === 0
      ? "처음이라면 지금이 가장 좋은 시작입니다\n초보자일수록 성장 속도가 빠릅니다"
      : acsmPct >= 150
        ? "당신의 조건은\n빠른 변화를 만들기에 충분합니다"
        : acsmPct >= 100
          ? "당신의 조건은\n변화를 만들기에 충분합니다"
          : "작은 시작이\n가장 큰 변화를 만듭니다";

  // 무료 공개 한 줄 (논문 기반 팩트)
  const freePeek =
    p.goal === "fat_loss"
      ? `주 ${p.weeklyFrequency}회 × ${p.sessionMinutes}분 운동 시\n주당 약 ${Math.round(p.weeklyFrequency * p.sessionMinutes * 5.5)}kcal 소모 예상`
      : p.goal === "muscle_gain"
        ? `초보자의 첫 12주간\n근력 평균 40% 증가가 보고되었습니다`
        : p.goal === "endurance"
          ? `주 ${p.weeklyFrequency}회 유산소 훈련 시\n4주 내 심폐 능력 향상이 보고되었습니다`
          : `규칙적 운동은\n모든 원인 사망률을 31% 감소시킵니다`;

  return { typeName, typeEmoji, message, growthStars: stars, freePeek };
}

/* ─── step type ─── */
type Step = "welcome" | "frequency" | "time" | "place" | "equipment" | "goal" | "analyzing" | "result";

/* ─── Component ─── */
export const FitnessReading: React.FC<Props> = ({ userName, onComplete }) => {
  const [step, setStep] = useState<Step>("welcome");
  const [profile, setProfile] = useState<Partial<FitnessProfile>>({});
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [resultReady, setResultReady] = useState(false);

  const displayName = userName || "회원";

  /* ─── back navigation ─── */
  const stepOrder: Step[] = ["welcome", "frequency", "time", "goal"];
  const handleBack = () => {
    const currentIdx = stepOrder.indexOf(step);
    if (currentIdx <= 0) return;
    setStep(stepOrder[currentIdx - 1]);
  };

  /* ─── step transitions ─── */
  const handleFrequency = (v: number) => {
    setProfile((p) => ({ ...p, weeklyFrequency: v }));
    setStep("time");
  };

  const handleTime = (v: number) => {
    setProfile((p) => ({ ...p, sessionMinutes: v }));
    setStep("goal");
  };

  /* place 제거 — time에서 바로 goal로 */

  const handleGoal = (v: FitnessProfile["goal"]) => {
    const complete = { ...profile, goal: v } as FitnessProfile;
    setProfile(complete);
    // Save to localStorage
    localStorage.setItem("alpha_fitness_profile", JSON.stringify(complete));
    localStorage.setItem("alpha_fitness_reading_done", "true");
    // Save to Firestore (users/{uid}.fitnessProfile)
    saveUserProfile({ fitnessProfile: complete }).catch(() => {});
    setStep("analyzing");
  };

  /* ─── fake analysis animation ─── */
  const analysisMessages = [
    `${displayName}님의 훈련 환경을 분석하고 있습니다`,
    "운동 과학 데이터를 매칭하고 있습니다",
    "성장 가능성을 계산하고 있습니다",
    "패턴 리딩을 준비하고 있습니다",
  ];

  useEffect(() => {
    if (step !== "analyzing") return;

    setAnalysisProgress(0);
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const progress = Math.min(frame * 2.5, 100);
      setAnalysisProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setStep("result");
          setTimeout(() => setShowResult(true), 100);
        }, 400);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── result animation ─── */
  useEffect(() => {
    if (step === "result" && showResult) {
      const timer = setTimeout(() => setResultReady(true), 600);
      return () => clearTimeout(timer);
    }
  }, [step, showResult]);

  /* ─── reading ─── */
  const reading = step === "result" ? computeReading(profile as FitnessProfile) : null;

  /* ─── render helpers ─── */
  const renderStepIndicator = () => {
    const steps: Step[] = ["frequency", "time", "goal"];
    const currentIdx = steps.indexOf(step);
    if (currentIdx < 0) return null;
    return (
      <div className="flex items-center gap-1.5 justify-center mb-6">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`h-1 rounded-full transition-all duration-300 ${
              i <= currentIdx ? "bg-emerald-600 w-6" : "bg-gray-200 w-4"
            }`}
          />
        ))}
      </div>
    );
  };

  const questionTitle = (text: string) => (
    <h2 className="text-lg font-bold text-gray-900 text-left w-full mb-6 leading-relaxed whitespace-pre-line">
      {text}
    </h2>
  );

  const backButton = () => (
    <button
      onClick={handleBack}
      className="self-start mb-4 text-[#6B7280] text-sm flex items-center gap-1"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      이전
    </button>
  );

  const optionButton = (
    selected: boolean,
    onClick: () => void,
    children: React.ReactNode,
    key?: string,
  ) => (
    <button
      key={key}
      onClick={onClick}
      className={`w-full py-3.5 px-4 rounded-2xl border-2 text-left transition-all duration-200 ${
        selected
          ? "border-emerald-600 bg-emerald-50 text-emerald-900"
          : "border-gray-100 bg-white text-gray-700 hover:border-gray-200"
      }`}
    >
      {children}
    </button>
  );

  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [showMLTooltip, setShowMLTooltip] = useState(false);

  useEffect(() => {
    if (step === "welcome") {
      const t = setTimeout(() => setWelcomeVisible(true), 200);
      return () => clearTimeout(t);
    }
  }, [step]);

  /* ─── RENDER ─── */
  return (
    <div className="h-full flex flex-col bg-white relative">
      {/* Welcome Screen */}
      {step === "welcome" && (
        <div className="flex-1 flex flex-col bg-[#FAFBF9] overflow-y-auto">
          <div className="flex-1 flex flex-col items-center justify-center px-8">
            {/* Logo */}
            <div
              className={`mb-6 transition-all duration-700 ${
                welcomeVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
            >
              <img
                src="/login-logo-kor2.png"
                alt="오운잘"
                className="h-24 object-contain"
              />
            </div>

            {/* Greeting */}
            <h1
              className={`text-[#1B4332] text-2xl font-bold text-center mb-3 transition-all duration-700 delay-200 ${
                welcomeVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {displayName}님, 환영합니다
            </h1>

            {/* Message */}
            <div
              className={`text-center mb-10 transition-all duration-700 delay-400 ${
                welcomeVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <p className="text-[#6B7280] text-sm leading-loose">
                오운잘 AI는 미래 예측 모델인
              </p>
              <p className="text-[#6B7280] text-sm leading-loose">
                <button onClick={() => setShowMLTooltip(true)} className="text-[#1B4332] font-semibold underline decoration-dotted underline-offset-2">회귀분석 기반 머신러닝</button> 기술로
              </p>
              <p className="text-[#6B7280] text-sm leading-loose mt-2">
                당신의 <span className="text-[#1B4332] font-semibold">운동 패턴을 분석</span>하고
              </p>
              <p className="text-[#6B7280] text-sm leading-loose">
                <span className="text-[#1B4332] font-semibold">더 나은 미래의 모습</span>을 안내드립니다
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => setStep("frequency")}
              className={`w-full py-4 rounded-2xl font-bold text-white bg-[#2D6A4F] active:scale-95 transition-all duration-700 delay-800 ${
                welcomeVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              준비되었습니다
            </button>

          </div>
        </div>
      )}

      {/* Question Steps */}
      {step === "frequency" && (
        <div className="flex-1 flex flex-col px-6 pt-6">
          {backButton()}
          {renderStepIndicator()}
          {questionTitle(`${displayName}님,\n일주일에 몇 번 운동해 오셨나요?`)}
          <div className="w-full space-y-3">
            {FREQ_OPTIONS.map((o) =>
              optionButton(profile.weeklyFrequency === o.value, () => handleFrequency(o.value), (
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{o.label}</span>
                  <span className="text-xs text-gray-400">{o.sub}</span>
                </div>
              ), String(o.value))
            )}
          </div>
        </div>
      )}

      {step === "time" && (
        <div className="flex-1 flex flex-col px-6 pt-6">
          {backButton()}
          {renderStepIndicator()}
          {questionTitle("1회 운동 시간은\n어느 정도인가요?")}
          <div className="w-full grid grid-cols-2 gap-3">
            {TIME_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => handleTime(o.value)}
                className={`py-4 rounded-2xl border-2 font-semibold transition-all duration-200 ${
                  profile.sessionMinutes === o.value
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                    : "border-gray-100 bg-white text-gray-700 hover:border-gray-200"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}



      {step === "goal" && (
        <div className="flex-1 flex flex-col px-6 pt-6">
          {backButton()}
          {renderStepIndicator()}
          {questionTitle("가장 원하는 변화는\n무엇인가요?")}
          <div className="w-full space-y-3">
            {GOAL_OPTIONS.map((o) =>
              optionButton(profile.goal === o.value, () => handleGoal(o.value), (
                <span className="font-semibold text-center w-full block">{o.label}</span>
              ), o.value)
            )}
          </div>
        </div>
      )}

      {/* Analyzing Animation */}
      {step === "analyzing" && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 bg-white">
          {/* Pulse animation */}
          <div className="relative w-16 h-16 mb-8">
            <div className="absolute inset-0 rounded-full bg-[#2D6A4F]/10 animate-ping" style={{ animationDuration: "2s" }} />
            <div className="absolute inset-2 rounded-full bg-[#2D6A4F]/20 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.3s" }} />
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-[#2D6A4F] flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <p className="text-lg font-bold text-[#1B4332] text-center">
            {displayName}님의 데이터를 분석하고 있어요
          </p>

          {/* Step checklist */}
          <div className="mt-8 space-y-3 w-full max-w-[260px]">
            {analysisMessages.map((msg, i) => {
              const currentStep = analysisProgress < 25 ? 0 : analysisProgress < 50 ? 1 : analysisProgress < 75 ? 2 : 3;
              const done = i < currentStep;
              const active = i === currentStep;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    done ? "bg-[#2D6A4F]" : active ? "bg-[#2D6A4F]/20 animate-pulse" : "bg-gray-100"
                  }`}>
                    {done && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm transition-all duration-300 ${
                    done ? "text-[#1B4332] font-medium" : active ? "text-[#1B4332] font-medium animate-pulse" : "text-gray-300"
                  }`}>
                    {msg}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Result Screen */}
      {step === "result" && reading && (() => {
        const goalKey = (profile as FitnessProfile).goal;
        const allGoals = Object.entries(PREDICTIONS_BY_GOAL);
        const myGoal = allGoals.find(([k]) => k === goalKey);
        const otherGoals = allGoals.filter(([k]) => k !== goalKey);
        const freqLabel = profile.weeklyFrequency === 0 ? "입문" : `주 ${profile.weeklyFrequency}회`;

        return (
          <div className="flex-1 flex flex-col bg-[#FAFBF9]">
            <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24">
              {/* Title */}
              <h1
                className={`text-[#1B4332] text-xl font-bold mb-2 transition-all duration-700 ${
                  showResult ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {displayName}님의 성장 예측
              </h1>
              <p
                className={`text-[#6B7280] text-sm mb-6 transition-all duration-700 delay-100 ${
                  showResult ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {freqLabel} · {profile.sessionMinutes}분
              </p>

              {/* Message + Stars */}
              <div
                className={`w-full bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-sm transition-all duration-700 delay-200 ${
                  showResult ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              >
                <p className="text-[#1B4332] text-sm font-medium leading-relaxed whitespace-pre-line mb-4">
                  {reading.message}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280] text-sm">성장 가능성</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className={`text-base text-[#2D6A4F] transition-all duration-300 ${
                          resultReady ? "scale-100" : "scale-0"
                        }`}
                        style={{ transitionDelay: `${400 + i * 100}ms` }}
                      >
                        {i <= reading.growthStars ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* My goal predictions */}
              {myGoal && (
                <div
                  className={`w-full bg-white rounded-2xl p-5 mb-4 border-2 border-[#2D6A4F]/20 shadow-sm transition-all duration-700 delay-400 ${
                    showResult ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-[#2D6A4F]" />
                    <span className="text-[#1B4332] text-sm font-bold">내 목표: {myGoal[1].title}</span>
                  </div>
                  <div className="space-y-2.5">
                    {myGoal[1].items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-[#1B4332] text-sm">{item.label}</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-gray-200 rounded-full" style={{ filter: "blur(3px)" }} />
                          </div>
                          <svg className="w-3.5 h-3.5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other goal predictions */}
              {otherGoals.map(([key, goalData], idx) => (
                <div
                  key={key}
                  className={`w-full bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-sm transition-all duration-700 ${
                    showResult ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: `${600 + idx * 150}ms` }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <span className="text-[#6B7280] text-sm font-bold">이런 목표라면: {goalData.title}</span>
                  </div>
                  <div className="space-y-2.5">
                    {goalData.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-[#6B7280] text-sm">{item.label}</span>
                        <svg className="w-3.5 h-3.5 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            </div>

            {/* Fixed CTA */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#FAFBF9] px-6 pb-6 pt-3 border-t border-gray-100">
              <p className="text-[#6B7280] text-xs text-center mb-3">
                운동 데이터 수집 후 예측 리포트가 열립니다
              </p>
              <button
                onClick={() => onComplete(profile as FitnessProfile)}
                className="w-full py-4 rounded-2xl font-bold text-white bg-[#2D6A4F] active:scale-95 transition-all"
              >
                첫 운동 시작하기
              </button>
            </div>
          </div>
        );
      })()}

      {/* ML Tooltip (CoachTooltip style) */}
      {showMLTooltip && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center animate-fade-in" onClick={() => setShowMLTooltip(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className="bg-white rounded-2xl px-5 py-5 shadow-2xl mx-6 relative z-10">
            <p className="text-emerald-600 text-[11px] font-bold tracking-wider uppercase mb-2">예측 모델 안내</p>
            <p className="text-[15px] font-black text-[#1B4332] leading-snug">회귀분석 기반 머신러닝이란?</p>
            <p className="text-[12.5px] text-gray-600 leading-relaxed mt-1.5">
              오운잘 AI는 당신의 운동 데이터에서{"\n"}총볼륨(중량x횟수), 세트수, 운동시간,{"\n"}빈도, 체중 등 다양한 입력값을 수집합니다.
            </p>
            <p className="text-[12.5px] text-gray-600 leading-relaxed mt-2">
              이 데이터를 XGBoost(트리 기반 앙상블) 모델과{"\n"}논문 검증된 회귀분석에 적용하여{"\n"}칼로리 소모, 근력 성장, 볼륨 추세를 예측합니다.
            </p>
            <p className="text-[12.5px] text-gray-600 leading-relaxed mt-2">
              데이터가 쌓일수록 당신만의 패턴을 학습해{"\n"}예측 정밀도가 높아집니다.
            </p>
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
              <p className="text-[11px] text-gray-400">· 볼륨-칼로리 상관관계 r=0.89 — Haddock & Wilkin, 2006</p>
              <p className="text-[11px] text-gray-400">· 초보자 근력 성장 메타분석 — Rhea et al., 2003</p>
              <p className="text-[11px] text-gray-400">· ACSM 운동 처방 가이드라인</p>
            </div>
            <p className="text-[10px] text-gray-400 mt-3 font-medium">탭하여 닫기</p>
          </div>
        </div>
      )}
    </div>
  );
};
