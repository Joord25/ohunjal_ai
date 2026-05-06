"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { trackEvent } from "@/utils/analytics";
import { getExerciseName } from "@/utils/exerciseName";
import { EquipmentFinderCard } from "./EquipmentFinderCard";
import { ChatStyleWeightPicker } from "./ChatStyleWeightPicker";

/** 회의 ζ-2 (대표 정정 2026-04-28): tutorial_video_* 폐기 — 영상은 워크아웃 페이지 자체에 이미 있고, 별도 풀스크린 카드는 redundant. 후속에서 툴팁 안내로 재구현 */
export type BeginnerOverlayPhase =
  | "warmup_intro"
  | "equipment_find"
  | "equipment_use"
  | "chat_weight";

interface BeginnerGuideOverlayProps {
  phase: BeginnerOverlayPhase;
  exerciseName: string;
  onContinue: () => void;
  onSkip: () => void;
  /** 회의 ζ-2: 좌상단 뒤로가기 버튼. 호출자가 step-- 또는 운동 종료 처리 */
  onBack: () => void;
  /** chat_weight phase 전용 — 무게 선택 시 호출 (호출자가 localStorage 저장 + sequence advance) */
  onChatWeightSelect?: (weight: number) => void;
  /** chat_weight phase 전용 — 마지막 사용 무게 (kg). null = 첫 사용 */
  lastWeightKg?: number | null;
  /** 회의 2026-04-29: equipment_find phase에서 "기구 못 찾음" 시 대체 운동 swap 콜백 */
  onEquipmentSwap?: (newName: string) => void;
  /** 비기너 가이드 지원 + 같은 근육군 대체 운동 후보 (최대 5개) */
  swapAlternatives?: string[];
}

