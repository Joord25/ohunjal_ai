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
}

const STEP_KEYS = [
  "loading.step1",
  "loading.step2",
  "loading.step3",
  "loading.step4",
  "loading.step5",
];

export const PlanLoadingOverlay: React.FC<PlanLoadingOverlayProps> = ({
  userName,
  bodyPart,
  goal,
  sessionMode,
  targetMuscle,
  onComplete,
}) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;
    STEP_KEYS.forEach((_, i) => {
      elapsed += i === 0 ? 0 : 200 + Math.random() * 300;
      timers.push(setTimeout(() => setActiveStep(i), elapsed));
    });
    if (onComplete) {
      timers.push(setTimeout(onComplete, elapsed + 400));
    }
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

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

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center animate-fade-in">
      {/* AI Brain pulse animation */}
      <div className="relative w-16 h-16 mb-8">
        <div className="absolute inset-0 rounded-full bg-[#2D6A4F]/10 animate-ping" style={{ animationDuration: "2s" }} />
        <div className="absolute inset-2 rounded-full bg-[#2D6A4F]/20 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.3s" }} />
        <div className="absolute inset-0 w-16 h-16 rounded-full bg-[#2D6A4F] flex items-center justify-center">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
        </div>
      </div>

      {/* Personalized greeting */}
      <p className="text-lg font-bold text-gray-800 text-center px-8">
        {t("loading.greeting", { userName, conditionText })}
      </p>
      <p className="text-sm text-gray-500 mt-1 text-center px-8">
        {t("loading.building", { goalText })}
      </p>

      {/* Step-by-step progress — centered */}
      <div className="mt-8 flex flex-col gap-2.5 items-center">
        {STEP_KEYS.map((key, i) => (
          <div
            key={i}
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
              {t(key)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
