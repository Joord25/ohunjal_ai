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
    <div className="flex items-center justify-center h-[100dvh] sm:min-h-screen bg-[#FAFBF9] sm:bg-gray-100">
      {/* Content Container (Responsive: Full on mobile, Fixed on desktop) */}
      <div
        className="relative overflow-hidden w-full h-[100dvh] sm:w-[384px] sm:h-[824px] bg-white shadow-2xl transition-all duration-300 sm:rounded-[40px]"
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
