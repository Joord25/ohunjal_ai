"use client";

/**
 * AdviceCard — 회의 57 후속: ChatHome의 advice 모드 응답 렌더링.
 * 마스터플랜 스타일 섹션 카드 + 하단 "오늘 운동" CTA.
 * 이모지 금지, SVG·라벨만 사용.
 */

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

export interface AdviceContent {
  headline: string;
  goals: string[];
  intensity?: string[];
  monthProgram?: {
    week1?: string;
    week2?: string;
    week3?: string;
    week4?: string;
  };
  principles: string[];
  criticalPoints?: string[];
  supplements?: string[];
  conclusion?: string[];
  recommendedWorkout: {
    condition: {
      bodyPart: "upper_stiff" | "lower_heavy" | "full_fatigue" | "good";
      energyLevel: 1 | 2 | 3 | 4 | 5;
      availableTime: 30 | 50 | 90;
      bodyWeightKg?: number;
      gender?: "male" | "female";
      birthYear?: number;
    };
    goal: "fat_loss" | "muscle_gain" | "strength" | "general_fitness";
    sessionMode: "balanced" | "split" | "running" | "home_training";
    targetMuscle?: "chest" | "back" | "shoulders" | "arms" | "legs";
    runType?: "interval" | "easy" | "long";
    intensityOverride?: "high" | "moderate" | "low";
    reasoning: string;
  };
}

interface AdviceCardProps {
  advice: AdviceContent;
  onStartRecommended: () => void | Promise<void>;
  starting?: boolean;
}

/** 섹션 한 블록 — 라벨 + bullet 리스트 */
const Section: React.FC<{ label: string; items: string[] }> = ({ label, items }) => {
  if (items.length === 0) return null;
  return (
    <div className="border-t border-gray-100 pt-3 mt-3 first:border-t-0 first:pt-0 first:mt-0">
      <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase mb-1.5">{label}</p>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="text-[12.5px] text-[#1B4332] leading-relaxed flex gap-1.5">
            <span className="text-[#2D6A4F] shrink-0">·</span>
            <span className="flex-1">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/** 주간 프로그램 (4주) — 칩 스타일 */
const WeekRow: React.FC<{ label: string; content?: string }> = ({ label, content }) => {
  if (!content) return null;
  return (
    <div className="flex gap-2 items-start py-1">
      <span className="text-[10px] font-black text-[#2D6A4F] tracking-wider shrink-0 w-12 pt-0.5">{label}</span>
      <span className="text-[12.5px] text-[#1B4332] leading-relaxed flex-1">{content}</span>
    </div>
  );
};

/** 추천 운동 요약 라벨 빌더 */
function buildRecSummary(
  rec: AdviceContent["recommendedWorkout"],
  locale: "ko" | "en",
): string {
  const muscleKo: Record<string, string> = {
    chest: "가슴", back: "등", shoulders: "어깨", arms: "팔", legs: "하체",
  };
  const muscleEn: Record<string, string> = {
    chest: "chest", back: "back", shoulders: "shoulders", arms: "arms", legs: "legs",
  };
  const runKo: Record<string, string> = { interval: "인터벌", easy: "쉬운 러닝", long: "롱런" };
  const runEn: Record<string, string> = { interval: "interval", easy: "easy run", long: "long run" };

  let part: string;
  if (rec.sessionMode === "running") {
    part = locale === "en"
      ? (rec.runType ? runEn[rec.runType] : "run")
      : (rec.runType ? runKo[rec.runType] : "러닝");
  } else if (rec.sessionMode === "home_training") {
    part = locale === "en" ? "home workout" : "홈트";
  } else if (rec.sessionMode === "split" && rec.targetMuscle) {
    part = locale === "en" ? muscleEn[rec.targetMuscle] : muscleKo[rec.targetMuscle];
  } else {
    part = locale === "en" ? "full body" : "전신";
  }
  return `${part} · ${rec.condition.availableTime}${locale === "en" ? " min" : "분"}`;
}

export const AdviceCard: React.FC<AdviceCardProps> = ({ advice, onStartRecommended, starting }) => {
  const { t, locale } = useTranslation();
  const recLabel = buildRecSummary(advice.recommendedWorkout, locale as "ko" | "en");

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden my-1">
      {/* 헤더 */}
      <div className="px-4 pt-3 pb-3 border-b border-gray-100">
        <p className="text-[10px] font-black text-gray-400 tracking-[0.25em] uppercase">
          {t("advice.header")}
        </p>
        {advice.headline && (
          <h3 className="text-[15px] font-black text-[#1B4332] mt-1 leading-tight">
            {advice.headline}
          </h3>
        )}
      </div>

      {/* 본문 */}
      <div className="px-4 py-3">
        <Section label={t("advice.section.goals")} items={advice.goals} />
        {advice.intensity && advice.intensity.length > 0 && (
          <Section label={t("advice.section.intensity")} items={advice.intensity} />
        )}

        {advice.monthProgram && (
          <div className="border-t border-gray-100 pt-3 mt-3">
            <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase mb-1.5">
              {t("advice.section.monthProgram")}
            </p>
            <div className="space-y-0.5">
              <WeekRow label="WEEK 1" content={advice.monthProgram.week1} />
              <WeekRow label="WEEK 2" content={advice.monthProgram.week2} />
              <WeekRow label="WEEK 3" content={advice.monthProgram.week3} />
              <WeekRow label="WEEK 4" content={advice.monthProgram.week4} />
            </div>
          </div>
        )}

        <Section label={t("advice.section.principles")} items={advice.principles} />
        {advice.criticalPoints && advice.criticalPoints.length > 0 && (
          <Section label={t("advice.section.criticalPoints")} items={advice.criticalPoints} />
        )}
        {advice.supplements && advice.supplements.length > 0 && (
          <Section label={t("advice.section.supplements")} items={advice.supplements} />
        )}
        {advice.conclusion && advice.conclusion.length > 0 && (
          <Section label={t("advice.section.conclusion")} items={advice.conclusion} />
        )}
      </div>

      {/* 하단 CTA — 오늘 운동 */}
      <div className="px-4 py-3 border-t border-gray-100 bg-[#FAFBF9]">
        {advice.recommendedWorkout.reasoning && (
          <p className="text-[11px] text-gray-500 leading-relaxed mb-2">
            {advice.recommendedWorkout.reasoning}
          </p>
        )}
        <button
          onClick={onStartRecommended}
          disabled={starting}
          className={`w-full py-3 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-2 ${
            starting
              ? "bg-gray-200 text-gray-400"
              : "bg-[#1B4332] text-white active:scale-[0.98] hover:bg-[#2D6A4F]"
          }`}
        >
          <span>{t("advice.startCTA")}</span>
          <span className="opacity-70">·</span>
          <span className="font-normal">{recLabel}</span>
        </button>
      </div>
    </div>
  );
};
