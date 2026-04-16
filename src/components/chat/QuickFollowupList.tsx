"use client";

/**
 * QuickFollowupList — "추천 후속 질문" 세로 리스트.
 * 답변보다 낮은 층위(회색, 테두리 없음)로 시각 위계 유지.
 * Phase A: ChatHome / NutritionTab 공통 사용.
 */

import React from "react";
import { ChipIcon, type ChipIconType } from "./ChipIcon";

export type FollowupItem = { icon: ChipIconType; label: string; prompt: string };

export const QuickFollowupList: React.FC<{
  locale: "ko" | "en";
  items: FollowupItem[];
  onTap: (prompt: string) => void;
}> = ({ locale, items, onTap }) => (
  <div className="mt-3">
    <p className="text-[10px] font-medium text-gray-400 mb-1 px-0.5">
      {locale === "en" ? "Recommended follow-ups" : "추천 후속 질문"}
    </p>
    <div className="flex flex-col">
      {items.map((f, i) => (
        <button
          key={f.label}
          onClick={() => onTap(f.prompt)}
          className={`w-full flex items-center gap-2.5 py-2 px-0.5 text-left active:opacity-60 transition-opacity ${
            i < items.length - 1 ? "border-b border-gray-100" : ""
          }`}
        >
          <span className="text-gray-400 shrink-0">
            <ChipIcon type={f.icon} />
          </span>
          <span className="text-[12px] text-gray-500 flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
            {f.label}
          </span>
          <svg className="w-2.5 h-2.5 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ))}
    </div>
  </div>
);
