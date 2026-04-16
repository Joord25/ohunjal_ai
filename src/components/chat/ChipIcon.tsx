"use client";

/**
 * ChipIcon — 채팅 UI 공통 아이콘 세트.
 * ChatHome / NutritionTab / 기타 채팅 컴포넌트에서 재사용.
 * Phase A (회의 X): 공통 모듈 추출.
 */

import React from "react";

export type ChipIconType =
  | "chest" | "home" | "run" | "legs" | "diet" | "back" | "full"
  | "cycle" | "shoulder" | "posture" | "calendar" | "creatine" | "pump"
  | "sleep" | "food" | "plateau" | "split" | "protein" | "flame" | "swap" | "timer";

export const ChipIcon: React.FC<{ type: ChipIconType }> = ({ type }) => {
  const paths: Record<ChipIconType, string> = {
    chest: "M12 3l8 4v6c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7l8-4z",
    legs: "M6 3v8l2 10h3l-1-10h2l-1 10h3l2-10V3",
    run: "M13 4a2 2 0 110 4 2 2 0 010-4zM8 21l3-7 2 3 4-1",
    home: "M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1V10z",
    diet: "M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M16 12a4 4 0 11-8 0 4 4 0 018 0z",
    back: "M6 3v18M10 6h8M10 10h8M10 14h8M10 18h8",
    full: "M12 2l2.4 5.4L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.6-1.6L12 2z",
    cycle: "M12 4a8 8 0 11-8 8M4 4v5h5M20 4l-8 8",
    shoulder: "M4 14c2-6 6-8 8-8s6 2 8 8M4 14v4h16v-4",
    posture: "M8 3a2 2 0 104 0 2 2 0 00-4 0zM10 7c-2 2-4 3-4 6l2 0 1 8h3l-1-8h2l1 8h3l-1-8 2 0c0-3-2-4-4-6",
    calendar: "M4 6h16v14H4V6zM8 3v4M16 3v4M4 10h16",
    creatine: "M9 3h6v4l3 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9l3-2V3zM9 13h6",
    pump: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    sleep: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
    food: "M3 8h18M6 8V6a2 2 0 012-2h8a2 2 0 012 2v2M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12",
    plateau: "M3 17l6-6 4 4 8-8M14 7h7v7",
    split: "M4 6h6v4H4zM14 6h6v4h-6zM4 14h6v6H4zM14 14h6v6h-6z",
    protein: "M12 2a3 3 0 00-3 3v2H6a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-3V5a3 3 0 00-3-3z",
    flame: "M8.5 14.5A2.5 2.5 0 0011 17c1 0 1.8-.5 2.5-1.5C14 12 12 10 14 8c0-1.5-.5-3-2-4.5-.5 2-1 3-2 4s-2 2.5-2 4 .5 2 1 3zM12 2v3",
    swap: "M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4",
    timer: "M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z",
  };
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[type]} />
    </svg>
  );
};
