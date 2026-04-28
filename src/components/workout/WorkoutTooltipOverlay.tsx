"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { trackEvent } from "@/utils/analytics";

/** 워밍업 / 메인(strength·core) 첫 진입 시 1회 영구 dismiss (localStorage) */
type TooltipKind = "warmup" | "main";

interface WorkoutTooltipOverlayProps {
  exerciseType: string;
  beginnerEnabled: boolean;
}

function getTooltipKind(exerciseType: string): TooltipKind | null {
  if (exerciseType === "warmup" || exerciseType === "mobility") return "warmup";
  if (exerciseType === "strength" || exerciseType === "core") return "main";
  return null; // cardio 등은 Phase 2
}

export const WorkoutTooltipOverlay: React.FC<WorkoutTooltipOverlayProps> = ({
  exerciseType, beginnerEnabled,
}) => {
  const { t } = useTranslation();
  const kind = getTooltipKind(exerciseType);
  const storageKey = kind ? `ohunjal_beginner_tooltip_${kind}_seen` : null;
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!beginnerEnabled || !storageKey) return;
    if (typeof window === "undefined") return;
    if (localStorage.getItem(storageKey) === "1") return;
    setShow(true);
    trackEvent("workout_tooltip_show", { kind: kind ?? "" });
  }, [beginnerEnabled, storageKey, kind]);

  if (!show || !kind || !storageKey) return null;

  const handleDismiss = () => {
    if (typeof window !== "undefined") localStorage.setItem(storageKey, "1");
    trackEvent("workout_tooltip_dismiss", { kind });
    setShow(false);
  };

  return (
    <div className="fixed inset-0 z-[75] flex items-end sm:items-center justify-center p-5 animate-fade-in">
      <button
        type="button"
        onClick={handleDismiss}
        aria-label={t("beginner_mode.workout_tooltip.dismiss_aria")}
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
      />
      <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl px-6 py-7 shadow-2xl">
        <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-400">
          {t("beginner_mode.workout_tooltip.label")}
        </p>
        <h3 className="text-xl font-black text-[#1B4332] leading-snug mt-1">
          {t(`beginner_mode.workout_tooltip.${kind}.title`)}
        </h3>
        <p className="text-[13.5px] text-gray-600 leading-relaxed mt-2 whitespace-pre-line">
          {t(`beginner_mode.workout_tooltip.${kind}.body`)}
        </p>
        <p className="text-[12px] text-gray-400 mt-3">
          {t("beginner_mode.workout_tooltip.skip_hint")}
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          className="mt-5 w-full h-12 rounded-2xl bg-[#1B4332] text-white text-[14px] font-bold active:scale-[0.98] transition-transform"
        >
          {t("beginner_mode.workout_tooltip.cta")}
        </button>
      </div>
    </div>
  );
};
