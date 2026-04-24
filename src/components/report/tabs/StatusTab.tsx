"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { HexagonChart, type HexagonAxis } from "../HexagonChart";
import {
  type FitnessCategory,
  type CategoryPercentile,
  getCategoryBestBwRatio,
  bwRatioToPercentile,
  computeOverallPercentile,
  computeFitnessAge,
  percentileToRank,
  getAgeGroupLabel,
  getBestRunningPace,
  getCardioPacePercentile,
  getCardioConfidenceStatus,
} from "@/utils/fitnessPercentile";

// 회의 56: recentHistory 의존성 제거 — 이번 세션 데이터만 사용 (sessionOnly 모드)
// 회의 64-X (2026-04-19): cardio 축 러닝 연결을 위해 recentHistory + currentRunningStats 부활
export interface StatusTabProps {
  exercises: { name: string }[];
  logs: Record<number, { weightUsed?: string; repsCompleted: number }[]>;
  bodyWeightKg: number;
  gender: "male" | "female";
  age: number;
  recentHistory?: { date?: string; runningStats?: { runningType: string; distance: number; avgPace: number | null } }[];
  currentRunningStats?: { runningType: string; distance: number; avgPace: number | null } | null;
  onHelpPress?: () => void;
  onRankHelpPress?: () => void;
}

const CATEGORY_LABELS: Record<FitnessCategory, { ko: string; en: string }> = {
  chest: { ko: "가슴", en: "Chest" },
  back: { ko: "등", en: "Back" },
  shoulder: { ko: "어깨", en: "Shoulder" },
  legs: { ko: "하체", en: "Legs" },
  core: { ko: "코어 & 팔", en: "Core & Arms" },
  cardio: { ko: "체력", en: "Cardio" },
};

const CATEGORIES: FitnessCategory[] = ["chest", "back", "shoulder", "legs", "core", "cardio"];

