"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { getAuth } from "firebase/auth";

interface NutritionGuide {
  dailyCalorie: number;
  goalBasis: string;
  macros: { protein: number; carb: number; fat: number };
  meals: { time: string; menu: string }[];
  keyTip: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface NutritionTabProps {
  bodyWeightKg: number;
  heightCm?: number;
  age: number;
  gender: "male" | "female";
  goal: string;
  weeklyFrequency: number;
  todaySession: {
    type: string;
    durationMin: number;
    bodyPart?: string;
    estimatedCalories: number;
  };
}

async function getIdToken(): Promise<string> {
  const user = getAuth().currentUser;
  if (!user) throw new Error("Not logged in");
  return user.getIdToken();
}

/** [영양] 탭 — Gemini 영양 가이드 + 채팅 (회의 37) */
export const NutritionTab: React.FC<NutritionTabProps> = ({
  bodyWeightKg,
  heightCm,
  age,
  gender,
  goal,
  weeklyFrequency,
  todaySession,
}) => {
  const { t, locale } = useTranslation();
  const isKo = locale === "ko";
  const [guide, setGuide] = useState<NutritionGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const MAX_FREE_CHATS = 3;

  // 가이드 로드
  useEffect(() => {
    (async () => {
      try {
        const token = await getIdToken();
        const res = await fetch("/api/getNutritionGuide", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            locale,
            bodyWeightKg,
            heightCm,
            age,
            gender,
            goal,
            weeklyFrequency,
            todaySession,
          }),
        });
        const data = await res.json();
        setGuide(data);
      } catch (err) {
        console.error("Nutrition guide fetch failed:", err);
        // 폴백
        setGuide({
          dailyCalorie: Math.round(bodyWeightKg * 33),
          goalBasis: isKo ? "일반 기준" : "General",
          macros: {
            protein: Math.round(bodyWeightKg * 1.8),
            carb: Math.round(bodyWeightKg * 4),
            fat: Math.round(bodyWeightKg * 0.9),
          },
          meals: isKo
            ? [
                { time: "아침", menu: "오트밀 + 계란 3개 + 프로틴" },
                { time: "점심", menu: "밥 + 닭가슴살 + 견과류" },
                { time: "간식", menu: "프로틴 쉐이크 + 바나나" },
                { time: "저녁", menu: "밥 + 소고기/생선 200g" },
              ]
            : [
                { time: "Breakfast", menu: "Oatmeal + 3 eggs + protein" },
                { time: "Lunch", menu: "Rice + chicken + nuts" },
                { time: "Snack", menu: "Protein shake + banana" },
                { time: "Dinner", menu: "Rice + beef/fish 200g" },
              ],
          keyTip: isKo ? "단백질만 맞추면 나머지는 유동적으로 OK" : "Hit your protein and the rest is flexible",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 채팅 보내기
  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading || chatCount >= MAX_FREE_CHATS) return;
    const question = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: question }]);
    setChatLoading(true);
    setChatCount((c) => c + 1);

    try {
      const token = await getIdToken();
      const res = await fetch("/api/nutritionChat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          question,
          locale,
          context: {
            bodyWeightKg,
            age,
            gender,
            goal,
            todaySession: `${todaySession.type} ${todaySession.durationMin}min`,
            currentGuide: guide ? `${guide.dailyCalorie}kcal P${guide.macros.protein}g C${guide.macros.carb}g F${guide.macros.fat}g` : undefined,
          },
        }),
      });
      const data = await res.json();
      setChatMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch {
      setChatMessages((prev) => [...prev, { role: "assistant", content: isKo ? "잠시 후 다시 시도해주세요" : "Please try again" }]);
    } finally {
      setChatLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#2D6A4F] rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
          <div className="w-2 h-2 bg-[#2D6A4F] rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
          <div className="w-2 h-2 bg-[#2D6A4F] rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
        </div>
      </div>
    );
  }

  if (!guide) return null;

  const totalMacroCal = guide.macros.protein * 4 + guide.macros.carb * 4 + guide.macros.fat * 9;
  const proteinPct = Math.round((guide.macros.protein * 4 / totalMacroCal) * 100);
  const carbPct = Math.round((guide.macros.carb * 4 / totalMacroCal) * 100);
  const fatPct = 100 - proteinPct - carbPct;

  return (
    <div className="space-y-4">
      {/* 칼로리 + 목표 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
          {isKo ? "하루 목표 칼로리" : "Daily Target"}
        </p>
        <p className="text-3xl font-black text-[#1B4332]">
          {guide.dailyCalorie.toLocaleString()} <span className="text-base font-bold text-gray-400">kcal</span>
        </p>
        <p className="text-[10px] text-gray-500 mt-1">{guide.goalBasis} {isKo ? "기준" : "based"}</p>

        {/* 탄단지 바 */}
        <div className="mt-4 flex gap-2">
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-[9px] font-bold text-gray-500">{isKo ? "단백질" : "Protein"}</span>
              <span className="text-[9px] font-black text-[#1B4332]">{guide.macros.protein}g</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#2D6A4F] rounded-full" style={{ width: `${proteinPct}%` }} />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-[9px] font-bold text-gray-500">{isKo ? "탄수화물" : "Carbs"}</span>
              <span className="text-[9px] font-black text-[#1B4332]">{guide.macros.carb}g</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${carbPct}%` }} />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-[9px] font-bold text-gray-500">{isKo ? "지방" : "Fat"}</span>
              <span className="text-[9px] font-black text-[#1B4332]">{guide.macros.fat}g</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-rose-300 rounded-full" style={{ width: `${fatPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 식단 예시 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3">
          {isKo ? "오늘 이렇게 챙겨보세요" : "Today's meal plan"}
        </p>
        <div className="space-y-3">
          {guide.meals.map((meal, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="text-[10px] font-bold text-gray-400 min-w-[40px] pt-0.5">{meal.time}</span>
              <span className="text-sm text-[#1B4332] font-medium">{meal.menu}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-[#1B4332]/5 rounded-xl p-3">
          <p className="text-xs font-bold text-[#1B4332]">{guide.keyTip}</p>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        {chatMessages.length > 0 && (
          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                  msg.role === "user"
                    ? "bg-[#1B4332] text-white text-sm"
                    : "bg-gray-100 text-[#1B4332] text-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}

        {chatCount < MAX_FREE_CHATS ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              placeholder={isKo ? "궁금한 거 물어보세요" : "Ask anything about nutrition"}
              className="flex-1 text-sm bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100 focus:outline-none focus:border-[#2D6A4F] text-[#1B4332] placeholder-gray-400"
            />
            <button
              onClick={sendChat}
              disabled={!chatInput.trim() || chatLoading}
              className="px-3 py-2.5 bg-[#1B4332] text-white rounded-xl text-sm font-bold disabled:opacity-40 active:scale-95 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        ) : (
          <p className="text-center text-xs text-gray-400 py-2">
            {isKo ? "무료 질문 3회를 사용했어요" : "You've used 3 free questions"}
          </p>
        )}
      </div>

      {/* 면책조항 */}
      <p className="text-center text-[9px] text-gray-300 px-4">
        {isKo
          ? "일반적인 영양 정보이며 개인 건강 상담을 대체하지 않습니다"
          : "General nutrition information. Not a substitute for professional advice."}
      </p>
    </div>
  );
};
