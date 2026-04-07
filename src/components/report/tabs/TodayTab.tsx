"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

// 음식 비유 풀 (현지화)
const FOOD_ANALOGIES_KO = [
  { food: "치킨 한 조각", cal: 250 },
  { food: "밥 한 공기", cal: 300 },
  { food: "초코파이 3개", cal: 360 },
  { food: "라면 한 그릇", cal: 500 },
  { food: "바나나 4개", cal: 360 },
  { food: "삼겹살 1인분", cal: 500 },
  { food: "떡볶이 1인분", cal: 450 },
  { food: "아이스 아메리카노 7잔", cal: 280 },
];

const FOOD_ANALOGIES_EN = [
  { food: "a slice of pizza", cal: 270 },
  { food: "a bowl of rice", cal: 300 },
  { food: "3 chocolate bars", cal: 360 },
  { food: "a bowl of ramen", cal: 500 },
  { food: "4 bananas", cal: 360 },
  { food: "a cheeseburger", cal: 350 },
  { food: "a serving of fries", cal: 365 },
  { food: "7 iced coffees", cal: 280 },
];

function getFoodAnalogy(calBurned: number, locale: string): string {
  if (calBurned < 10) return locale === "ko" ? "-" : "-";
  const pool = locale === "ko" ? FOOD_ANALOGIES_KO : FOOD_ANALOGIES_EN;
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
  return best.food;
}

export interface TodayTabProps {
  /** 세션 카테고리 — 이것으로 러닝 판별 (sessionCategory === "cardio") */
  sessionCategory: "strength" | "cardio" | "mobility" | "mixed";
  /** 오늘 총 볼륨 (kg) */
  totalVolume: number;
  /** 지난 세션 대비 볼륨 변화 % (null = 비교 불가) */
  volumeChangePercent: number | null;
  /** 유저 목표 */
  goal?: string;
  /** 체중 (kg) */
  bodyWeightKg?: number;
  /** 총 운동 시간 (초) — 0이면 savedDurationSec 사용 */
  totalDurationSec: number;
  /** 저장된 운동 시간 (초) — totalDurationSec 폴백 */
  savedDurationSec?: number;
  /** 피로 드롭 % */
  fatigueDrop: number | null;
  /** 러닝: 페이스 변화 (초, 음수 = 빨라짐) */
  paceChangeSec?: number | null;
  /** 러닝: 거리 변화 (km) */
  distanceChangeKm?: number | null;
}

/** 칼로리 추정 (MET 기반) */
function estimateCalories(
  sessionCategory: string,
  durationSec: number,
  bodyWeightKg: number,
): number {
  if (durationSec <= 0 || bodyWeightKg <= 0) return 0;
  const metMap: Record<string, number> = {
    strength: 4.5,
    mixed: 4.5,
    cardio: 8.0,
    mobility: 2.5,
  };
  const met = metMap[sessionCategory] ?? 4.0;
  const hours = durationSec / 3600;
  return Math.round(met * bodyWeightKg * hours);
}

/** 회복 시간 추정 */
function estimateRecoveryHours(fatigueDrop: number | null): string {
  if (fatigueDrop === null) return "24";
  if (fatigueDrop >= 0) return "12";
  if (fatigueDrop > -15) return "24";
  if (fatigueDrop > -25) return "48";
  return "48~72";
}

