"use client";

/**
 * WeightHub — 회의 ζ-5 (2026-04-30) ROOT 카드 → 웨이트 진입판 풀스크린.
 * RunningProgramSheet 디자인 패턴 미러링 (caption + h1 + 카드 톤 통일).
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
  // 회의 ζ-5 (2026-04-30): body_picker 는 바텀시트 X → 같은 화면 다음 step (러닝 패턴)
  const [step, setStep] = useState<"list" | "body_picker">("list");

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
      setStep("body_picker");
      return;
    }
    onStartCatalog(item);
  };

  const handleMuscleSelect = (muscle: TargetMuscle) => {
    onStartCatalog(bodyPickerCard, { muscle });
  };

  const handleBack = () => {
    if (step === "body_picker") {
      setStep("list");
      return;
    }
    onBack();
  };

  const label = (item: CatalogItem) => locale === "en" ? item.labelEn : item.labelKo;

  return (
    <div className="h-full w-full bg-white flex flex-col">
      {/* 헤더 — RunningProgramSheet 패턴: 좌(뒤로) + 우(북마크/프로필). 가운데 타이틀 X */}
      <div className="flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 border-b border-gray-50">
        <button
          onClick={handleBack}
          aria-label="뒤로가기"
          className="p-2 text-[#1B4332] active:scale-[0.94] transition-transform"
        >
          {ICON_BACK}
        </button>
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

      {/* 본문 — px-6 pt-6 pb-10 (RunningProgramSheet 미러) */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10">
        {step === "list" ? (
          <>
            {/* caption + h1 + subtitle */}
            <div className="mb-5">
              <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-400">
                WEIGHT TRAINING
              </p>
              <h1 className="text-3xl font-black text-[#1B4332] mt-1">
                {locale === "en" ? "Weight" : "웨이트"}
              </h1>
              <p className="text-[13px] text-gray-500 mt-3 leading-relaxed">
                {locale === "en" ? "Pick one and start today" : "오늘 한 가지 골라 시작하세요"}
              </p>
            </div>

            {/* 칩 탭 — 운동 목적 다르게 선택 */}
            <div className="flex gap-2 mb-5 overflow-x-auto -mx-1 px-1">
              {CHIP_GOALS.map((g) => {
                const active = selectedGoal === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGoal(g.id)}
                    className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12.5px] font-black transition ${
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

            {/* 카탈로그 카드 — 한 페이지 ≤ 4. RunningProgramSheet 카드 톤 미러 */}
            <div className="flex flex-col gap-3">
              {cards.map((item) => {
                const isBodyPicker = item.kind === "body_picker";
                const rightTag = isBodyPicker
                  ? (locale === "en" ? "TODAY" : "오늘")
                  : item.weeks > 0 ? `${item.weeks}${locale === "en" ? "W" : "주"}` : null;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleCardClick(item)}
                    className="w-full bg-white border border-gray-100 rounded-3xl shadow-sm px-6 py-5 active:scale-[0.98] transition-transform hover:bg-gray-50 text-left"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xl font-black text-[#1B4332] leading-tight">
                        {label(item)}
                      </span>
                      {rightTag && (
                        <span className="shrink-0 text-[10px] font-black tracking-[0.15em] uppercase text-[#2D6A4F] whitespace-nowrap">
                          {rightTag}
                        </span>
                      )}
                    </div>
                    {item.descriptionKo && (
                      <p className="text-[12.5px] text-gray-500 mt-1.5 leading-relaxed">
                        {locale === "en" ? "" : item.descriptionKo}
                      </p>
                    )}
                  </button>
                );
              })}
              {cards.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-12">
                  {locale === "en" ? "No programs match. Try another goal chip." : "조건에 맞는 프로그램이 없습니다. 다른 목적 칩을 눌러보세요."}
                </p>
              )}
            </div>
          </>
        ) : (
          // 회의 ζ-5: body_picker step — 풀스크린 다음 페이지 (러닝 패턴 미러)
          <>
            <div className="mb-5">
              <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-400">
                BODY PART
              </p>
              <h1 className="text-3xl font-black text-[#1B4332] mt-1">
                {locale === "en" ? "Pick one" : "오늘 운동할 부위"}
              </h1>
              <p className="text-[13px] text-gray-500 mt-3 leading-relaxed">
                {locale === "en" ? "5-split pattern · single session today" : "5분할 · 오늘 단일 세션"}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {MUSCLE_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleMuscleSelect(m.id)}
                  className="w-full bg-white border border-gray-100 rounded-3xl shadow-sm px-6 py-5 active:scale-[0.98] transition-transform hover:bg-gray-50 text-left"
                >
                  <span className="text-xl font-black text-[#1B4332] leading-tight">
                    {locale === "en" ? m.en : m.ko}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
