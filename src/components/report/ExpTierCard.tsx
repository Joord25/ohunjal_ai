"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { getTierFromExp, type ExpLogEntry, sumExp, translateExpDetail } from "@/utils/questSystem";

export interface RpgInsight {
  goalLine?: string;
  weightPR?: string;
  phaseUnlock?: string;
  phaseJustUnlocked?: boolean;
  volumeCompare?: string;
}

interface ExpTierCardProps {
  seasonExp: number;
  prevSeasonExp: number;
  expGained: ExpLogEntry[];
  insight?: RpgInsight;
  streak: number;
  nextWorkoutName?: string;
  onHelpPress: () => void;
  onShowPrediction?: () => void;
}

export function ExpTierCard({ seasonExp, prevSeasonExp, expGained, insight, streak, nextWorkoutName, onHelpPress, onShowPrediction }: ExpTierCardProps) {
  const { t } = useTranslation();
  const current = getTierFromExp(seasonExp);
  const prev = getTierFromExp(prevSeasonExp);
  const tierUp = current.tierIdx > prev.tierIdx;
  const totalExpGained = sumExp(expGained);
  const expSummary = totalExpGained > 0
    ? `+${totalExpGained} EXP${tierUp ? t("report.tierUpShort", { tier: current.tier.name }) : ""}`
    : current.tier.name;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-5">
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: current.tier.color }}>
              <span className="text-[8px] font-black text-white">&#9876;</span>
            </div>
            <span className="text-[13px] font-bold text-[#1B4332]">{expSummary}</span>
          </div>
          <button
            onClick={onHelpPress}
            className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <span className="text-[9px] font-black text-gray-400">?</span>
          </button>
        </div>

        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold" style={{ color: current.tier.color }}>{current.tier.name} {seasonExp} EXP</span>
          <span className="text-[11px] text-gray-400">
            {current.nextTier ? t("report.tierRemaining", { next: current.nextTier.name, remaining: String(current.remaining) }) : t("report.maxTier")}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${current.progress * 100}%`, backgroundColor: current.tier.color }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          {streak >= 2 && (
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {Array.from({ length: Math.min(streak, 7) }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[#2D6A4F] mr-0.5" style={{ opacity: 0.4 + (i / Math.min(streak, 7)) * 0.6 }} />
                ))}
              </div>
              <span className="text-[11px] font-bold text-[#2D6A4F]">
                {t("report.hero.streakLabel", { days: String(streak) })}
              </span>
            </div>
          )}
          {nextWorkoutName && (
            <span className="text-[11px] text-gray-400 font-medium">
              {t("report.streak.next", { name: nextWorkoutName })}
            </span>
          )}
        </div>

        {(tierUp || expGained.filter(e => e.source !== "workout").length > 0 || insight?.phaseUnlock) && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-1">
            {expGained.filter(e => e.source !== "workout").map((e, i) => (
              <p key={i} className="text-[12px] font-bold text-[#2D6A4F]">{translateExpDetail(e, t)} +{e.amount} EXP</p>
            ))}
            {tierUp && (
              <p className="text-[12px] font-black text-[#2D6A4F]">{t("report.tierUp", { prev: prev.tier.name, current: current.tier.name })}</p>
            )}
            {insight?.phaseUnlock && (
              <p
                className={`text-[12px] font-medium ${insight.phaseJustUnlocked ? "text-[#2D6A4F] font-bold cursor-pointer" : "text-gray-400"}`}
                onClick={insight.phaseJustUnlocked && onShowPrediction ? onShowPrediction : undefined}
              >
                {insight.phaseUnlock}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
