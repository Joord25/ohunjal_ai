"use client";

import React, { useState, useEffect } from "react";
import { UserCondition, WorkoutGoal, WorkoutHistory } from "@/constants/workout";
import { updateWeight, updateGender, updateBirthYear } from "@/utils/userProfile";
import { getIntensityRecommendation, type IntensityLevel } from "@/utils/workoutMetrics";

interface ConditionCheckProps {
  onComplete: (condition: UserCondition, goal: WorkoutGoal) => void;
  onBack?: () => void;
}

type Step = "body_check" | "weight_input" | "goal_select";

export const ConditionCheck: React.FC<ConditionCheckProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState<Step>("body_check");

  // State
  const [bodyPart, setBodyPart] = useState<UserCondition["bodyPart"] | null>(null);
  const [energy, setEnergy] = useState<number>(3);
  const [goal, setGoal] = useState<WorkoutGoal | null>(null);
  const [bodyWeight, setBodyWeight] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("alpha_body_weight") || "";
    }
    return "";
  });
  const [gender, setGender] = useState<"male" | "female" | null>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("alpha_gender") as "male" | "female") || null;
    }
    return null;
  });
  const [birthYear, setBirthYear] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("alpha_birth_year") || "";
    }
    return "";
  });

  const [showIntensityGuide, setShowIntensityGuide] = useState(false);
  const [recentHistory, setRecentHistory] = useState<WorkoutHistory[]>([]);

  // Load recent history for intensity recommendation
  useEffect(() => {
    try {
      const raw = localStorage.getItem("alpha_workout_history");
      if (raw) {
        const all: WorkoutHistory[] = JSON.parse(raw);
        const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
        setRecentHistory(all.filter(h => new Date(h.date).getTime() > cutoff));
      }
    } catch { /* ignore */ }
  }, []);

  const savedBirthYear = (() => {
    if (typeof window === "undefined") return undefined;
    const v = parseInt(localStorage.getItem("alpha_birth_year") || "");
    return !isNaN(v) && v > 1900 ? v : undefined;
  })();

  const savedGender = (() => {
    if (typeof window === "undefined") return undefined;
    return (localStorage.getItem("alpha_gender") as "male" | "female") || undefined;
  })();

  const intensityRec = recentHistory.length > 0
    ? getIntensityRecommendation(recentHistory, savedBirthYear, savedGender)
    : null;

  // 성별/출생연도가 이미 저장되어 있으면 체중만 입력
  const hasProfile = gender !== null && birthYear.trim().length >= 4;

  const handleBack = () => {
    if (step === "goal_select") {
      setStep("weight_input");
    } else if (step === "weight_input") {
      setStep("body_check");
    } else if (onBack) {
      onBack();
    }
  };

  const handleNext = (selectedBodyPart?: UserCondition["bodyPart"], selectedGoal?: WorkoutGoal) => {
    if (step === "body_check" && selectedBodyPart) {
      setBodyPart(selectedBodyPart);
      setStep("weight_input");
    } else if (step === "weight_input") {
      const weightNum = parseFloat(bodyWeight.trim());
      if (!isNaN(weightNum) && weightNum > 0) {
        updateWeight(weightNum);
      }
      if (gender) {
        updateGender(gender);
      }
      const byNum = parseInt(birthYear.trim());
      if (!isNaN(byNum) && byNum > 1900) {
        updateBirthYear(byNum);
      }
      // Show intensity guide popup before goal_select if we have recommendation data
      if (intensityRec && !showIntensityGuide) {
        setShowIntensityGuide(true);
      } else {
        setStep("goal_select");
      }
    } else if (step === "goal_select" && selectedGoal) {
      setGoal(selectedGoal);
      const weightNum = parseFloat(bodyWeight);
      const birthYearNum = parseInt(birthYear);
      onComplete({
        bodyPart: bodyPart!,
        energyLevel: energy as 1|2|3|4|5,
        availableTime: 50,
        bodyWeightKg: !isNaN(weightNum) && weightNum > 0 ? weightNum : undefined,
        gender: gender || undefined,
        birthYear: !isNaN(birthYearNum) && birthYearNum > 1900 ? birthYearNum : undefined,
      }, selectedGoal);
    }
  };

  return (
    <div className="flex flex-col h-full p-6 animate-fade-in relative">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
        <div
          className="h-full bg-[#2D6A4F] transition-all duration-500"
          style={{ width: step === "body_check" ? "33%" : step === "weight_input" ? "66%" : "100%" }}
        />
      </div>

      <div key={step} className="flex-1 flex flex-col gap-6 overflow-y-auto pb-24 scrollbar-hide">
        <div key={`header-${step}`} className="pt-4 pb-2 animate-fade-in shrink-0">
          <div className="flex items-center gap-2">
            {step !== "body_check" && (
              <button
                onClick={handleBack}
                className="text-gray-400 hover:text-gray-600 active:scale-90 transition-all -ml-1 p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <span className="text-[#2D6A4F] font-bold tracking-[0.2em] uppercase text-xs">
              AI 분석 • 단계 {step === "body_check" ? "1" : step === "weight_input" ? "2" : "3"}
            </span>
          </div>
          <h1 className="text-3xl font-black mt-2 leading-tight text-[#5C795E]">
            {step === "body_check" ? "오늘 몸 상태는\n어떠신가요?" : step === "weight_input" ? (hasProfile ? "오늘 체중을\n입력해주세요" : "기본 정보를\n입력해주세요") : "오늘의 운동\n목표는 무엇인가요?"}
          </h1>
        </div>
        {step === "body_check" ? (
          <>
            {/* Body Condition Selection */}
            <div className="flex flex-col gap-3">
              <ConditionCard
                selected={bodyPart === "upper_stiff"}
                onClick={() => handleNext("upper_stiff")}
                title="상체가 굳어있음"
                desc="목, 어깨, 등, 날개뼈 주위가 뻐근함"
                delay={0.05}
              />
              <ConditionCard
                selected={bodyPart === "lower_heavy"}
                onClick={() => handleNext("lower_heavy")}
                title="하체가 무거움"
                desc="고관절, 햄스트링, 종아리가 타이트함"
                delay={0.1}
              />
              <ConditionCard
                selected={bodyPart === "full_fatigue"}
                onClick={() => handleNext("full_fatigue")}
                title="전반적 피로감"
                desc="근육통 혹은 전신 컨디션 저하"
                delay={0.15}
              />
              <ConditionCard
                selected={bodyPart === "good"}
                onClick={() => handleNext("good")}
                title="컨디션 좋음"
                desc="특별한 불편함 없이 활력 넘침"
                delay={0.2}
              />
            </div>
          </>
        ) : step === "weight_input" ? (
          <div className="flex flex-col gap-5">
            {/* Gender Toggle — 초기 설정 시에만 표시 */}
            {!hasProfile && (
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 animate-card-enter" style={{ animationDelay: "0.05s", animationFillMode: "forwards" }}>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">성별</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setGender("male")}
                    className={`flex-1 py-3 rounded-xl font-bold text-base transition-all active:scale-[0.98] ${
                      gender === "male" ? "bg-[#1B4332] text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    남성
                  </button>
                  <button
                    onClick={() => setGender("female")}
                    className={`flex-1 py-3 rounded-xl font-bold text-base transition-all active:scale-[0.98] ${
                      gender === "female" ? "bg-[#1B4332] text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    여성
                  </button>
                </div>
              </div>
            )}

            {!hasProfile ? (
              /* 초기: 출생연도 + 체중 나란히 */
              <div className="flex gap-3 animate-card-enter" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
                <div className="flex-1 bg-white rounded-2xl border-2 border-gray-100 p-5">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">출생연도</p>
                  <div className="flex items-end gap-1">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      placeholder="1995"
                      className="w-full text-center text-3xl font-black text-[#5C795E] bg-transparent border-b-2 border-[#2D6A4F] outline-none pb-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-2xl border-2 border-gray-100 p-5">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">체중</p>
                  <div className="flex items-end gap-1">
                    <input
                      type="number"
                      inputMode="decimal"
                      value={bodyWeight}
                      onChange={(e) => setBodyWeight(e.target.value)}
                      placeholder="70"
                      className="w-full text-center text-3xl font-black text-[#5C795E] bg-transparent border-b-2 border-[#2D6A4F] outline-none pb-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-sm font-bold text-gray-400 pb-2">kg</span>
                  </div>
                </div>
              </div>
            ) : (
              /* 재방문: 체중만 크게 */
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 animate-card-enter" style={{ animationDelay: "0.05s", animationFillMode: "forwards" }}>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">오늘 체중</p>
                <div className="flex items-end justify-center gap-2">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={bodyWeight}
                    onChange={(e) => setBodyWeight(e.target.value)}
                    placeholder="70"
                    autoFocus
                    className="w-32 text-center text-4xl font-black text-[#5C795E] bg-transparent border-b-2 border-[#2D6A4F] outline-none pb-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-lg font-bold text-gray-400 pb-2">kg</span>
                </div>
              </div>
            )}

            <p className="text-[11px] text-gray-500 text-center font-medium">
              {hasProfile ? "매일 체중을 기록하면 더 정확한 분석이 가능해요" : "성별·연령·체중 기반 백분위 비교 및 AI 코칭에 활용됩니다"}
            </p>

            <button
              onClick={() => handleNext()}
              className="w-full py-4 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] bg-[#5C795E] text-white hover:bg-[#2D6A4F]"
            >
              다음
            </button>
          </div>
        ) : (
          /* Goal Selection */
          <GoalSelection
            goal={goal}
            onSelect={(g) => handleNext(undefined, g)}
            recommendedIntensity={intensityRec?.nextRecommended || null}
          />
        )}
      </div>

      <div className="absolute bottom-8 left-6 right-6">
        {/* Next Button Removed */}
      </div>

      {/* Intensity Recommendation Popup */}
      {showIntensityGuide && intensityRec && (
        <div className="absolute inset-0 z-40">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => {
            setShowIntensityGuide(false);
            setStep("goal_select");
          }} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] p-6 animate-slide-up shadow-2xl z-50" style={{ paddingBottom: "calc(var(--safe-area-bottom, 0px) + 16px)" }}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-black text-[#1B4332] mb-1">이번 주 훈련 밸런스</h3>
            <p className="text-[11px] text-gray-400 font-medium mb-4">ACSM · NSCA 주기화 기반 강도 배분</p>

            {/* Gender-specific intensity examples */}
            {savedGender && (
              <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{savedGender === "female" ? "여성" : "남성"} 강도 예시</p>
                {savedGender === "female" ? (
                  <div className="space-y-0.5 text-[11px] text-gray-600">
                    <p><span className="font-bold text-red-500">고강도</span> — 스쿼트 체중×0.65~1.0배, 1-6회 (짧은 휴식 가능)</p>
                    <p><span className="font-bold text-amber-600">중강도</span> — 스쿼트 체중×0.4~0.65배, 8-15회</p>
                    <p><span className="font-bold text-blue-500">저강도</span> — 맨몸 or 체중×0.3배 이하, 15회+</p>
                  </div>
                ) : (
                  <div className="space-y-0.5 text-[11px] text-gray-600">
                    <p><span className="font-bold text-red-500">고강도</span> — 스쿼트 체중×0.8~1.5배, 1-6회</p>
                    <p><span className="font-bold text-amber-600">중강도</span> — 스쿼트 체중×0.5~0.8배, 7-12회</p>
                    <p><span className="font-bold text-blue-500">저강도</span> — 맨몸 or 체중×0.3배 이하, 13회+</p>
                  </div>
                )}
              </div>
            )}

            {/* Weekly intensity progress */}
            <div className="space-y-3 mb-5">
              {([
                { key: "high" as const, label: "고강도", color: "bg-red-500", desc: "80%+ 1RM · 1-6회" },
                { key: "moderate" as const, label: "중강도", color: "bg-amber-500", desc: "60-79% 1RM · 7-12회" },
                { key: "low" as const, label: "저강도", color: "bg-blue-500", desc: "~60% 1RM · 13회+" },
              ]).map(({ key, label, color, desc }) => {
                const done = intensityRec.weekSummary[key];
                const target = intensityRec.target[key];
                const isFull = done >= target;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <div className="w-14 shrink-0">
                      <p className="text-[11px] font-bold text-gray-700">{label}</p>
                      <p className="text-[9px] text-gray-400">{desc}</p>
                    </div>
                    <div className="flex-1 flex items-center gap-1.5">
                      {Array.from({ length: target }).map((_, i) => (
                        <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                          i < done
                            ? `${color} border-transparent`
                            : "bg-gray-100 border-gray-200"
                        }`}>
                          {i < done ? (
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : null}
                        </div>
                      ))}
                      {isFull && <span className="text-[9px] font-bold text-emerald-600 ml-1">완료</span>}
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 shrink-0">{done}/{target}</span>
                  </div>
                );
              })}
            </div>

            {/* Recommendation */}
            <div className={`rounded-2xl p-4 mb-5 ${
              intensityRec.nextRecommended === "high" ? "bg-red-50 border border-red-100"
                : intensityRec.nextRecommended === "moderate" ? "bg-amber-50 border border-amber-100"
                : "bg-blue-50 border border-blue-100"
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-sm font-black ${
                  intensityRec.nextRecommended === "high" ? "text-red-600"
                    : intensityRec.nextRecommended === "moderate" ? "text-amber-700"
                    : "text-blue-600"
                }`}>
                  오늘은 {intensityRec.nextRecommended === "high" ? "고강도" : intensityRec.nextRecommended === "moderate" ? "중강도" : "저강도"} 추천!
                </span>
              </div>
              <p className="text-[11px] text-gray-600 font-medium">{intensityRec.reason}</p>
            </div>

            <button
              onClick={() => {
                setShowIntensityGuide(false);
                setStep("goal_select");
              }}
              className="w-full py-3.5 rounded-2xl bg-[#1B4332] text-white font-bold text-sm active:scale-[0.98] transition-all"
            >
              확인하고 목표 선택하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const INTENSITY_TO_GOAL: Record<string, WorkoutGoal> = {
  high: "strength",
  moderate: "muscle_gain",
  low: "fat_loss",
};

const GoalSelection = ({
  goal,
  onSelect,
  recommendedIntensity,
}: {
  goal: WorkoutGoal | null;
  onSelect: (g: WorkoutGoal) => void;
  recommendedIntensity: "high" | "moderate" | "low" | null;
}) => {
  const recGoal = recommendedIntensity ? INTENSITY_TO_GOAL[recommendedIntensity] : null;
  return (
    <div className="flex flex-col gap-3">
      <ConditionCard
        selected={goal === "fat_loss"}
        onClick={() => onSelect("fat_loss")}
        title="체지방 연소"
        desc="유산소성 근지구력 (15-20+ Reps)"
        highlight="Burn"
        recommended={recGoal === "fat_loss"}
        delay={0.05}
      />
      <ConditionCard
        selected={goal === "muscle_gain"}
        onClick={() => onSelect("muscle_gain")}
        title="근육량 증가"
        desc="근비대 볼륨 타겟 (8-12 Reps)"
        highlight="Build"
        recommended={recGoal === "muscle_gain"}
        delay={0.1}
      />
      <ConditionCard
        selected={goal === "strength"}
        onClick={() => onSelect("strength")}
        title="최대 근력"
        desc="고중량 스트렝스 (3-5 Reps)"
        highlight="Power"
        recommended={recGoal === "strength"}
        delay={0.15}
      />
      <ConditionCard
        selected={goal === "general_fitness"}
        onClick={() => onSelect("general_fitness")}
        title="기초체력향상"
        desc="맨몸 + 가벼운 도구 풀바디 서킷 (10-15 Reps)"
        highlight="Fit"
        delay={0.2}
      />
    </div>
  );
};

const ConditionCard = ({
  title,
  desc,
  selected,
  onClick,
  highlight,
  recommended,
  delay = 0
}: {
  title: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
  highlight?: string;
  recommended?: boolean;
  delay?: number;
}) => (
  <button
    onClick={onClick}
    className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-200 active:scale-[0.98] animate-card-enter ${
      selected
        ? "border-[#2D6A4F] bg-emerald-50 ring-1 ring-[#2D6A4F]"
        : recommended
          ? "border-amber-300 bg-amber-50/40 hover:border-amber-400 ring-1 ring-amber-200"
          : "border-gray-100 bg-white hover:border-gray-300"
    }`}
    style={{ animationDelay: `${delay}s`, animationFillMode: "forwards" }}
  >
    <div className="flex justify-between items-center mb-1">
      <div className="flex items-center gap-2">
        <span className={`text-lg font-bold ${selected ? "text-[#1B4332]" : "text-gray-900"}`}>
          {title}
        </span>
        {recommended && !selected && (
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 uppercase tracking-wider">추천</span>
        )}
      </div>
      {selected && (
        <svg className="w-6 h-6 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    <p className={`text-xs font-medium ${selected ? "text-[#2D6A4F]" : "text-gray-500"}`}>
      {desc}
    </p>
  </button>
);