export const BeginnerGuideOverlay: React.FC<BeginnerGuideOverlayProps> = ({
  phase, exerciseName, onContinue, onSkip, onBack, onChatWeightSelect, lastWeightKg = null,
  onEquipmentSwap, swapAlternatives = [],
}) => {
  const { t, locale } = useTranslation();
  // 회의 2026-04-29: 기구 못 찾음 → 대체 운동 모달
  const [showSwapModal, setShowSwapModal] = useState(false);

  useEffect(() => {
    trackEvent("beginner_mode_overlay_show", { phase, exercise: exerciseName });
  }, [phase, exerciseName]);

  const handleContinue = () => {
    trackEvent("beginner_mode_overlay_cta", { phase, exercise: exerciseName });
    onContinue();
  };

  const handleSkip = () => {
    trackEvent("beginner_mode_overlay_skip", { phase, exercise: exerciseName });
    onSkip();
  };

  return (
    // 회의 2026-04-28: fixed inset-0 가 풀 viewport 덮어 PC에서 폭 제약 없이 콘텐츠 흐트러짐.
    // PhoneFrame과 동일 폭(sm:max-w-[415px])으로 가두고 외곽은 회색으로 통일.
    <div className="fixed inset-0 z-[70] bg-[#FAFBF9] sm:bg-gray-100 animate-fade-in">
      <div className="bg-white w-full h-full flex flex-col sm:max-w-[415px] sm:mx-auto sm:shadow-lg">
        <header
          className="flex justify-between items-center px-3 pb-3 shrink-0"
          style={{ paddingTop: "max(3rem, env(safe-area-inset-top))" }}
        >
        <button
          type="button"
          onClick={onBack}
          aria-label={t("common.back")}
          className="w-10 h-10 flex items-center justify-center text-[#1B4332] active:scale-95 transition-transform"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleSkip}
          className="text-[12px] font-medium text-gray-400 active:text-gray-600 px-3 py-2"
        >
          {t("beginner_mode.overlay.skip")}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pt-2 pb-6">
        {phase === "warmup_intro" && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-400">
                {t("beginner_mode.warmup.label")}
              </p>
              <h2 className="text-2xl font-black text-[#1B4332] mt-1">
                {t("beginner_mode.warmup.title")}
              </h2>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* 회의 2026-04-28: 오버레이 자체가 max-w-[415px] 컬럼으로 가둬졌으니 max-w 제약 제거 →
                컬럼 폭 그대로(모바일 풀폭 / PC ~415px) 사용해 충분한 시각 임팩트. */}
            <img
              src="/warmup/stretching-zone.jpg"
              alt={t("beginner_mode.warmup.title")}
              loading="eager"
              className="w-full aspect-[4/3] object-cover rounded-2xl bg-gray-50 border border-gray-100"
            />

            <ol className="flex flex-col gap-3 text-[14px] leading-relaxed text-gray-700">
              <li className="flex gap-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#2D6A4F] text-white text-[11px] font-black flex items-center justify-center mt-0.5">1</span>
                <div className="flex flex-col gap-1.5">
                  <span>{t("beginner_mode.warmup.step_1")}</span>
                  <span className="flex gap-1.5 items-start text-[12.5px] text-gray-500 bg-gray-50 rounded-lg px-2.5 py-2">
                    <svg className="flex-shrink-0 w-4 h-4 text-amber-500 mt-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
                    </svg>
                    <span>{t("beginner_mode.warmup.step_1_note")}</span>
                  </span>
                </div>
              </li>
              <li className="flex gap-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#2D6A4F] text-white text-[11px] font-black flex items-center justify-center mt-0.5">2</span>
                <span>{t("beginner_mode.warmup.step_2")}</span>
              </li>
              <li className="flex gap-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#2D6A4F] text-white text-[11px] font-black flex items-center justify-center mt-0.5">3</span>
                <span>{t("beginner_mode.warmup.step_3")}</span>
              </li>
            </ol>
          </div>
        )}

        {(phase === "equipment_find" || phase === "equipment_use") && (
          <div className="flex flex-col gap-4">
            {/* 회의 2026-04-28: 웜업 → 메인 전환 멘트. equipment_find 진입 시 flow 끊김 방지. */}
            {phase === "equipment_find" && (
              <p className="text-[14px] font-bold text-[#1B4332] leading-relaxed">
                {t("beginner_mode.equipment.find.intro")}
              </p>
            )}
            <EquipmentFinderCard
              exerciseName={exerciseName}
              mode={phase === "equipment_find" ? "find" : "use"}
            />
          </div>
        )}

        {phase === "chat_weight" && (
          <ChatStyleWeightPicker
            exerciseName={exerciseName}
            lastWeight={lastWeightKg}
            onSelect={(w) => onChatWeightSelect?.(w)}
          />
        )}
      </div>

      {/* chat_weight 는 자체 CTA (ChatStyleWeightPicker 안) — shell footer 미노출 */}
      {phase !== "chat_weight" && (
        <footer className="px-6 pt-3 pb-6 border-t border-gray-100 bg-white">
          {/* 회의 2026-04-29: equipment_find phase에 대체 운동 swap 옵션 — 50/50 버튼 분할.
              swapAlternatives.length === 0 또는 onEquipmentSwap 미제공 시 단일 CTA 유지. */}
          {phase === "equipment_find" && onEquipmentSwap && swapAlternatives.length > 0 ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleContinue}
                className="flex-1 h-14 rounded-2xl bg-[#1B4332] text-white text-[15px] font-black active:scale-[0.98] transition-transform"
              >
                {t("beginner_mode.equipment.find.cta")}
              </button>
              <button
                type="button"
                onClick={() => setShowSwapModal(true)}
                className="flex-1 h-14 rounded-2xl bg-white border border-gray-300 text-gray-600 text-[13px] font-bold active:scale-[0.98] transition-transform"
              >
                {t("beginner_mode.equipment.find.cta_unavailable")}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleContinue}
              className="w-full h-14 rounded-2xl bg-[#1B4332] text-white text-[15px] font-black active:scale-[0.98] transition-transform"
            >
              {phase === "warmup_intro"
                ? t("beginner_mode.warmup.cta")
                : phase === "equipment_find"
                  ? t("beginner_mode.equipment.find.cta")
                  : t("beginner_mode.equipment.use.cta")}
            </button>
          )}
        </footer>
      )}

      {/* 회의 2026-04-29: 대체 운동 모달 — equipment_find에서 "없어요" 클릭 시 */}
      {showSwapModal && onEquipmentSwap && (
        <div
          className="fixed inset-0 z-[80] bg-black/60 flex items-end sm:items-center justify-center px-4 animate-fade-in"
          onClick={() => setShowSwapModal(false)}
        >
          <div
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
          >
            <div className="mb-4">
              <h3 className="text-[18px] font-black text-[#1B4332]">
                {t("beginner_mode.swap.modal.title")}
              </h3>
              <p className="text-[12px] text-gray-500 mt-1">
                {t("beginner_mode.swap.modal.subtitle")}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {swapAlternatives.map((altName) => (
                <button
                  key={altName}
                  type="button"
                  onClick={() => {
                    setShowSwapModal(false);
                    onEquipmentSwap(altName);
                  }}
                  className="w-full text-left px-4 py-3.5 rounded-2xl border border-gray-200 bg-white active:scale-[0.98] transition-transform hover:bg-emerald-50/30"
                >
                  <span className="text-[15px] font-bold text-[#1B4332]">
                    {getExerciseName(altName, locale)}
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowSwapModal(false)}
              className="w-full mt-4 py-3 text-[13px] font-bold text-gray-500 active:opacity-60 transition-opacity"
            >
              {t("beginner_mode.swap.modal.cancel")}
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
