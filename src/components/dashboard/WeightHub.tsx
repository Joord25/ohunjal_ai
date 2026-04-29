"use client";

/**
 * WeightHub — 회의 ζ-5 (2026-04-30) ROOT 카드 → 웨이트 진입판 풀스크린.
 * 러닝 진입판(RunningHub) 패턴 미러링 + programCatalog SSOT 기반 큐레이션.
 *
 * 디자인 룰:
 * - 한 페이지 ≤ 4 카드
 * - 부위별 1 카드 = 그날 단발 (5개 부위 선택 시트)
 * - 목적별·캠페인 = onboarding goal·gender·시즌 매칭
 * - 상단 칩 탭 (다이어트/근력향상/건강) — 사용자가 다른 목적 카탈로그 탐색 가능
 */
import React, { useMemo, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  PROGRAM_CATALOG,
  getMatchedCatalog,
  type CatalogItem,
  type OnboardingGoal,
} from "@/constants/programCatalog";
import type { TargetMuscle } from "@/constants/workout";

interface WeightHubProps {
  isLoggedIn: boolean;
  isPremium: boolean;
  hasActivePrograms: boolean;
  onboardingGoal: OnboardingGoal;
  gender?: "male" | "female";
  experienceMonths?: number;
  onBack: () => void;
  onOpenMyPlans: () => void;
  onOpenProfile: () => void;
  /** 카탈로그 카드 클릭 핸들러. body_picker 는 muscle 동봉 */
  onStartCatalog: (item: CatalogItem, opt?: { muscle?: TargetMuscle }) => void;
  onRequestLogin: () => void;
  onRequestPaywall: () => void;
}

const ICON_BACK = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M15 6l-6 6 6 6" />
  </svg>
);
const ICON_MY_PLANS = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M6 4h12a1 1 0 011 1v16l-7-4-7 4V5a1 1 0 011-1z" />
  </svg>
);
const ICON_PROFILE = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="9" r="3.5" />
    <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
  </svg>
);

const CHIP_GOALS: { id: OnboardingGoal; ko: string; en: string }[] = [
  { id: "fat_loss", ko: "다이어트", en: "Fat Loss" },
  { id: "muscle_gain", ko: "근력향상", en: "Muscle Gain" },
  { id: "health", ko: "건강", en: "Health" },
];

const MUSCLE_OPTIONS: { id: TargetMuscle; ko: string; en: string }[] = [
  { id: "chest", ko: "가슴", en: "Chest" },
  { id: "back", ko: "등", en: "Back" },
  { id: "shoulders", ko: "어깨", en: "Shoulders" },
  { id: "arms", ko: "팔", en: "Arms" },
  { id: "legs", ko: "하체", en: "Legs" },
];

