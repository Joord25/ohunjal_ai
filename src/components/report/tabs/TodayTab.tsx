"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

// 음식 비유 풀 (현지화)
const FOOD_ANALOGIES_KO = [
  { food: "치킨 한 조각", cal: 250 },
  { food: "밥 한 공기", cal: 300 },
  { food: "아이스 아메리카노 4잔", cal: 40 },
  { food: "초코파이 3개", cal: 120 },
  { food: "소주 2잔", cal: 130 },
  { food: "라면 한 그릇", cal: 500 },
  { food: "바나나 4개", cal: 100 },
  { food: "삼겹살 2인분", cal: 500 },
  { food: "떡볶이 1인분", cal: 450 },
  { food: "프로틴 쉐이크 2잔", cal: 200 },
];

const FOOD_ANALOGIES_EN = [
  { food: "a slice of pizza", cal: 270 },
  { food: "a bowl of rice", cal: 300 },
  { food: "4 iced coffees", cal: 40 },
  { food: "3 chocolate bars", cal: 120 },
  { food: "2 glasses of wine", cal: 125 },
  { food: "a bowl of ramen", cal: 500 },
  { food: "4 bananas", cal: 100 },
  { food: "a cheeseburger", cal: 350 },
  { food: "a serving of fries", cal: 365 },
  { food: "2 protein shakes", cal: 200 },
];

function getFoodAnalogy(calBurned: number, locale: string): string {
  const pool = locale === "ko" ? FOOD_ANALOGIES_KO : FOOD_ANALOGIES_EN;
  // 가장 근접한 음식 * N 개 조합 찾기
  let best = pool[0];
  let bestDiff = Infinity;
  for (const item of pool) {
    const servings = Math.round(calBurned / item.cal);
    if (servings >= 1 && servings <= 5) {
      const diff = Math.abs(calBurned - item.cal * servings);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = item;
      }
    }
  }
  const servings = Math.max(1, Math.round(calBurned / best.cal));
  if (servings === 1) return best.food;
  // "치킨 한 조각" 형태면 숫자를 교체
  if (locale === "ko") {
    // 이미 숫자가 포함된 경우 그대로
    if (/\d/.test(best.food)) return best.food;
    return `${best.food} ${servings}개분`;
  }
  return `${servings}x ${best.food}`;
}

export interface TodayTabProps {
  /** 세션 카테고리 */
  sessionCategory: "strength" | "cardio" | "mobility" | "mixed";
  /** 오늘 총 볼륨 (kg) */
  totalVolume: number;
  /** 지난 세션 대비 볼륨 변화 % (null = 비교 불가) */
  volumeChangePercent: number | null;
  /** 유저 목표 */
  goal?: string;
  /** 체중 (kg) */
  bodyWeightKg?: number;
  /** 총 운동 시간 (초) */
  totalDurationSec: number;
  /** 피로 드롭 % */
  fatigueDrop: number | null;
  /** 러닝: 페이스 변화 (초, 음수 = 빨라짐) */
  paceChangeSec?: number | null;
  /** 러닝: 거리 변화 (km) */
  distanceChangeKm?: number | null;
  /** 러닝 여부 */
  isRunning?: boolean;
}

/** 칼로리 추정 (MET 기반 간이 계산) */
function estimateCalories(
  sessionCategory: string,
  totalDurationSec: number,
  bodyWeightKg: number,
): number {
  // MET 범위: 근력 3.5-6, 러닝 7-10, 스트레칭 2.5
  const metMap: Record<string, number> = {
    strength: 4.5,
    mixed: 4.5,
    cardio: 8.0,
    mobility: 2.5,
  };
  const met = metMap[sessionCategory] ?? 4.0;
  const hours = totalDurationSec / 3600;
  return Math.round(met * bodyWeightKg * hours);
}

/** 회복 시간 추정 (시간) */
function estimateRecoveryHours(fatigueDrop: number | null, totalVolume: number): string {
  if (fatigueDrop === null) return "24";
  if (fatigueDrop >= 0) return "12";
  if (fatigueDrop > -15) return "24";
  if (fatigueDrop > -25) return "48";
  return "48~72";
}

