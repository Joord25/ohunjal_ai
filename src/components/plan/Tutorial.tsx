"use client";

import React, { useState } from "react";
import { WorkoutHistory } from "@/constants/workout";
import { type IntensityLevel, getIntensityRecommendation } from "@/utils/workoutMetrics";

interface CoachTooltipProps {
  recentHistory: WorkoutHistory[];
  intensityRec: { nextRecommended: IntensityLevel } | null;
  onDismiss: () => void;
}

export const CoachTooltip: React.FC<CoachTooltipProps> = ({ recentHistory, intensityRec, onDismiss }) => {
  const isFirstTime = recentHistory.length === 0;

  const message = (() => {
    if (isFirstTime) {
      return {
        greeting: "반가워요! 함께 할 수 있어 기쁘네요 :)",
        body: "ACSM 국제 스포츠의학 기관, 한국체육대학교, 그리고 건강운동관리사 가이드라인과 현직 10년 이상의 트레이닝 노하우, 최근 5년 내 500건 이상의 SCI급 연구 논문들을 학습한 제가 하나하나 도와드릴테니 믿고 따라와주세요!",
      };
    }
    const lastSession = recentHistory[0];
    const daysSinceLast = Math.floor((Date.now() - new Date(lastSession.date).getTime()) / (1000 * 60 * 60 * 24));
    const nextIntensity = intensityRec?.nextRecommended === "high" ? "고강도" : intensityRec?.nextRecommended === "moderate" ? "중강도" : "저강도";

    if (daysSinceLast === 0) {
      return { greeting: "오늘 또 운동오셨군요!", body: "이미 오늘 운동하셨는데 부족했나보네요. 그것도 좋아요. 몸 상태부터 체크할게요." };
    } else if (daysSinceLast === 1) {
      return { greeting: "이틀 연속이네요! 잘한다! 잘한다! 잘한다!", body: `오늘은 ${nextIntensity} 세션을 추천드려요. 몸 상태부터 확인할게요.` };
    } else if (daysSinceLast <= 3) {
      return { greeting: "다시 오셨네요!", body: `${daysSinceLast}일 만이에요. 오늘 ${nextIntensity} 세션 어떠세요?` };
    } else {
      return { greeting: `${daysSinceLast}일 만이에요!`, body: "충분히 쉬셨으니 가볍게 시작해볼까요? 몸 상태부터 알려주세요." };
    }
  })();

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center animate-fade-in" onClick={onDismiss}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      <div className="bg-white rounded-2xl px-5 py-5 shadow-2xl mx-6 relative z-10">
        <p className="text-emerald-600 text-[11px] font-bold tracking-wider uppercase mb-2">오운잘 코치</p>
        <p className="text-[15px] font-black text-[#1B4332] leading-snug">{message.greeting}</p>
        <p className="text-[12.5px] text-gray-600 leading-relaxed mt-1.5 whitespace-pre-line">{message.body}</p>
        <p className="text-[10px] text-gray-400 mt-3 font-medium">탭하여 닫기</p>
      </div>
    </div>
  );
};
