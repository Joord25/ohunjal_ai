"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { WorkoutHistory } from "@/constants/workout";

export interface NextTabProps {
  /** 오늘 운동한 부위 (bodyPart from condition) */
  todayBodyPart?: string;
  /** 오늘 세션 카테고리 */
  sessionCategory: "strength" | "cardio" | "mobility" | "mixed";
  /** 피로도 (fatigueDrop) */
  fatigueDrop: number | null;
  /** 최근 운동 이력 */
  recentHistory: WorkoutHistory[];
  /** 주간 스케줄 (Mon-indexed) */
  weeklySchedule?: string[];
  /** 연속 운동 일수 */
  streak: number;
  /** 총 볼륨 */
  totalVolume: number;
}

// 부위 매핑 (condition bodyPart → 표시용 카테고리)
const BODY_PART_MAP: Record<string, { ko: string; en: string; opposite: string; oppositeKo: string; oppositeEn: string }> = {
  "upper_push": { ko: "가슴·어깨", en: "Chest & Shoulders", opposite: "upper_pull", oppositeKo: "등·팔", oppositeEn: "Back & Arms" },
  "upper_pull": { ko: "등·팔", en: "Back & Arms", opposite: "upper_push", oppositeKo: "가슴·어깨", oppositeEn: "Chest & Shoulders" },
  "lower": { ko: "하체", en: "Legs", opposite: "upper_push", oppositeKo: "가슴·어깨", oppositeEn: "Chest & Shoulders" },
  "full_body": { ko: "전신", en: "Full Body", opposite: "lower", oppositeKo: "하체", oppositeEn: "Legs" },
  "core": { ko: "코어", en: "Core", opposite: "upper_push", oppositeKo: "가슴·어깨", oppositeEn: "Chest & Shoulders" },
  "cardio": { ko: "유산소", en: "Cardio", opposite: "upper_push", oppositeKo: "가슴·어깨", oppositeEn: "Chest & Shoulders" },
};

// 요일 키 매핑
const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

interface NextAdvice {
  message: string;
  recommendedPart: string;
  recommendedIntensity: string;
}

function generateNextAdvice(
  todayBodyPart: string | undefined,
  sessionCategory: string,
  fatigueDrop: number | null,
  recentHistory: WorkoutHistory[],
  streak: number,
  totalVolume: number,
  t: (key: string, vars?: Record<string, string>) => string,
  locale: string,
): NextAdvice {
  const isKo = locale === "ko";

  // 특수 조건 우선
  // 1) 첫 운동
  if (recentHistory.length === 0) {
    return {
      message: isKo
        ? "첫 운동 해냈어요! 이틀 뒤에 다른 부위로 한번 더 와보세요"
        : "You did your first workout! Come back in 2 days with a different muscle group",
      recommendedPart: isKo ? "다른 부위" : "Different group",
      recommendedIntensity: t("report.next.intensity.lighter"),
    };
  }

  // 2) 3일 연속
  if (streak >= 3) {
    return {
      message: isKo
        ? `${streak}일 연속 잘 버텼어요. 내일은 가볍게 쉬어가세요`
        : `${streak} days in a row! Take it easy tomorrow`,
      recommendedPart: isKo ? "스트레칭·유산소" : "Stretch & Cardio",
      recommendedIntensity: t("report.next.intensity.lighter"),
    };
  }

  // 3) 러닝 후
  if (sessionCategory === "cardio") {
    const part = BODY_PART_MAP["upper_push"];
    // 최근 이력에서 상체 안 한 일수 체크
    const daysSinceUpper = getDaysSincePart(recentHistory, ["upper_push", "upper_pull"]);
    const dayMsg = daysSinceUpper > 5
      ? (isKo ? ` 상체 안 한 지 ${daysSinceUpper}일 됐어요` : ` Haven't done upper body in ${daysSinceUpper} days`)
      : "";

    return {
      message: isKo
        ? `오늘 뛰느라 다리 고생했으니 다음엔 상체 해주세요.${dayMsg}`
        : `Your legs worked hard today, try upper body next.${dayMsg}`,
      recommendedPart: isKo ? part.ko : part.en,
      recommendedIntensity: t("report.next.intensity.same"),
    };
  }

  // 4) 컨디션 불량 (저볼륨 + 높은 피로)
  if (fatigueDrop !== null && fatigueDrop < -25) {
    const todayPart = todayBodyPart ? (BODY_PART_MAP[todayBodyPart] ?? null) : null;
    return {
      message: isKo
        ? "컨디션 안 좋은데도 나온 거 대단해요. 다음엔 무게 올려봐요"
        : "Coming in despite a rough day is impressive. Try going heavier next time",
      recommendedPart: todayPart ? (isKo ? todayPart.ko : todayPart.en) : (isKo ? "같은 부위" : "Same group"),
      recommendedIntensity: t("report.next.intensity.harder"),
    };
  }

  // 5) 일반 — 반대 부위 추천
  const todayMapping = todayBodyPart ? BODY_PART_MAP[todayBodyPart] : null;

  if (todayMapping) {
    // 오래 안 한 부위 체크
    const allParts = Object.keys(BODY_PART_MAP).filter(p => p !== "cardio" && p !== "core");
    let longestGapPart = todayMapping.opposite;
    let longestGap = 0;
    for (const part of allParts) {
      if (part === todayBodyPart) continue;
      const days = getDaysSincePart(recentHistory, [part]);
      if (days > longestGap) {
        longestGap = days;
        longestGapPart = part;
      }
    }

    const recPart = longestGap > 7 ? longestGapPart : todayMapping.opposite;
    const recPartInfo = BODY_PART_MAP[recPart] ?? BODY_PART_MAP["upper_push"];

    // 강도 결정
    const intensity = fatigueDrop !== null && fatigueDrop < -15
      ? t("report.next.intensity.lighter")
      : t("report.next.intensity.same");

    // 메시지 생성
    const todayName = isKo ? todayMapping.ko : todayMapping.en;
    const nextName = isKo ? recPartInfo.ko : recPartInfo.en;

    let message: string;
    if (longestGap > 7) {
      message = isKo
        ? `${nextName} 안 한 지 ${longestGap}일 됐어요. 다음엔 ${nextName} 먼저 챙겨주세요`
        : `Haven't done ${nextName} in ${longestGap} days. Prioritize it next`;
    } else {
      message = isKo
        ? `오늘 ${todayName} 열심히 했으니까 다음엔 ${nextName} 해주면 딱이에요`
        : `Great ${todayName} session! ${nextName} next would be perfect`;
    }

    return {
      message,
      recommendedPart: isKo ? recPartInfo.ko : recPartInfo.en,
      recommendedIntensity: intensity,
    };
  }

  // 폴백
  return {
    message: isKo ? "오늘 잘했어요! 다음에도 꾸준히 가세요" : "Great work today! Keep it consistent",
    recommendedPart: isKo ? "이전과 다른 부위" : "Different group",
    recommendedIntensity: t("report.next.intensity.same"),
  };
}