/** [오늘] 탭 — 1x4 레이아웃, 세션 타입 분기, 아이콘 없음 (회의 37) */
export const TodayTab: React.FC<TodayTabProps> = ({
  sessionCategory,
  totalVolume,
  volumeChangePercent,
  goal,
  bodyWeightKg,
  totalDurationSec,
  savedDurationSec,
  fatigueDrop,
  paceChangeSec,
  distanceChangeKm,
}) => {
  const { t, locale } = useTranslation();
  const isKo = locale === "ko";

  // 세션 분기: sessionCategory로만 판별 (exercises.type 사용 금지)
  const isRunning = sessionCategory === "cardio";

  // 운동 시간 — totalDurationSec이 0이면 savedDurationSec 폴백
  const durationSec = totalDurationSec > 0 ? totalDurationSec : (savedDurationSec ?? 0);

  const bw = bodyWeightKg ?? 70;
  const calBurned = estimateCalories(sessionCategory, durationSec, bw);
  const foodAnalogy = getFoodAnalogy(calBurned, locale);
  const recoveryHours = estimateRecoveryHours(fatigueDrop);

  // ── 카드 1: 자극 (근력) / 페이스 (러닝) ──
  const card1 = (() => {
    if (isRunning) {
      // 러닝: 페이스 변화
      const hasData = paceChangeSec !== null && paceChangeSec !== undefined;
      return {
        label: isKo ? "페이스" : "Pace",
        value: hasData
          ? `${Math.abs(paceChangeSec!)}${isKo ? "초" : "sec"} ${paceChangeSec! < 0 ? (isKo ? "빨라짐" : "faster") : (isKo ? "느려짐" : "slower")}`
          : (isKo ? "첫 러닝 기록!" : "First run!"),
        sub: hasData
          ? (paceChangeSec! < 0 ? (isKo ? "지난번보다 빨라졌어요" : "Faster than last time") : (isKo ? "체력이 늘고 있어요" : "Your endurance is growing"))
          : (isKo ? "다음부터 비교할 수 있어요" : "We can compare next time"),
      };
    }
    // 근력: 자극 (볼륨 변화)
    const hasData = volumeChangePercent !== null;
    let sub: string;
    if (!hasData) {
      sub = isKo ? "다음부터 비교할 수 있어요" : "We can compare next time";
    } else if (volumeChangePercent! > 0) {
      sub = goal === "fat_loss" ? (isKo ? "칼로리 소모에 효과적이에요" : "Great for burning calories")
        : goal === "muscle_gain" ? (isKo ? "근비대에 충분한 자극이에요" : "Enough stimulus for growth")
        : (isKo ? "지난번보다 더 했어요" : "Did more than last time");
    } else if (volumeChangePercent === 0) {
      sub = isKo ? "꾸준히 유지하고 있어요" : "Keeping it consistent";
    } else {
      sub = isKo ? "가볍게 잘 마무리했어요" : "Nice easy finish";
    }
    return {
      label: isKo ? "자극" : "Stimulus",
      value: hasData
        ? `${volumeChangePercent! > 0 ? "+" : ""}${volumeChangePercent}%`
        : (isKo ? "첫 기록!" : "First record!"),
      sub,
    };
  })();

  // ── 카드 2: 칼로리 ──
  const card2 = {
    label: isKo ? "칼로리" : "Calories",
    value: calBurned > 10 ? foodAnalogy : "-",
    sub: calBurned > 10
      ? (isKo ? `약 ${calBurned}kcal 태웠어요` : `Burned ~${calBurned}kcal`)
      : (isKo ? "운동 시간이 짧았어요" : "Session was short"),
  };

  // ── 카드 3: 회복 ──
  const card3 = {
    label: isKo ? "회복" : "Recovery",
    value: isKo ? `${recoveryHours}시간쯤` : `~${recoveryHours}hrs`,
    sub: isKo ? "쉬면 충분해요" : "Rest and you're good",
  };

  // ── 카드 4: vs 지난번 ──
  const card4 = (() => {
    if (isRunning) {
      if (distanceChangeKm !== null && distanceChangeKm !== undefined) {
        const sign = distanceChangeKm > 0 ? "+" : "";
        return {
          label: isKo ? "vs 지난번" : "vs Last",
          value: `${sign}${distanceChangeKm.toFixed(1)}km`,
          sub: isKo ? "지난번 대비 거리" : "Distance vs last",
        };
      }
    }
    if (volumeChangePercent !== null) {
      const sign = volumeChangePercent > 0 ? "+" : "";
      return {
        label: isKo ? "vs 지난번" : "vs Last",
        value: `${sign}${volumeChangePercent}%`,
        sub: isKo ? "지난 세션 대비 볼륨" : "Volume vs last session",
      };
    }
    return {
      label: isKo ? "vs 지난번" : "vs Last",
      value: isKo ? "첫 기록!" : "First!",
      sub: isKo ? "다음부터 비교돼요" : "Comparison starts next time",
    };
  })();

  const cards = [card1, card2, card3, card4];

  return (
    <div className="space-y-2.5 mb-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">{card.label}</p>
            <p className="text-lg font-black text-[#1B4332] leading-tight">{card.value}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
