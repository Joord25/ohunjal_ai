"use client";

import React from "react";
import { LAYOUT, THEME } from "@/constants/theme";
import { PullToRefresh } from "@/components/PullToRefresh";

interface PhoneFrameProps {
  children: React.ReactNode;
  pullToRefresh?: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, pullToRefresh = true }) => {
  return (
    <div className="flex items-stretch sm:items-center justify-center h-[100dvh] bg-[#FAFBF9] sm:bg-gray-100">
      {/* 회의 ζ-3 (2026-04-28): 'calc(100dvh - env())' 폐기 → 100svh 채택 (안드 PWA env()=0 회귀 fix).
          대표 지시 2026-05-06: 100svh 도 iOS Safari chrome 가린 상태에서 viewport 작아져 BottomTabs 위 빈 공간 발생.
          → 100dvh 단독 사용. 안드 PWA 회귀 우려는 useSafeArea 패턴(--safe-area-bottom 48px 강제 set)이 BottomTabs/콘텐츠 paddingBottom 으로 nav 회피 책임짐. */}
      <div
        className="relative overflow-hidden w-full h-[100dvh] sm:w-[415px] sm:shadow-lg"
        style={{
          backgroundColor: THEME.bg,
        }}
      >
        {/* Content Area */}
        <main
          className="relative w-full h-full flex flex-col animate-fade-in overflow-hidden"
        >
          <PullToRefresh enabled={pullToRefresh}>
            {children}
          </PullToRefresh>
        </main>
      </div>
    </div>
  );
};