/** 특정 부위를 마지막으로 한 이후 일수 */
function getDaysSincePart(history: WorkoutHistory[], bodyParts: string[]): number {
  const now = Date.now();
  // 역순으로 가장 최근 매칭 찾기
  for (let i = history.length - 1; i >= 0; i--) {
    const h = history[i];
    // condition에서 bodyPart 추출 시도
    try {
      const desc = (h.sessionData.description || h.sessionData.title || "").toLowerCase();
      for (const part of bodyParts) {
        const keywords = getPartKeywords(part);
        if (keywords.some(kw => desc.includes(kw))) {
          const daysDiff = Math.floor((now - new Date(h.date).getTime()) / (24 * 60 * 60 * 1000));
          return daysDiff;
        }
      }
    } catch {}
  }
  return 30; // 기록 없으면 오래 안 한 것으로 처리
}

function getPartKeywords(part: string): string[] {
  switch (part) {
    case "upper_push": return ["가슴", "어깨", "chest", "shoulder", "push", "상체 밀기", "upper push"];
    case "upper_pull": return ["등", "팔", "back", "arm", "pull", "상체 당기기", "upper pull"];
    case "lower": return ["하체", "다리", "leg", "squat", "lower"];
    case "full_body": return ["전신", "full", "전체"];
    case "core": return ["코어", "복근", "core", "ab"];
    case "cardio": return ["러닝", "달리기", "run", "cardio", "유산소"];
    default: return [];
  }
}

/** [다음] 탭 — 다음 운동 조언 (회의 37) */
export const NextTab: React.FC<NextTabProps> = ({
  todayBodyPart,
  sessionCategory,
  fatigueDrop,
  recentHistory,
  weeklySchedule,
  streak,
  totalVolume,
}) => {
  const { t, locale } = useTranslation();

  const advice = generateNextAdvice(
    todayBodyPart,
    sessionCategory,
    fatigueDrop,
    recentHistory,
    streak,
    totalVolume,
    t,
    locale,
  );

  // 다음 스케줄 계산
  const nextScheduleEntry = (() => {
    if (!weeklySchedule) return null;
    const today = new Date().getDay(); // 0=Sun
    for (let i = 1; i <= 7; i++) {
      const nextDay = (today + i) % 7;
      const schedIdx = nextDay === 0 ? 6 : nextDay - 1; // Mon-indexed
      const label = weeklySchedule[schedIdx];
      if (label && label !== "rest" && label !== "휴식") {
        const dayKey = DAY_KEYS[schedIdx];
        return {
          dayLabel: t(`report.next.day.${dayKey}`),
          workout: label,
        };
      }
    }
    return null;
  })();

  return (
    <div className="space-y-4">
      {/* 메인 조언 카드 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3">{t("report.next.title")}</p>
        <p className="text-sm font-medium text-[#1B4332] leading-relaxed mb-4">
          &ldquo;{advice.message}&rdquo;
        </p>
        <div className="flex gap-3">
          <div className="flex-1 bg-gray-50 rounded-xl p-3">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">{t("report.next.recommendedPart")}</p>
            <p className="text-sm font-black text-[#1B4332]">{advice.recommendedPart}</p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-xl p-3">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">{t("report.next.recommendedIntensity")}</p>
            <p className="text-sm font-black text-[#1B4332]">{advice.recommendedIntensity}</p>
          </div>
        </div>
      </div>

      {/* 스케줄 */}
      {nextScheduleEntry && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1B4332]/5 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase">{t("report.next.schedule")}</p>
            <p className="text-sm font-bold text-[#1B4332]">
              {nextScheduleEntry.dayLabel} · {nextScheduleEntry.workout}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
