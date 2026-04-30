"use client";

import React, { useState, useEffect } from "react";
import type { UserCondition, WorkoutGoal, SessionMode, TargetMuscle } from "@/constants/workout";
import { useTranslation } from "@/hooks/useTranslation";

interface PlanLoadingOverlayProps {
  userName: string;
  bodyPart?: UserCondition["bodyPart"];
  goal?: WorkoutGoal | null;
  sessionMode?: SessionMode;
  targetMuscle?: TargetMuscle;
  onComplete?: () => void;
  /**
   * 회의 ζ-5 (2026-04-30): 프로그램 생성 모드 — 6단계 cascade + 프로그램 컨텍스트 사용.
   * 웨이트 카탈로그 / 러닝 여정 모두 이 변형으로 통일된 로딩 화면 노출.
   * onComplete 호출하지 않음 — parent가 fetch+save 완료 후 직접 unmount.
   */
  variant?: "default" | "catalog_program";
  catalogContext?: {
    programName: string;
    totalWeeks: number;
    totalSessions: number;
    sessionsPerWeek: number;
  };
}

const STEP_KEYS = [
  "loading.step1",
  "loading.step2",
  "loading.step3",
  "loading.step4",
  "loading.step5",
];

const CATALOG_STEP_KEYS = [
  "loading.catalog.step1",
  "loading.catalog.step2",
  "loading.catalog.step3",
  "loading.catalog.step4",
  "loading.catalog.step5",
  "loading.catalog.step6",
];

export const PlanLoadingOverlay: React.FC<PlanLoadingOverlayProps> = ({
  userName,
  bodyPart,
  goal,
  sessionMode,
  targetMuscle,
  onComplete,
  variant = "default",
  catalogContext,
}) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  const isCatalog = variant === "catalog_program" && !!catalogContext;
  const stepKeys = isCatalog ? CATALOG_STEP_KEYS : STEP_KEYS;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    if (isCatalog) {
      // 6단계 800ms 간격 cascade. 마지막 단계는 active 유지 (parent가 unmount).
      stepKeys.forEach((_, i) => {
        timers.push(setTimeout(() => setActiveStep(i), i * 800));
      });
      // catalog 변형은 onComplete 호출하지 않음.
    } else {
      let elapsed = 0;
      stepKeys.forEach((_, i) => {
        elapsed += i === 0 ? 0 : 200 + Math.random() * 300;
        timers.push(setTimeout(() => setActiveStep(i), elapsed));
      });
      if (onComplete) {
        timers.push(setTimeout(onComplete, elapsed + 400));
      }
    }
    return () => timers.forEach(clearTimeout);
  }, [onComplete, isCatalog, stepKeys]);

  // 인사말 / 부제 — 변형에 따라 분기
  let greeting: string;
  let subText: string;
  if (isCatalog && catalogContext) {
    const params = {
      userName,
      programName: catalogContext.programName,
      totalWeeks: String(catalogContext.totalWeeks),
      sessionsPerWeek: String(catalogContext.sessionsPerWeek),
      totalSessions: String(catalogContext.totalSessions),
    };
    greeting = t("loading.catalog.title", params);
    subText = t("loading.catalog.subtitle", params);
  } else {
    const conditionText =
      bodyPart === "upper_stiff" ? t("loading.condition.upper_stiff")
      : bodyPart === "lower_heavy" ? t("loading.condition.lower_heavy")
      : bodyPart === "full_fatigue" ? t("loading.condition.full_fatigue")
      : t("loading.condition.good");

    const goalText =
      sessionMode === "split" && targetMuscle
        ? `${t(`loading.muscle.${targetMuscle}`) || t("loading.goal.split_default")} ${t("loading.goal.split")}`
        : sessionMode === "running" ? t("loading.goal.running")
        : sessionMode === "home_training" ? t("loading.goal.home_training")
        : goal === "fat_loss" ? t("loading.goal.fat_loss")
        : goal === "muscle_gain" ? t("loading.goal.muscle_gain")
        : goal === "strength" ? t("loading.goal.strength")
        : t("loading.goal.default");

    greeting = t("loading.greeting", { userName, conditionText });
    subText = t("loading.building", { goalText });
  }

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center animate-fade-in">
      {/* AI Brain pulse animation — 통일 base */}
      <div className="relative w-16 h-16 mb-8">
        <div className="absolute inset-0 rounded-full bg-[#2D6A4F]/10 animate-ping" style={{ animationDuration: "2s" }} />
        <div className="absolute inset-2 rounded-full bg-[#2D6A4F]/20 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.3s" }} />
        <div className="absolute inset-0 w-16 h-16 rounded-full bg-[#2D6A4F] flex items-center justify-center">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
        </div>
      </div>

      {/* 인사말 */}
      <p className="text-lg font-bold text-gray-800 text-center px-8">
        {greeting}
      </p>
      <p className="text-sm text-gray-500 mt-1 text-center px-8">
        {subText}
      </p>

      {/* Step cascade — 통일 양식 */}
      <div className="mt-8 flex flex-col gap-2.5 items-center">
        {stepKeys.map((key, i) => {
          const label = isCatalog && catalogContext
            ? t(key, {
                programName: catalogContext.programName,
                totalWeeks: String(catalogContext.totalWeeks),
                sessionsPerWeek: String(catalogContext.sessionsPerWeek),
                totalSessions: String(catalogContext.totalSessions),
              })
            : t(key);
          return (
            <div
              key={key}
              className={`flex items-center gap-2 transition-all duration-500 ${
                i <= activeStep ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                i < activeStep
                  ? "bg-[#2D6A4F]"
                  : i === activeStep
                    ? "bg-[#2D6A4F]/70 animate-pulse"
                    : "bg-gray-200"
              }`}>
                {i < activeStep ? (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className="w-1 h-1 rounded-full bg-white" />
                )}
              </div>
              <span className={`text-[12px] font-medium transition-colors duration-300 ${
                i < activeStep ? "text-[#2D6A4F]" : i === activeStep ? "text-gray-700" : "text-gray-300"
              }`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
