"use client";

import React, { useState, useEffect, useRef } from "react";

interface SessionRecord {
  weights: number[];
  reps: number[];
  maxWeight: number;
  hadEasy: boolean;
  date: string;
}

interface AiCoachChatProps {
  record: SessionRecord | null;
  exerciseName?: string;
  gender?: "male" | "female";
  onClose: () => void;
}

// 조언 생성
function buildAdvice(record: SessionRecord, gender: "male" | "female" = "male"): string {
  const { weights, reps, hadEasy, maxWeight } = record;
  const step = gender === "female" ? 2.5 : 5;
  const allSameWeight = weights.every(w => w === weights[0]);
  const avgReps = Math.round(reps.reduce((a, b) => a + b, 0) / reps.length);
  const repsDecreasing = reps.length >= 2 && reps[reps.length - 1] < reps[0] - 2;
  let nextWeight = Math.round(maxWeight * 1.05 / step) * step;
  if (nextWeight <= maxWeight) nextWeight = maxWeight + step;

  if (hadEasy && allSameWeight) {
    return `${weights.length}세트 다 ${weights[0]}kg 성공했네! ${nextWeight}kg으로 올려볼까?`;
  }
  if (hadEasy && !allSameWeight) {
    return `최고 ${maxWeight}kg까지 갔네! ${nextWeight}kg 도전해볼까?`;
  }
  if (!hadEasy && repsDecreasing) {
    const lowerWeight = Math.round((weights[0] * 0.9) / step) * step;
    return `뒤로 갈수록 횟수가 떨어졌네. ${lowerWeight}kg으로 시작하면 끝까지 유지할 수 있을 거야!`;
  }
  if (!hadEasy && allSameWeight) {
    return `${weights[0]}kg 유지하면서 ${avgReps + 2}회까지 늘려보자! 꾸준히 하면 금방 늘어!`;
  }
  return `같은 무게로 횟수를 늘려보는 건 어때? 꾸준히 하면 금방 늘어!`;
}

export const AiCoachChat: React.FC<AiCoachChatProps> = ({ record, exerciseName, gender, onClose }) => {
  const hasRecord = !!record;
  const sets = record ? record.weights.map((w, i) => ({ weight: w, reps: record.reps[i] ?? 0 })) : [];

  // 메시지 목록 구성
  const messages: string[] = hasRecord
    ? [buildAdvice(record, gender)]
    : ["이 운동은 이전 기록이 없네?", "이 운동을 하면 기록을 분석해서 무게랑 횟수를 추천해줄게! 오늘 한번 해보자!"];

  const [phase, setPhase] = useState<"loading" | "record" | "typing" | "done">("loading");
  const [msgIdx, setMsgIdx] = useState(0);
  const [typedMsgs, setTypedMsgs] = useState<string[]>([]);
  const [currentTyped, setCurrentTyped] = useState("");
  const charIdx = useRef(0);

  // loading → record (1초)
  useEffect(() => {
    const t = setTimeout(() => setPhase("record"), 1000);
    return () => clearTimeout(t);
  }, []);

  // record → typing (0.8초 대기)
  useEffect(() => {
    if (phase !== "record") return;
    const t = setTimeout(() => setPhase("typing"), 800);
    return () => clearTimeout(t);
  }, [phase]);

  // typing: 현재 메시지 타이핑 → 다음 메시지 or done
  useEffect(() => {
    if (phase !== "typing") return;
    const msg = messages[msgIdx];
    if (!msg) { setPhase("done"); return; }
    if (charIdx.current >= msg.length) {
      // 현재 메시지 완료 → 저장 후 다음
      setTypedMsgs(prev => [...prev, msg]);
      setCurrentTyped("");
      charIdx.current = 0;
      if (msgIdx + 1 >= messages.length) {
        setPhase("done");
      } else {
        setMsgIdx(i => i + 1);
        // 다음 메시지 전 짧은 딜레이
        setPhase("record"); // record → typing 0.8s 딜레이 재활용
      }
      return;
    }
    const t = setTimeout(() => {
      charIdx.current += 1;
      setCurrentTyped(msg.slice(0, charIdx.current));
    }, 25);
    return () => clearTimeout(t);
  }, [phase, currentTyped, msgIdx, messages]);

  return (
    <div className="absolute inset-0 z-[70] flex flex-col animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex flex-col mx-3 my-auto bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ maxHeight: "70%" }}>
        {/* 헤더 */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0">
          <button onClick={onClose} className="text-gray-400 active:scale-90 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <img src="/favicon_backup.png" alt="AI" className="w-8 h-8 rounded-full shrink-0" />
          <div>
            <p className="text-sm font-black text-[#1B4332]">오운잘 AI 코치</p>
            <p className="text-[10px] text-[#2D6A4F] font-medium">온라인</p>
          </div>
        </div>
        {/* 채팅 영역 */}
        <div className="flex-1 overflow-y-auto px-4 py-5 bg-gray-50/50">
          {phase === "loading" ? (
            /* 로딩 */
            <div className="flex gap-2.5">
              <img src="/favicon_backup.png" alt="AI" className="w-7 h-7 rounded-full shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-400 font-medium mb-1">오운잘 코치</p>
                <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-[12px] text-gray-400 ml-1">이전 기록 분석중</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* 메시지 1: 기록 카드 or 안내 */}
              <div className="flex gap-2.5 mb-4">
                <img src="/favicon_backup.png" alt="AI" className="w-7 h-7 rounded-full shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-400 font-medium mb-1">오운잘 코치 · 방금</p>
                  <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100">
                    {hasRecord ? (
                      <>
                        <p className="text-[11px] font-bold text-gray-400 mb-2">📊 {exerciseName || "지난번"} 이전 기록</p>
                        <div className="space-y-1">
                          {sets.map((s, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-gray-400 w-10">{i + 1}세트</span>
                              <span className="text-[13px] font-black text-[#1B4332]">{s.weight}kg</span>
                              <span className="text-[11px] text-gray-400">×</span>
                              <span className="text-[13px] font-bold text-[#2D6A4F]">{s.reps}회</span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-[13px] font-bold text-[#1B4332] leading-relaxed">
                        안녕! 오운잘 AI 코치야 👋
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* 완료된 메시지들 */}
              {typedMsgs.map((msg, i) => (
                <div key={i} className="flex gap-2.5 mb-4 animate-fade-in">
                  <div className="w-7 shrink-0" />
                  <div>
                    <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100">
                      <p className="text-[13px] text-[#1B4332] leading-relaxed">{msg}</p>
                    </div>
                  </div>
                </div>
              ))}
              {/* 현재 타이핑 중인 메시지 */}
              {phase === "typing" && currentTyped && (
                <div className="flex gap-2.5 mb-4 animate-fade-in">
                  <div className="w-7 shrink-0" />
                  <div>
                    <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100">
                      <p className="text-[13px] text-[#1B4332] leading-relaxed">
                        {currentTyped}<span className="inline-block w-0.5 h-4 bg-[#2D6A4F] ml-0.5 animate-pulse align-middle" />
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {/* 입력창 (비활성) */}
        <div className="shrink-0 px-4 py-3 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-3">
            <p className="flex-1 text-[13px] text-gray-400">AI 코칭 채팅 준비 중...</p>
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </div>
          </div>
          <p className="text-[9px] text-gray-300 text-center mt-1.5">곧 AI와 직접 대화할 수 있어요</p>
        </div>
      </div>
    </div>
  );
};
