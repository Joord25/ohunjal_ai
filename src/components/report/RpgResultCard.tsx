"use client";

import React, { useEffect, useState } from "react";
import { WorkoutSessionData, ExerciseLog, RunningStats } from "@/constants/workout";
import { type ExpLogEntry } from "@/utils/questSystem";
import { useTranslation } from "@/hooks/useTranslation";
import { getExerciseName } from "@/utils/exerciseName";
import { auth } from "@/lib/firebase";
import { ExpTierCard, type RpgInsight } from "./ExpTierCard";
import { translateDesc } from "./WorkoutReport";

export type HeroType = "weightPR" | "repsPR" | "volumePR" | "perfect" | "streak" | "volume" | "first" | "running";

export interface HeroData {
  type: HeroType;
  label: string;
  bigNumber: string;
  subText?: string;
  coachLine?: string;
  isDark: boolean;
  exerciseName?: string;
  exerciseType?: string;
  vars?: Record<string, string>;
}

async function fetchCoachMessages(
  hero: HeroData,
  locale: string,
  logs: Record<number, ExerciseLog[]>,
  exercises: WorkoutSessionData["exercises"],
  condition?: { bodyPart: string; energyLevel: number },
  sessionDesc?: string,
  streak?: number,
  runningStats?: RunningStats,
): Promise<string[]> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user");
    const token = await user.getIdToken();

    const sessionLogs = exercises.map((ex, i) => {
      const exLogs = logs[i];
      if (!exLogs || exLogs.length === 0) return null;
      return {
        exerciseName: getExerciseName(ex.name, locale),
        sets: exLogs.map(l => ({
          setNumber: l.setNumber,
          reps: l.repsCompleted,
          weight: l.weightUsed,
          feedback: l.feedback,
        })),
      };
    }).filter(Boolean);

    const res = await fetch("/api/getCoachMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({
        heroType: hero.type,
        exerciseName: hero.exerciseName ? getExerciseName(hero.exerciseName, locale) : undefined,
        vars: hero.vars,
        locale,
        sessionLogs,
        condition,
        sessionDesc: translateDesc(sessionDesc || "", locale),
        streak,
        runningStats,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const messages = data.result?.messages;
    if (Array.isArray(messages) && messages.length > 0) return messages;
    return [data.result?.text || (locale === "ko" ? "오늘도 같이 해서 좋았어요!" : "Great training together!")];
  } catch {
    return locale === "ko"
      ? ["오늘도 같이 운동해서 좋았어요!", "끝까지 잘 해냈어요!", "내일도 기다리고 있을게요!"]
      : ["Great training together today!", "You finished strong!", "I'll be waiting tomorrow!"];
  }
}

interface RpgResultCardProps {
  totalDurationSec: number;
  totalSets?: number;
  totalVolume: number;
  successRate: number;
  isStrengthSession: boolean;
  seasonExp: number;
  prevSeasonExp: number;
  expGained: ExpLogEntry[];
  intensityLevel: "high" | "moderate" | "low";
  formatDuration: (s: number) => string;
  onHelpPress: () => void;
  onShowPrediction?: () => void;
  skipAnimation?: boolean;
  insight?: RpgInsight;
  sessionDesc?: string;
  hero: HeroData;
  timeContext: string;
  streak: number;
  nextWorkoutName?: string;
  logs: Record<number, ExerciseLog[]>;
  exercises: WorkoutSessionData["exercises"];
  condition?: { bodyPart: string; energyLevel: number };
  savedCoachMessages?: string[];
  onCoachMessagesLoaded?: (msgs: string[]) => void;
  runningStats?: RunningStats;
  hideExpCard?: boolean;
}

