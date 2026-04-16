"use client";

/**
 * AssistantMiniHeader — 각 AI 메시지 위에 붙는 미니 화자 표시.
 * 마누스식 "logo + name + (선택) plan label" 한 줄.
 * Phase A: ChatHome / NutritionTab 공통 사용.
 */

import React from "react";

export const AssistantMiniHeader: React.FC<{
  locale: "ko" | "en";
  planLabel?: string;
}> = ({ locale, planLabel }) => (
  <div className="flex items-center gap-1.5 mb-1">
    <img src="/favicon_backup.png" alt="AI" className="w-5 h-5 rounded-full" />
    <span className="text-[11.5px] font-black text-[#1B4332]">
      {locale === "en" ? "Ohunjal" : "오운잘"}
    </span>
    {planLabel && (
      <span className="px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[9px] font-bold">
        {planLabel}
      </span>
    )}
  </div>
);
