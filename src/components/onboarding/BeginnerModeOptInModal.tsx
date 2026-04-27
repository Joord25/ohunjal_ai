"use client";

import React, { useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { trackEvent } from "@/utils/analytics";
import { setBeginnerMode } from "@/utils/beginnerMode";

interface BeginnerModeOptInModalProps {
  open: boolean;
  onResolved: (enabled: boolean) => void;
}

export const BeginnerModeOptInModal: React.FC<BeginnerModeOptInModalProps> = ({ open, onResolved }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (open) trackEvent("beginner_mode_modal_show");
  }, [open]);

  if (!open) return null;

  const choose = (enabled: boolean) => {
    setBeginnerMode(enabled);
    trackEvent(enabled ? "beginner_mode_modal_yes" : "beginner_mode_modal_no");
    onResolved(enabled);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      <div className="relative z-10 mx-6 w-full max-w-sm bg-white rounded-3xl px-6 py-7 shadow-2xl">
        <h3 className="text-xl font-black text-[#1B4332] leading-snug">
          {t("beginner_mode.modal.title")}
        </h3>
        <p className="text-[13.5px] text-gray-600 leading-relaxed mt-2">
          {t("beginner_mode.modal.description")}
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => choose(true)}
            className="w-full h-12 rounded-2xl bg-[#1B4332] text-white text-[14px] font-bold active:scale-[0.98] transition-transform"
          >
            {t("beginner_mode.modal.cta_yes")}
          </button>
          <button
            type="button"
            onClick={() => choose(false)}
            className="w-full h-12 rounded-2xl bg-gray-50 text-gray-600 text-[14px] font-medium active:bg-gray-100"
          >
            {t("beginner_mode.modal.cta_no")}
          </button>
        </div>
      </div>
    </div>
  );
};
