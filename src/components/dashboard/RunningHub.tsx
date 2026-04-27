"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { RunningProgramSheet } from "./RunningProgramSheet";

interface RunningHubProps {
  isLoggedIn: boolean;
  isPremium: boolean;
  hasActivePrograms: boolean;
  /** 회의 2026-04-27: 진행 중 러닝 프로그램 — select 화면에 "이어가기" 카드로 표시 */
  activeRunningPrograms?: Array<{ programId: string; programName: string; completed: number; total: number; nextSession: { id: string } | null }>;
  onBack: () => void;
  onOpenMyPlans: () => void;
  onOpenProfile: () => void;
  onResumeProgram: (programId: string, nextSessionId: string) => void;
  onRequestLogin: () => void;
  onRequestPaywall: () => void;
}

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

/**
 * 회의 2026-04-27: ROOT 카드 → 러닝 진입판 풀스크린 화면.
 * 회의 2026-04-28: 프로그램 생성 완료 시 자체 완료 화면 폐기 → 곧바로 onOpenMyPlans 호출하여 내플랜으로 직행.
 */
export const RunningHub: React.FC<RunningHubProps> = ({
  isLoggedIn,
  isPremium,
  hasActivePrograms,
  activeRunningPrograms,
  onBack,
  onOpenMyPlans,
  onOpenProfile,
  onResumeProgram,
  onRequestLogin,
  onRequestPaywall,
}) => {
  const { t } = useTranslation();

  // 회의 2026-04-28: 우상단 [📋][👤]를 absolute에서 RunningProgramSheet 헤더 슬롯(headerRight)로 이동.
  // 헤더 콘텐츠와 정렬 맞아 시각 정돈. 아이콘 보더/배경 제거하고 단순 아이콘 버튼으로 톤 정리.
  const headerIcons = (
    <>
      <button
        onClick={onOpenMyPlans}
        aria-label={t("root.myPlan.aria")}
        className="relative p-2 text-[#1B4332] active:scale-[0.94] transition-transform"
      >
        {ICON_MY_PLANS}
        {hasActivePrograms && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />}
      </button>
      <button
        onClick={onOpenProfile}
        aria-label={t("root.profile.aria")}
        className="p-2 text-[#1B4332] active:scale-[0.94] transition-transform"
      >
        {ICON_PROFILE}
      </button>
    </>
  );

  return (
    <div className="h-full w-full bg-white">
      <RunningProgramSheet
        open
        variant="fullscreen"
        onClose={onBack}
        onProgramCreated={() => onOpenMyPlans()}
        isLoggedIn={isLoggedIn}
        isPremium={isPremium}
        onRequestLogin={onRequestLogin}
        onRequestPaywall={onRequestPaywall}
        activePrograms={activeRunningPrograms}
        onResumeProgram={onResumeProgram}
        headerRight={headerIcons}
      />
    </div>
  );
};