export function RpgResultCard({ totalDurationSec, totalVolume, isStrengthSession, seasonExp, prevSeasonExp, expGained, intensityLevel, formatDuration, onHelpPress, onShowPrediction, skipAnimation, insight, sessionDesc, hero, timeContext, streak, nextWorkoutName, logs, exercises, condition, savedCoachMessages, onCoachMessagesLoaded, runningStats, hideExpCard }: RpgResultCardProps) {
  const { t, locale } = useTranslation();

  const intensityLabel = t(`report.intensity.${intensityLevel}`);
  const sessionInfo = `${translateDesc(sessionDesc || "", locale)} · ${intensityLabel} · ${formatDuration(totalDurationSec)}`;

  const hasSaved = savedCoachMessages && savedCoachMessages.length > 0;
  const [coachMessages, setCoachMessages] = useState<string[]>(hasSaved ? savedCoachMessages : []);
  const [isThinking, setIsThinking] = useState(!skipAnimation && !hasSaved);
  const [visibleBubbles, setVisibleBubbles] = useState(skipAnimation || hasSaved ? 999 : 0);
  const [typedCharsPerBubble, setTypedCharsPerBubble] = useState<number[]>(
    hasSaved ? savedCoachMessages.map(m => m.length) : []
  );
  const [showRichCard, setShowRichCard] = useState(skipAnimation || hasSaved);

  useEffect(() => {
    if (hasSaved || skipAnimation) {
      setIsThinking(false);
      return;
    }
    fetchCoachMessages(hero, locale, logs, exercises, condition, sessionDesc, streak, runningStats).then(msgs => {
      setCoachMessages(msgs);
      setIsThinking(false);
      if (onCoachMessagesLoaded) onCoachMessagesLoaded(msgs);
    });
  }, []);

  useEffect(() => {
    if (coachMessages.length === 0 || skipAnimation || isThinking) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const charSpeed = 18;
    const bubblePause = 500;
    let baseDelay = 0;

    coachMessages.forEach((msg, bubbleIdx) => {
      timers.push(setTimeout(() => setVisibleBubbles(bubbleIdx + 1), baseDelay));
      for (let c = 0; c <= msg.length; c++) {
        timers.push(setTimeout(() => {
          setTypedCharsPerBubble(prev => {
            const next = [...prev];
            next[bubbleIdx] = c;
            return next;
          });
        }, baseDelay + c * charSpeed));
      }
      baseDelay += msg.length * charSpeed + bubblePause;
    });

    timers.push(setTimeout(() => setShowRichCard(true), baseDelay + 300));

    return () => timers.forEach(clearTimeout);
  }, [coachMessages, isThinking]);

  return (
    <div className="mb-5 flex flex-col gap-3">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden px-4 pt-4 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <img src="/favicon_backup.png" alt="AI" className="w-6 h-6 rounded-full shrink-0" />
          <span className="text-[11px] font-bold text-gray-400">{t("report.aiCoach")}</span>
        </div>

        {isThinking && !skipAnimation && (
          <div className="flex items-start gap-2.5 mb-2">
            <div className="w-7 shrink-0" />
            <div className="bg-[#2D6A4F]/5 rounded-2xl px-4 py-3 w-fit">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-medium text-[#2D6A4F]/60">
                  {locale === "ko" ? "생각 중" : "Thinking"}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]/40 animate-bounce" style={{ animationDelay: "0ms", animationDuration: "1s" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]/40 animate-bounce" style={{ animationDelay: "200ms", animationDuration: "1s" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]/40 animate-bounce" style={{ animationDelay: "400ms", animationDuration: "1s" }} />
              </div>
            </div>
          </div>
        )}
        {!isThinking && coachMessages.map((msg, idx) => {
          if (idx >= visibleBubbles) return null;
          const chars = typedCharsPerBubble[idx] ?? 0;
          const isTyping = chars < msg.length;
          return (
            <div key={idx} className="flex items-start gap-2.5 mb-2">
              <div className="w-7 shrink-0" />
              <div className="bg-[#2D6A4F]/5 rounded-2xl px-4 py-3">
                <p className="text-[14px] font-medium text-[#1B4332] leading-relaxed">
                  {msg.slice(0, chars)}
                  {isTyping && (
                    <span className="inline-block w-0.5 h-3.5 bg-[#2D6A4F] ml-0.5 animate-pulse align-middle" />
                  )}
                </p>
              </div>
            </div>
          );
        })}
        {!isThinking && coachMessages.length > 0 && <div className="mb-3" />}

        {showRichCard && (
          <div className={`ml-9.5 rounded-2xl p-4 animate-slide-up ${hero.isDark ? "bg-[#1B4332]" : "bg-gray-50"}`}>
            <p className={`text-[7px] font-black uppercase tracking-[0.3em] mb-2 ${hero.isDark ? "text-emerald-300/60" : "text-gray-400"}`}>
              {hero.label}
            </p>
            {hero.subText && (
              <p className={`text-[13px] font-medium mb-1 ${hero.isDark ? "text-white/70" : "text-gray-500"}`}>
                {hero.subText}
              </p>
            )}
            <div className="flex items-center gap-2">
              <p className={`text-[26px] font-black leading-none tracking-tight ${hero.isDark ? "text-white" : "text-[#1B4332]"}`}>
                {hero.bigNumber}
              </p>
              {hero.isDark && (
                <svg className="w-5 h-5 text-emerald-300/80 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              )}
            </div>
            <div className={`border-t mt-3 pt-2.5 ${hero.isDark ? "border-emerald-300/20" : "border-gray-200"}`}>
              <p className={`text-[11px] font-medium ${hero.isDark ? "text-emerald-300/50" : "text-gray-400"}`}>
                {timeContext} · {new Date().toLocaleTimeString(locale === "ko" ? "ko-KR" : "en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
              </p>
              <p className={`text-[11px] font-medium mt-0.5 ${hero.isDark ? "text-emerald-300/50" : "text-gray-400"}`}>
                {sessionInfo}
              </p>
            </div>
          </div>
        )}
      </div>

      {!hideExpCard && (
        <ExpTierCard
          seasonExp={seasonExp}
          prevSeasonExp={prevSeasonExp}
          expGained={expGained}
          insight={insight}
          streak={streak}
          nextWorkoutName={nextWorkoutName}
          onHelpPress={onHelpPress}
          onShowPrediction={onShowPrediction}
        />
      )}
    </div>
  );
}