/** [나] 탭 — 육각형 레이더 + 피트니스 나이 (회의 37) */
export const StatusTab: React.FC<StatusTabProps> = ({
  exercises,
  logs,
  bodyWeightKg,
  gender,
  age,
  recentHistory,
  currentRunningStats,
  onHelpPress,
  onRankHelpPress,
}) => {
  const { t, locale } = useTranslation();
  const isKo = locale === "ko";

  // 회의 56: 리포트 "오늘 폼" — 이번 세션 데이터만 사용 (과거 이력 무시)
  // → 자동으로 히스토리 캡처 효과 (과거 리포트 재방문 시 같은 수치)
  const bestByCategory = getCategoryBestBwRatio(
    exercises,
    logs,
    [], // sessionOnly 모드에서는 history 전달 불필요 (함수 내부에서 무시됨)
    bodyWeightKg,
    { sessionOnly: true },
  );

  // 회의 64-X (2026-04-19): cardio 축 러닝 연결
  // - 현재 세션 runningStats + recentHistory 합쳐서 반영
  // - 1회부터 잠정 (isConfirmed=false), 3회 OR 2주 경과 시 확정
  const mergedRunningHistory = [
    ...(recentHistory ?? []),
    ...(currentRunningStats ? [{ date: new Date().toISOString(), runningStats: currentRunningStats }] : []),
  ];
  const cardioStatus = getCardioConfidenceStatus(mergedRunningHistory);
  const cardioBestPace = getBestRunningPace(mergedRunningHistory);

  // 카테고리별 퍼센타일 계산
  const categoryPercentiles: CategoryPercentile[] = CATEGORIES.map((cat) => {
    if (cat === "cardio") {
      if (cardioStatus.eligibleRunCount === 0 || cardioBestPace == null) {
        return { category: cat, rank: 50, percentile: 50, bwRatio: 0, hasData: false };
      }
      const percentile = getCardioPacePercentile(cardioBestPace, gender, age);
      return {
        category: cat,
        rank: percentileToRank(percentile),
        percentile,
        bwRatio: 0,
        hasData: true,
      };
    }

    const bwRatio = bestByCategory.get(cat);
    if (bwRatio === undefined || bwRatio <= 0) {
      return { category: cat, rank: 50, percentile: 50, bwRatio: 0, hasData: false };
    }
    const percentile = bwRatioToPercentile(bwRatio, cat, gender, age);
    return {
      category: cat,
      rank: percentileToRank(percentile),
      percentile,
      bwRatio,
      hasData: true,
    };
  });

  // 종합 퍼센타일 (표시용 — 회의 54 EASING 적용된 categoryPercentiles 사용)
  const overallPercentile = computeOverallPercentile(categoryPercentiles);
  const overallRank = percentileToRank(overallPercentile);

  // 피트니스 나이 — 회의 2026-04-24: raw ACSM (skipEasing) 으로 별도 산출.
  //   화면 표시(육각형/등수)는 EASING 으로 동기부여 톤 유지하되,
  //   나이 측정은 학문적 정확성 우선 (대표 지시 — 엘리트 X, 빡세게 ○).
  const categoryPercentilesForAge: CategoryPercentile[] = categoryPercentiles.map((cp) => {
    if (!cp.hasData || cp.category === "cardio") return cp; // cardio 는 별도 페이스 percentile, 그대로 사용
    const rawPct = bwRatioToPercentile(cp.bwRatio, cp.category, gender, age, { skipEasing: true });
    return { ...cp, percentile: rawPct };
  });
  const overallPercentileForAge = computeOverallPercentile(categoryPercentilesForAge);
  const fitnessAge = computeFitnessAge(overallPercentileForAge, age, gender);
  const ageDiff = age - fitnessAge;

  // 데이터가 하나라도 있는지
  const hasAnyData = categoryPercentiles.some((c) => c.hasData);

  // 육각형 축 데이터 (6개 카테고리)
  // 회의 64-X: cardio 축 잠정 상태는 tentative=true로 회색 틴트
  const hexAxes: HexagonAxis[] = categoryPercentiles.map((cp) => ({
    label: isKo ? CATEGORY_LABELS[cp.category].ko : CATEGORY_LABELS[cp.category].en,
    value: cp.hasData ? cp.percentile : 0,
    rankText: cp.hasData
      ? `${cp.rank}${isKo ? "등" : "th"}`
      : "-",
    tentative: cp.category === "cardio" && cp.hasData && !cardioStatus.isConfirmed,
  }));

  // 회의 2026-04-24: 자기 결함 노출 금지 룰(feedback_product_positioning) 따라
  //   기존 cardioOnly amber 경고 제거. 데이터 있는 만큼으로 fitness age 표시.

  const ageGroupLabel = getAgeGroupLabel(age, locale);
  const genderLabel = isKo ? (gender === "male" ? "남성" : "여성") : (gender === "male" ? "men" : "women");

  return (
    <div className="space-y-4">
      {/* 피트니스 나이 */}
      {hasAnyData && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm text-center relative">
          {onHelpPress && (
            <button onClick={onHelpPress} className="absolute top-4 right-4 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-[11px] font-black text-gray-400">?</span>
            </button>
          )}
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            {t("report.status.fitnessAge")}
          </p>
          <p className="text-3xl font-black text-[#1B4332]">
            {fitnessAge}{isKo ? "세" : ""}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {ageDiff > 0
              ? (isKo ? `실제 나이보다 ${ageDiff}살 젊은 몸이에요` : `${ageDiff} years younger than your age`)
              : ageDiff === 0
                ? (isKo ? "딱 나이만큼 건강해요" : "Right on track for your age")
                : (isKo ? "지금부터 시작하면 빠르게 달라져요" : "Start now and you'll improve fast")
            }
          </p>
        </div>
      )}

      {/* 육각형 레이더 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm relative">
        {onRankHelpPress && (
          <button onClick={onRankHelpPress} className="absolute top-4 right-4 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-[11px] font-black text-gray-400">?</span>
          </button>
        )}
        <p className="text-sm font-black text-[#1B4332] text-center mb-1">
          {isKo
            ? `${ageGroupLabel} ${genderLabel} 100명 중`
            : `Among 100 ${ageGroupLabel} ${genderLabel}`}
        </p>
        <HexagonChart axes={hexAxes} />
        {hasAnyData && (
          <div className="text-center mt-3">
            <p className="text-lg font-black text-[#1B4332]">
              {isKo ? `종합 ${overallRank}등` : `Overall rank: ${overallRank}`}
            </p>
          </div>
        )}
        {/* 회의 64-X Q1·Q2: cardio 잠정 상태 마이크로카피 (3회 OR 2주 전까지) */}
        {cardioStatus.eligibleRunCount > 0 && !cardioStatus.isConfirmed && (
          <p className="text-[10px] font-bold text-gray-400 text-center mt-2">
            {t("status.cardio.tentative", {
              count: String(cardioStatus.eligibleRunCount),
              needed: String(Math.max(0, 3 - cardioStatus.eligibleRunCount)),
            })}
          </p>
        )}
        {!hasAnyData && (
          <p className="text-center text-xs text-gray-400 mt-2">
            {isKo ? "운동 기록이 쌓이면 나의 위치가 보여요" : "Your ranking will appear as you log workouts"}
          </p>
        )}
      </div>
    </div>
  );
};
