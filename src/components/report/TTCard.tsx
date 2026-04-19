"use client";

import React from "react";
import type { RunningStats, WorkoutHistory } from "@/constants/workout";
import { useTranslation } from "@/hooks/useTranslation";
import { formatPace, formatRunDistanceKm, formatRunDuration } from "@/utils/runningFormat";

interface TTCardProps {
  runningStats: RunningStats;
  recentHistory: WorkoutHistory[];
}

/**
 * 회의 64-Y (2026-04-19) TT 카드 v1 + 회의 64-α Kenko 재디자인:
 * - PR 뱃지 (동일 거리(±5%) 최근 TT 대비 개인 최고 페이스면 표시)
 * - 첫 기록(BASELINE SET): 축하 뱃지 + "NEXT TARGET" 박스 (현재 페이스 -5초 도전 투사)
 * - 2회차+: PR 뱃지 + 방향 아이콘(↓빨라짐 emerald / ↑느려짐 amber / =동일) + 초 차이 문구
 */
export const TTCard: React.FC<TTCardProps> = ({ runningStats, recentHistory }) => {
  const { t } = useTranslation();

  const currentPace = runningStats.avgPace;
  const currentDistKm = runningStats.distance / 1000;

  // 같은 거리(±5%) TT 중 현재 세션 제외한 최고 페이스
  const similarTTs = recentHistory.filter(h => {
    if (!h.runningStats) return false;
    const rt = h.runningStats.runningType;
    if (rt !== "time_trial" && rt !== "sprint") return false;
    const dKm = h.runningStats.distance / 1000;
    if (currentDistKm === 0) return false;
    if (Math.abs(dKm - currentDistKm) / currentDistKm > 0.05) return false;
    return true;
  });
  const prevBest = similarTTs.reduce<number | null>((best, h) => {
    const p = h.runningStats?.avgPace;
    if (p == null) return best;
    return best == null || p < best ? p : best;
  }, null);

  const isPR = prevBest == null || (currentPace != null && currentPace < prevBest);
  const diffSec = prevBest != null && currentPace != null ? Math.round(currentPace - prevBest) : null;
  const isFirstRecord = diffSec == null;

  // 다음 타겟 = 현재 페이스 -5초
  const nextTargetPace = currentPace != null ? Math.max(1, currentPace - 5) : null;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 py-7">
      {/* 타이틀 + 뱃지 */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.18em]">
          {t("running.tt.label")}
        </span>
        {isFirstRecord && (
          <span className="ml-auto px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded-full">
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-[0.15em]">
              {t("running.tt.baselineBadge")}
            </span>
          </span>
        )}
        {!isFirstRecord && isPR && prevBest != null && (
          <span className="ml-auto px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded-full">
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-[0.15em]">
              {t("running.tt.pr")}
            </span>
          </span>
        )}
      </div>

      {/* 거리 단독 상단 (hero 느낌) */}
      <div className="flex flex-col items-start mb-6">
        <p className="text-4xl font-black text-[#1B4332] leading-none tabular-nums">
          {formatRunDistanceKm(runningStats.distance)}
        </p>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mt-2">km</p>
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-100 pt-5 mb-5" />

      {/* Time + Avg Pace 2분할 */}
      <div className="grid grid-cols-2 gap-6 mb-5">
        <div className="flex flex-col items-start">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.18em] mb-2">
            {t("running.stats.time")}
          </p>
          <p className="text-4xl font-black text-[#1B4332] leading-none tabular-nums">
            {formatRunDuration(runningStats.duration)}
          </p>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mt-2">total</p>
        </div>
        <div className="flex flex-col items-start">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.18em] mb-2">
            {t("running.stats.pace")}
          </p>
          <p className="text-4xl font-black text-[#1B4332] leading-none tabular-nums">
            {formatPace(currentPace)}
          </p>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mt-2">/km</p>
        </div>
      </div>

      {/* 첫 기록: NEXT TARGET 박스 */}
      {isFirstRecord && nextTargetPace != null && (
        <div className="rounded-2xl bg-[#FAFFF7] border border-emerald-100 px-4 py-3">
          <p className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.18em] mb-1">
            {t("running.tt.nextTargetLabel")}
          </p>
          <p className="text-sm font-bold text-[#1B4332]">
            {t("running.tt.nextTargetBody", { pace: formatPace(nextTargetPace) })}
          </p>
        </div>
      )}

      {/* 2회차+: 방향 아이콘 + 초 차이 */}
      {!isFirstRecord && diffSec != null && (
        <div className="flex items-center gap-2">
          {diffSec < 0 && (
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none" aria-label="faster">
              <path d="M8 2v10m-4-4l4 4 4-4" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {diffSec > 0 && (
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none" aria-label="slower">
              <path d="M8 14V4m-4 4l4-4 4 4" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {diffSec === 0 && (
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none" aria-label="same">
              <path d="M3 6h10M3 10h10" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
          <p className={`text-xs font-black ${diffSec < 0 ? "text-[#2D6A4F]" : diffSec > 0 ? "text-amber-600" : "text-gray-500"}`}>
            {diffSec < 0
              ? t("running.tt.fasterShort", { sec: String(Math.abs(diffSec)) })
              : diffSec === 0
                ? t("running.tt.same")
                : t("running.tt.slower", { sec: String(diffSec) })}
          </p>
        </div>
      )}
    </div>
  );
};
