"use client";

import React from "react";
import type { RunningStats, WorkoutHistory } from "@/constants/workout";
import { useTranslation } from "@/hooks/useTranslation";
import { formatPace } from "@/utils/runningFormat";

interface TTCardProps {
  runningStats: RunningStats;
  recentHistory: WorkoutHistory[];
}

/**
 * 회의 64-Y (2026-04-19) + 회의 64-α Kenko + Hero 중복 제거 패치:
 * - Hero 카드가 이미 거리/페이스/시간 표시 → TT 카드는 **TT 전용 정보만** 노출
 * - 첫 기록: BASELINE 뱃지 + NEXT TARGET 박스
 * - 2회차+: PR 뱃지 + 방향 아이콘 + 초 차이 한 줄
 * - 자기 자신 비교 버그 수정: runningStats 동일한 히스토리 레코드 제외 (히스토리 탭 대응)
 */
export const TTCard: React.FC<TTCardProps> = ({ runningStats, recentHistory }) => {
  const { t } = useTranslation();

  const currentPace = runningStats.avgPace;
  const currentDistKm = runningStats.distance / 1000;
  const currentDuration = runningStats.duration;

  // 자기 자신 제외 + 같은 거리(±5%) TT 중 최고 페이스
  const similarTTs = recentHistory.filter(h => {
    if (!h.runningStats) return false;
    const rt = h.runningStats.runningType;
    if (rt !== "time_trial" && rt !== "sprint") return false;
    // 자기 자신 제외 (distance + duration + avgPace 전부 일치 시 same record)
    const isSelf =
      h.runningStats.distance === runningStats.distance &&
      h.runningStats.duration === currentDuration &&
      h.runningStats.avgPace === currentPace;
    if (isSelf) return false;
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
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none" aria-label="faster">
              <path d="M8 2v10m-4-4l4 4 4-4" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {diffSec > 0 && (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none" aria-label="slower">
              <path d="M8 14V4m-4 4l4-4 4 4" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {diffSec === 0 && (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none" aria-label="same">
              <path d="M3 6h10M3 10h10" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
          <p className={`text-sm font-black ${diffSec < 0 ? "text-[#2D6A4F]" : diffSec > 0 ? "text-amber-600" : "text-gray-500"}`}>
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
