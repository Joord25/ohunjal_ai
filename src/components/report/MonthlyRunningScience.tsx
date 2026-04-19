"use client";

import React, { useMemo, useState } from "react";
import type { WorkoutHistory } from "@/constants/workout";
import { useTranslation } from "@/hooks/useTranslation";
import { formatPace, formatRunDistanceKm, formatRunDuration } from "@/utils/runningFormat";
import { computeMonthlyRunningStats, type MonthlyRunningStats } from "@/utils/monthlyRunning";

/**
 * 회의 64-β (2026-04-19): 월간 러닝 과학 데이터
 * - 히스토리 > 러닝 리포트 > 과학데이터 펼치기 안에 위치
 * - 3 서브탭 (볼륨 / 강도 / 패턴) — Kenko 스타일
 * - 자문단 권장 7지표 (Seiler/Esteve-Lanao/Bakken/Davis/Sang + UX 보조)
 */

interface MonthlyRunningScienceProps {
  history: WorkoutHistory[];
  /** 히스토리 모드에서 열람 중인 세션의 날짜 (ISO) */
  sessionDate?: string;
}

type TabKey = "volume" | "intensity" | "pattern";

export const MonthlyRunningScience: React.FC<MonthlyRunningScienceProps> = ({ history, sessionDate }) => {
  const { t, locale } = useTranslation();
  const isKo = locale === "ko";
  const [tab, setTab] = useState<TabKey>("volume");

  const stats = useMemo(
    () => computeMonthlyRunningStats(history, sessionDate),
    [history, sessionDate],
  );

  // 빈 상태: 이번 달 러닝 0건
  if (stats.totalRuns === 0) {
    return (
      <div className="px-6 py-8 text-center">
        <p className="text-sm text-gray-400">
          {isKo ? "이번 달 러닝 기록이 없어요" : "No running records this month"}
        </p>
      </div>
    );
  }

  const refDate = sessionDate ? new Date(sessionDate) : new Date();
  const validDate = !isNaN(refDate.getTime()) ? refDate : new Date();
  const monthLabel = isKo
    ? `${validDate.getFullYear()}.${String(validDate.getMonth() + 1).padStart(2, "0")}`
    : validDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div>
      {/* 월 라벨 (상단) */}
      <div className="px-6 pb-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.18em]">
          {isKo ? "이번 달" : "This Month"} · {monthLabel}
        </p>
      </div>

      {/* 서브탭 바 */}
      <div className="px-6 mb-4">
        <div className="flex gap-0.5 bg-gray-100 p-1 rounded-xl">
          {([
            { key: "volume", ko: "볼륨", en: "Volume" },
            { key: "intensity", ko: "강도", en: "Intensity" },
            { key: "pattern", ko: "패턴", en: "Pattern" },
          ] as const).map(({ key, ko, en }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                tab === key ? "bg-white text-[#1B4332] shadow-sm" : "text-gray-400"
              }`}
            >
              {isKo ? ko : en}
            </button>
          ))}
        </div>
      </div>

      {/* 탭별 콘텐츠 */}
      {tab === "volume" && <VolumePanel stats={stats} isKo={isKo} t={t} />}
      {tab === "intensity" && <IntensityPanel stats={stats} isKo={isKo} />}
      {tab === "pattern" && <PatternPanel stats={stats} isKo={isKo} />}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   볼륨 탭 — 거리·횟수·시간·페이스 + 지난달 대비 해석
   ═══════════════════════════════════════════════════════════ */
const VolumePanel: React.FC<{ stats: MonthlyRunningStats; isKo: boolean; t: (k: string) => string }> = ({ stats, isKo, t }) => {
  void t;
  const deltaDist = stats.deltaVsLastMonth.distancePct;
  const deltaPace = stats.deltaVsLastMonth.paceDeltaSec;

  // Davis 10% 룰 기반 해석
  const distanceInterpretation = (() => {
    if (deltaDist == null) return isKo ? "이번 달이 첫 러닝 달이에요" : "First month of running";
    if (deltaDist < 0) return isKo ? `지난 달보다 ${Math.abs(deltaDist)}% 감소 — 여유 있는 달` : `${Math.abs(deltaDist)}% less than last month`;
    if (deltaDist <= 10) return isKo ? `지난 달 대비 +${deltaDist}% — 안전 증가 범위` : `+${deltaDist}% vs last month — safe range`;
    if (deltaDist <= 20) return isKo ? `지난 달 대비 +${deltaDist}% — 회복 주의` : `+${deltaDist}% — monitor recovery`;
    return isKo ? `지난 달 대비 +${deltaDist}% — 부상 주의 범위` : `+${deltaDist}% — injury risk zone`;
  })();

  const paceInterpretation = (() => {
    if (deltaPace == null) return "";
    if (deltaPace === 0) return isKo ? "지난 달과 같은 페이스" : "Same pace as last month";
    if (deltaPace < 0) return isKo ? `지난 달보다 ${Math.abs(deltaPace)}초 빨라짐` : `${Math.abs(deltaPace)}s faster than last month`;
    return isKo ? `지난 달보다 ${deltaPace}초 느려짐` : `${deltaPace}s slower than last month`;
  })();

  return (
    <div className="px-6 pb-6">
      {/* 거리 + 횟수 (한 행) */}
      <div className="grid grid-cols-2 gap-6 pb-5 border-b border-gray-100">
        <div className="flex flex-col items-start">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.18em] mb-2">
            {isKo ? "총 거리" : "Total Distance"}
          </p>
          <p className="text-3xl font-black text-[#1B4332] leading-none tabular-nums">
            {formatRunDistanceKm(stats.totalDistance)}
            <span className="text-sm text-gray-400 ml-1.5 font-black">km</span>
          </p>
        </div>
        <div className="flex flex-col items-start">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.18em] mb-2">
            {isKo ? "횟수" : "Runs"}
          </p>
          <p className="text-3xl font-black text-[#1B4332] leading-none tabular-nums">
            {stats.totalRuns}
            <span className="text-sm text-gray-400 ml-1.5 font-black">{isKo ? "회" : "runs"}</span>
          </p>
        </div>
      </div>

      {/* 거리 해석 */}
      <p className="text-xs text-gray-500 leading-relaxed mt-3">
        {distanceInterpretation}
      </p>

      {/* 시간 + 페이스 (한 행) */}
      <div className="grid grid-cols-2 gap-6 pt-5 mt-5 border-t border-gray-100">
        <div className="flex flex-col items-start">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.18em] mb-2">
            {isKo ? "총 시간" : "Total Time"}
          </p>
          <p className="text-3xl font-black text-[#1B4332] leading-none tabular-nums">
            {formatRunDuration(stats.totalDuration)}
          </p>
        </div>
        <div className="flex flex-col items-start">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.18em] mb-2">
            {isKo ? "평균 페이스" : "Avg Pace"}
          </p>
          <p className="text-3xl font-black text-[#1B4332] leading-none tabular-nums">
            {stats.avgPace != null ? formatPace(stats.avgPace) : "—"}
            {stats.avgPace != null && <span className="text-sm text-gray-400 ml-1.5 font-black">/km</span>}
          </p>
        </div>
      </div>

      {paceInterpretation && (
        <p className="text-xs text-gray-500 leading-relaxed mt-3">
          {paceInterpretation}
        </p>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   강도 탭 — Z1/Z2/Z3 분포 바 + Esteve-Lanao 70/20/10 기준
   ═══════════════════════════════════════════════════════════ */
const IntensityPanel: React.FC<{ stats: MonthlyRunningStats; isKo: boolean }> = ({ stats, isKo }) => {
  const { low, mid, high } = stats.distribution;
  const pct = (v: number) => Math.round(v * 100);

  // 70/20/10 근접도 판정 (Esteve-Lanao recreational RCT)
  const interpretation = (() => {
    if (low === 0 && mid === 0 && high === 0) {
      return isKo ? "분포 데이터 부족" : "Not enough data";
    }
    const lowPct = pct(low);
    const midPct = pct(mid);
    const highPct = pct(high);
    // 아마추어 권장: 저 70%± / 중 20%± / 고 10%±
    if (lowPct >= 65 && highPct <= 15 && midPct <= 25) {
      return isKo
        ? "아마추어 권장 70/20/10에 근접 — 균형 잡힌 분포"
        : "Close to amateur 70/20/10 — balanced distribution";
    }
    if (midPct > 25) {
      return isKo
        ? "중강도 비중이 높음 — easy run 추가 권장 (Seiler 분포 기준)"
        : "Mid-intensity heavy — consider more easy runs";
    }
    if (highPct > 20) {
      return isKo
        ? "고강도 비중이 높음 — 회복 확인 필요"
        : "High-intensity heavy — ensure recovery";
    }
    if (lowPct > 85) {
      return isKo
        ? "저강도 위주 — 다음 달 고강도 1회 추가해도 좋음"
        : "Mostly easy — consider adding one high-intensity session";
    }
    return isKo ? "표준 분포에 근접" : "Close to standard distribution";
  })();

  return (
    <div className="px-6 pb-6">
      {/* 3개 Zone 바 */}
      <div className="space-y-4">
        <IntensityBar
          label={isKo ? "저강도" : "Low (Z1)"}
          sub={isKo ? "easy · long" : "easy · long"}
          pct={pct(low)}
        />
        <IntensityBar
          label={isKo ? "중강도" : "Mid (Z2)"}
          sub={isKo ? "tempo · threshold" : "tempo · threshold"}
          pct={pct(mid)}
        />
        <IntensityBar
          label={isKo ? "고강도" : "High (Z3)"}
          sub={isKo ? "interval · TT" : "interval · TT"}
          pct={pct(high)}
        />
      </div>

      {/* 해석 */}
      <p className="text-xs text-gray-500 leading-relaxed mt-5 pt-5 border-t border-gray-100">
        {interpretation}
      </p>
      <p className="text-[10px] text-gray-400 mt-1">
        {isKo
          ? "기준: Esteve-Lanao recreational RCT 70/20/10"
          : "Reference: Esteve-Lanao recreational RCT 70/20/10"}
      </p>
    </div>
  );
};

const IntensityBar: React.FC<{ label: string; sub: string; pct: number }> = ({ label, sub, pct }) => (
  <div>
    <div className="flex items-baseline justify-between mb-1.5">
      <div>
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.18em]">{label}</span>
        <span className="text-[10px] font-medium text-gray-400 ml-2">{sub}</span>
      </div>
      <span className="text-xs font-black text-[#1B4332] tabular-nums">{pct}%</span>
    </div>
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-[#1B4332] rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   패턴 탭 — 요일 히트맵 + 세션 믹스
   ═══════════════════════════════════════════════════════════ */
const PatternPanel: React.FC<{ stats: MonthlyRunningStats; isKo: boolean }> = ({ stats, isKo }) => {
  const daysRun = stats.dayPattern.filter(Boolean).length;
  const dayLabels = isKo ? ["월", "화", "수", "목", "금", "토", "일"] : ["M", "T", "W", "T", "F", "S", "S"];

  // 주중/주말 패턴 해석 (사내 코치)
  const weekdayRuns = [0, 1, 2, 3, 4].filter(i => stats.dayPattern[i]).length;
  const weekendRuns = [5, 6].filter(i => stats.dayPattern[i]).length;
  const patternInterpretation = (() => {
    if (daysRun === 0) return isKo ? "요일 데이터 없음" : "No day data";
    if (weekdayRuns === 0 && weekendRuns > 0) {
      return isKo ? "주말 편중 — 평일 1회 추가 추천" : "Weekend-heavy — try adding a weekday run";
    }
    if (weekdayRuns > 0 && weekendRuns === 0) {
      return isKo ? "주중 위주 — 주말 롱런 1회 추가 권장" : "Weekday-only — add a weekend long run";
    }
    if (daysRun >= 4) {
      return isKo ? "주 전반에 골고루 분포 — 좋은 일관성" : "Evenly distributed — good consistency";
    }
    return isKo ? "주중·주말 균형 양호" : "Weekday·weekend balance OK";
  })();

  // 세션 믹스 해석 (Sang)
  const { easy, long, tempo, interval } = stats.sessionMix;
  const mixInterpretation = (() => {
    if (long === 0 && easy + tempo + interval > 0) {
      return isKo ? "롱런 0회 — 주말 롱런 1회 추가 권장" : "No long runs — add a weekend long run";
    }
    if (interval === 0 && easy + tempo + long >= 8) {
      return isKo ? "고강도 세션 없음 — VO2 인터벌 월 1회 고려" : "No interval — consider adding a VO2 session";
    }
    if (easy === 0) {
      return isKo ? "easy run 없음 — 회복일 확보 필요" : "No easy run — ensure recovery days";
    }
    return isKo ? "세션 유형 골고루 분포" : "Session types well-distributed";
  })();

  return (
    <div className="px-6 pb-6">
      {/* 요일 히트맵 */}
      <div className="mb-5">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.18em] mb-3">
          {isKo ? "요일 패턴" : "Day Pattern"}
        </p>
        <div className="grid grid-cols-7 gap-1.5">
          {dayLabels.map((label, i) => {
            const ran = stats.dayPattern[i];
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${ran ? "text-[#1B4332]" : "text-gray-400"}`}>
                  {label}
                </span>
                <span className={`aspect-square w-full rounded-md ${ran ? "bg-[#1B4332]" : "bg-gray-100"}`} />
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mt-3">
          {patternInterpretation}
        </p>
      </div>

      {/* 세션 믹스 */}
      <div className="pt-5 border-t border-gray-100">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.18em] mb-3">
          {isKo ? "세션 믹스" : "Session Mix"}
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <MixRow label={isKo ? "easy" : "easy"} count={easy} isKo={isKo} />
          <MixRow label={isKo ? "long" : "long"} count={long} isKo={isKo} />
          <MixRow label={isKo ? "tempo" : "tempo"} count={tempo} isKo={isKo} />
          <MixRow label={isKo ? "interval" : "interval"} count={interval} isKo={isKo} />
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mt-4">
          {mixInterpretation}
        </p>
      </div>
    </div>
  );
};

const MixRow: React.FC<{ label: string; count: number; isKo: boolean }> = ({ label, count, isKo }) => (
  <div className="flex items-baseline justify-between">
    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.18em]">{label}</span>
    <span className="text-lg font-black text-[#1B4332] tabular-nums">
      {count}
      <span className="text-[10px] text-gray-400 ml-1 font-bold">{isKo ? "회" : ""}</span>
    </span>
  </div>
);