export const WeightHub: React.FC<WeightHubProps> = ({
  hasActivePrograms,
  onboardingGoal,
  gender,
  experienceMonths,
  onBack,
  onOpenMyPlans,
  onOpenProfile,
  onStartCatalog,
}) => {
  const { locale } = useTranslation();
  const [selectedGoal, setSelectedGoal] = useState<OnboardingGoal>(
    // endurance 는 러닝 카탈로그 영역 → 기본을 fat_loss 로 fallback
    onboardingGoal === "endurance" ? "fat_loss" : onboardingGoal
  );
  const [bodyPickerOpen, setBodyPickerOpen] = useState(false);

  const cards = useMemo<CatalogItem[]>(() => {
    return getMatchedCatalog({
      goal: selectedGoal,
      gender,
      currentMonth: new Date().getMonth() + 1,
      experienceMonths,
    });
  }, [selectedGoal, gender, experienceMonths]);

  const bodyPickerCard = PROGRAM_CATALOG.find((c) => c.kind === "body_picker")!;

  const handleCardClick = (item: CatalogItem) => {
    if (item.kind === "body_picker") {
      setBodyPickerOpen(true);
      return;
    }
    onStartCatalog(item);
  };

  const handleMuscleSelect = (muscle: TargetMuscle) => {
    setBodyPickerOpen(false);
    onStartCatalog(bodyPickerCard, { muscle });
  };

  const label = (item: CatalogItem) => locale === "en" ? item.labelEn : item.labelKo;

  return (
    <div className="h-full w-full bg-[#FAFBF9] flex flex-col">
      {/* 헤더 — pt safe-area 고려 */}
      <div className="flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 bg-white">
        <button
          onClick={onBack}
          aria-label="뒤로가기"
          className="p-2 text-[#1B4332] active:scale-[0.94] transition-transform"
        >
          {ICON_BACK}
        </button>
        <h1 className="text-lg font-black text-[#1B4332]">
          {locale === "en" ? "Weight" : "웨이트"}
        </h1>
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenMyPlans}
            aria-label="내 플랜"
            className="relative p-2 text-[#1B4332] active:scale-[0.94] transition-transform"
          >
            {ICON_MY_PLANS}
            {hasActivePrograms && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />}
          </button>
          <button
            onClick={onOpenProfile}
            aria-label="프로필"
            className="p-2 text-[#1B4332] active:scale-[0.94] transition-transform"
          >
            {ICON_PROFILE}
          </button>
        </div>
      </div>

      {/* 칩 탭 — 운동 목적 다르게 선택 */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto bg-white border-b border-gray-100">
        {CHIP_GOALS.map((g) => {
          const active = selectedGoal === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setSelectedGoal(g.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition ${
                active
                  ? "bg-[#1B4332] text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {locale === "en" ? g.en : g.ko}
            </button>
          );
        })}
      </div>

      {/* 카탈로그 카드 — 한 페이지 ≤ 4 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {cards.map((item) => {
          const isBodyPicker = item.kind === "body_picker";
          return (
            <button
              key={item.id}
              onClick={() => handleCardClick(item)}
              className={`w-full text-left rounded-3xl p-5 transition active:scale-[0.99] ${
                isBodyPicker
                  ? "bg-white border-2 border-[#1B4332]"
                  : "bg-white border border-gray-100 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-base font-black text-[#1B4332] mb-1">
                    {label(item)}
                  </p>
                  {item.descriptionKo && (
                    <p className="text-xs text-gray-500">
                      {locale === "en" ? "" : item.descriptionKo}
                    </p>
                  )}
                </div>
                {item.weeks > 0 && (
                  <span className="flex-shrink-0 text-[11px] font-bold text-[#2D6A4F] bg-emerald-50 px-2 py-1 rounded-lg">
                    {item.weeks}{locale === "en" ? "W" : "주"}
                  </span>
                )}
                {isBodyPicker && (
                  <span className="flex-shrink-0 text-[11px] font-bold text-[#1B4332] bg-emerald-50 px-2 py-1 rounded-lg">
                    {locale === "en" ? "Today" : "오늘"}
                  </span>
                )}
              </div>
            </button>
          );
        })}
        {cards.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-12">
            {locale === "en" ? "No programs match. Try another goal chip." : "조건에 맞는 프로그램이 없습니다. 다른 목적 칩을 눌러보세요."}
          </p>
        )}
      </div>

      {/* 부위별 시트 — body_picker 클릭 시 */}
      {bodyPickerOpen && (
        <div
          className="absolute inset-0 z-50 flex items-end bg-black/40"
          onClick={() => setBodyPickerOpen(false)}
        >
          <div
            className="w-full bg-white rounded-t-3xl p-5 pb-[max(env(safe-area-inset-bottom),20px)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-base font-black text-[#1B4332]">
                {locale === "en" ? "Pick a body part" : "오늘 운동할 부위"}
              </p>
              <button
                onClick={() => setBodyPickerOpen(false)}
                className="text-sm text-gray-400"
              >
                {locale === "en" ? "Cancel" : "취소"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              {locale === "en" ? "5-split pattern · single session today" : "5분할 · 오늘 단일 세션"}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {MUSCLE_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleMuscleSelect(m.id)}
                  className="py-4 rounded-2xl bg-gray-50 border border-gray-100 text-base font-bold text-[#1B4332] active:scale-[0.97] transition"
                >
                  {locale === "en" ? m.en : m.ko}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