/** [오늘] 탭 — 2x2 그리드 (회의 37) */
export const TodayTab: React.FC<TodayTabProps> = ({
  sessionCategory,
  totalVolume,
  volumeChangePercent,
  goal,
  bodyWeightKg,
  totalDurationSec,
  fatigueDrop,
  paceChangeSec,
  distanceChangeKm,
  isRunning,
}) => {
  const { t, locale } = useTranslation();

  const bw = bodyWeightKg ?? 70;
  const calBurned = estimateCalories(sessionCategory, totalDurationSec, bw);
  const foodAnalogy = getFoodAnalogy(calBurned, locale);
  const recoveryHours = estimateRecoveryHours(fatigueDrop, totalVolume);

  // 목표 연결 자극 메시지
  const getStimulusMessage = (): string => {
    if (isRunning) {
      if (paceChangeSec !== null && paceChangeSec !== undefined && paceChangeSec < 0) {
        return t("report.today.stimulus.fasterPace");
      }
      return t("report.today.stimulus.cardioGood");
    }
    if (volumeChangePercent === null) return t("report.today.stimulus.firstRecord");
    if (volumeChangePercent > 0) {
      if (goal === "fat_loss") return t("report.today.stimulus.fatLossUp");
      if (goal === "muscle_gain") return t("report.today.stimulus.muscleUp");
      return t("report.today.stimulus.generalUp");
    }
    if (volumeChangePercent === 0) return t("report.today.stimulus.maintained");
    return t("report.today.stimulus.lightDay");
  };

  // vs 지난주 메시지
  const getVsLastMessage = (): { label: string; value: string } => {
    if (isRunning) {
      if (distanceChangeKm !== null && distanceChangeKm !== undefined) {
        const sign = distanceChangeKm > 0 ? "+" : "";
        return {
          label: t("report.today.vsLast.distance"),
          value: `${sign}${distanceChangeKm.toFixed(1)}km`,
        };
      }
      if (paceChangeSec !== null && paceChangeSec !== undefined) {
        const sign = paceChangeSec < 0 ? "" : "+";
        return {
          label: t("report.today.vsLast.pace"),
          value: `${sign}${paceChangeSec}${t("report.today.vsLast.secUnit")}`,
        };
      }
    }
    if (volumeChangePercent !== null) {
      const sign = volumeChangePercent > 0 ? "+" : "";
      return {
        label: t("report.today.vsLast.volume"),
        value: `${sign}${volumeChangePercent}%`,
      };
    }
    return {
      label: t("report.today.vsLast.volume"),
      value: t("report.today.vsLast.first"),
    };
  };

  const vsLast = getVsLastMessage();

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {/* 자극 */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-1.5 mb-2">
          <svg className="w-4 h-4 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
            {isRunning ? t("report.today.pace") : t("report.today.stimulus")}
          </p>
        </div>
        <p className="text-lg font-black text-[#1B4332] leading-tight">
          {isRunning
            ? (paceChangeSec !== null && paceChangeSec !== undefined
                ? `${Math.abs(paceChangeSec)}${t("report.today.vsLast.secUnit")} ${paceChangeSec < 0 ? t("report.today.faster") : t("report.today.slower")}`
                : t("report.today.stimulus.firstRecord"))
            : (volumeChangePercent !== null
                ? `${volumeChangePercent > 0 ? "+" : ""}${volumeChangePercent}%`
                : t("report.today.vsLast.first"))
          }
        </p>
        <p className="text-[10px] text-gray-500 mt-1 leading-snug">{getStimulusMessage()}</p>
      </div>

      {/* 칼로리 */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-1.5 mb-2">
          <svg className="w-4 h-4 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
          </svg>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{t("report.today.calories")}</p>
        </div>
        <p className="text-lg font-black text-[#1B4332] leading-tight">{foodAnalogy}</p>
        <p className="text-[10px] text-gray-500 mt-1">{t("report.today.caloriesSub", { cal: String(calBurned) })}</p>
      </div>

      {/* 회복 */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-1.5 mb-2">
          <svg className="w-4 h-4 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{t("report.today.recovery")}</p>
        </div>
        <p className="text-lg font-black text-[#1B4332] leading-tight">
          {t("report.today.recoveryHours", { hours: recoveryHours })}
        </p>
        <p className="text-[10px] text-gray-500 mt-1">{t("report.today.recoverySub")}</p>
      </div>

      {/* vs 지난주 나 */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-1.5 mb-2">
          <svg className="w-4 h-4 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{t("report.today.vsLast.title")}</p>
        </div>
        <p className={`text-lg font-black leading-tight ${
          (volumeChangePercent !== null && volumeChangePercent > 0) || (distanceChangeKm !== null && distanceChangeKm !== undefined && distanceChangeKm > 0)
            ? "text-[#2D6A4F]"
            : "text-[#1B4332]"
        }`}>
          {vsLast.value}
        </p>
        <p className="text-[10px] text-gray-500 mt-1">{vsLast.label}</p>
      </div>
    </div>
  );
};
