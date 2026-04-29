"use client";

/**
 * WeightHub — 회의 ζ-5 (2026-04-30) ROOT 카드 → 웨이트 진입판 풀스크린.
 * RunningProgramSheet 디자인 패턴 미러링 (caption + h1 + 카드 톤 통일).
 *
 * 디자인 룰:
 * - 한 페이지 ≤ 4 카드
 * - 부위별 1 카드 = 그날 단발 (5개 부위 선택 시트)
 * - 목적별·캠페인 = onboarding goal·gender·시즌 매칭
 * - 상단 칩 탭 (다이어트/근력향상/건강) — 사용자가 다른 목적 카탈로그 탐색 가능
 */
import React, { useMemo, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  PROGRAM_CATALOG,
  getMatchedCatalog,
  type CatalogItem,
  type OnboardingGoal,
} from "@/constants/programCatalog";
import type { TargetMuscle } from "@/constants/workout";

interface WeightHubProps {
  isLoggedIn: boolean;
  isPremium: boolean;
  hasActivePrograms: boolean;
  onboardingGoal: OnboardingGoal;
  gender?: "male" | "female";
  experienceMonths?: number;
  /** 회의 ζ-5 ④: 진행 중 웨이트 프로그램 목록 — 상단 "이어가기" 섹션 */
  activeWeightPrograms?: Array<{ programId: string; programName: string; completed: number; total: number; nextSession: { id: string; weekIndex?: number; dayOfWeek?: number; slotType?: string; chapterIndex?: number } | null }>;
  onResumeProgram?: (programId: string, nextSessionId: string) => void;
  onBack: () => void;
  onOpenMyPlans: () => void;
  onOpenProfile: () => void;
  /** 카탈로그 카드 클릭 핸들러. body_picker 는 muscle 동봉. program/campaign 은 settings(sessionsPerWeek/startChoice) 동봉 */
  onStartCatalog: (item: CatalogItem, opt?: { muscle?: TargetMuscle; sessionsPerWeek?: number; startChoice?: "today" | "tomorrow" | "next_monday" }) => void;
  onRequestLogin: () => void;
  onRequestPaywall: () => void;
}

const ICON_BACK = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M15 6l-6 6 6 6" />
  </svg>
);
const ICON_MY_PLANS = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M6 4h12a1 1 0 011 1v16l-7-4-7 4V5a1 1 0 011-1z" />
  </svg>
);
const ICON_PROFILE = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="9" r="3.5" />
    <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
  </svg>
);

const CHIP_GOALS: { id: OnboardingGoal; ko: string; en: string }[] = [
  { id: "fat_loss", ko: "다이어트", en: "Fat Loss" },
  { id: "muscle_gain", ko: "근력향상", en: "Muscle Gain" },
  { id: "endurance", ko: "기초체력", en: "Endurance" },
  { id: "health", ko: "건강", en: "Health" },
];

const MUSCLE_OPTIONS: { id: TargetMuscle; ko: string; en: string }[] = [
  { id: "chest", ko: "가슴", en: "Chest" },
  { id: "back", ko: "등", en: "Back" },
  { id: "shoulders", ko: "어깨", en: "Shoulders" },
  { id: "arms", ko: "팔", en: "Arms" },
  { id: "legs", ko: "하체", en: "Legs" },
];

// slotType → 사용자 친화 라벨 (회의 ζ-5 Phase 5)
const SLOT_TYPE_LABELS: Record<string, { ko: string; en: string }> = {
  upper_push: { ko: "상체 푸시", en: "Upper Push" },
  upper_pull: { ko: "상체 풀", en: "Upper Pull" },
  lower_squat: { ko: "하체 스쿼트", en: "Lower Squat" },
  lower_hinge: { ko: "하체 힌지", en: "Lower Hinge" },
  upper_compound: { ko: "상체 컴파운드", en: "Upper Compound" },
  lower_compound: { ko: "하체 컴파운드", en: "Lower Compound" },
  upper_volume: { ko: "상체 볼륨", en: "Upper Volume" },
  lower_volume: { ko: "하체 볼륨", en: "Lower Volume" },
  metcon_circuit: { ko: "MetCon 서킷", en: "MetCon" },
  upper_a_push_emphasis: { ko: "상체 A (가슴·삼두)", en: "Upper A" },
  lower_a_squat_glute: { ko: "하체 A (스쿼트+글루트)", en: "Lower A" },
  upper_b_pull_emphasis: { ko: "상체 B (등·이두)", en: "Upper B" },
  lower_b_hinge_glute: { ko: "하체 B (힌지+글루트)", en: "Lower B" },
  push_a: { ko: "Push A (가슴 강조)", en: "Push A" },
  pull_a: { ko: "Pull A (등 강조)", en: "Pull A" },
  legs_squat_focus: { ko: "Legs (스쿼트)", en: "Legs Squat" },
  push_b: { ko: "Push B (어깨 강조)", en: "Push B" },
  legs_hinge_focus: { ko: "Legs (힌지)", en: "Legs Hinge" },
  posture_thoracic_pull: { ko: "흉추 + 등 풀", en: "Thoracic Pull" },
  posture_core_glute: { ko: "코어 + 글루트", en: "Core + Glute" },
  posture_scap_rotator: { ko: "견갑 + 회전근개", en: "Scap + Rotator" },
  posture_thoracic_rotation: { ko: "흉추 회전 + 풀", en: "Thoracic Rotation" },
  chest_safe_a: { ko: "가슴 안전 A", en: "Chest Safe A" },
  chest_safe_b: { ko: "가슴 안전 B", en: "Chest Safe B" },
  shoulder_rehab: { ko: "어깨 재활", en: "Shoulder Rehab" },
  upper_push_focus: { ko: "상체 Push", en: "Upper Push" },
  upper_pull_focus: { ko: "상체 Pull", en: "Upper Pull" },
  lower_squat_focus: { ko: "하체 Squat", en: "Lower Squat" },
  lower_hinge_focus: { ko: "하체 Hinge", en: "Lower Hinge" },
  lower_full: { ko: "하체 풀", en: "Lower Full" },
  hiit_long_interval: { ko: "HIIT 4×4분", en: "HIIT Long" },
  hiit_medium_interval: { ko: "HIIT 8×2분", en: "HIIT Medium" },
  fullbody_a_squat: { ko: "풀바디 A (스쿼트)", en: "Full Body A" },
  fullbody_b_hinge: { ko: "풀바디 B (힌지)", en: "Full Body B" },
  starter_fullbody: { ko: "입문 풀바디", en: "Starter Full Body" },
  arms_main_1: { ko: "팔 메인", en: "Arms Main" },
  arms_bicep_focus: { ko: "이두 강조", en: "Bicep Focus" },
  arms_tricep_focus: { ko: "삼두 강조", en: "Tricep Focus" },
  arms_pump_finisher: { ko: "팔 펌프 마무리", en: "Arms Pump" },
  wendler_squat_day: { ko: "Wendler 스쿼트", en: "Wendler Squat" },
  wendler_bench_day: { ko: "Wendler 벤치", en: "Wendler Bench" },
  wendler_deadlift_day: { ko: "Wendler 데드", en: "Wendler Deadlift" },
  wendler_ohp_day: { ko: "Wendler OHP", en: "Wendler OHP" },
  back_thickness: { ko: "등 두께", en: "Back Thickness" },
  back_width: { ko: "등 넓이", en: "Back Width" },
  back_volume: { ko: "등 볼륨", en: "Back Volume" },
  senior_fullbody: { ko: "시니어 풀바디", en: "Senior Full Body" },
  upper_low_intensity: { ko: "상체 저강도", en: "Upper Low" },
  lower_low: { ko: "하체 저강도", en: "Lower Low" },
};

const DAY_LABELS_KO = ["일", "월", "화", "수", "목", "금", "토"];
const DAY_LABELS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const WeightHub: React.FC<WeightHubProps> = ({
  hasActivePrograms,
  onboardingGoal,
  gender,
  experienceMonths,
  activeWeightPrograms,
  onResumeProgram,
  onBack,
  onOpenMyPlans,
  onOpenProfile,
  onStartCatalog,
}) => {
  const { locale } = useTranslation();
  // 회의 ζ-5 정정 (2026-04-30): 칩 탭 폐기 — 운동 목표는 onboarding/프로필에서만 결정. 자동 매칭.
  const selectedGoal = onboardingGoal;
  // 회의 ζ-5 (2026-04-30): body_picker / settings step (러닝 패턴 미러)
  const [step, setStep] = useState<"list" | "body_picker" | "settings">("list");
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [settingsFreq, setSettingsFreq] = useState<number>(3);
  const [settingsStart, setSettingsStart] = useState<"today" | "tomorrow" | "next_monday">("today");

  const cards = useMemo<CatalogItem[]>(() => {
    return getMatchedCatalog({
      goal: selectedGoal,
      gender,
      currentMonth: new Date().getMonth() + 1,
      experienceMonths,
    });
  }, [selectedGoal, gender, experienceMonths]);

  const bodyPickerCard = PROGRAM_CATALOG.find((c) => c.kind === "body_picker")!;

  const handleCardClick = (item: CatalogItem) => {
    if (item.kind === "body_picker") {
      setStep("body_picker");
      return;
    }
    // 회의 ζ-5 (2026-04-30): program/campaign → settings step (주당 빈도/시작 시점 입력)
    setSelectedItem(item);
    setSettingsFreq(item.sessionsPerWeek ?? 3);
    setSettingsStart("today");
    setStep("settings");
  };

  const handleMuscleSelect = (muscle: TargetMuscle) => {
    onStartCatalog(bodyPickerCard, { muscle });
  };

  const handleStartProgram = () => {
    if (!selectedItem) return;
    onStartCatalog(selectedItem, { sessionsPerWeek: settingsFreq, startChoice: settingsStart });
  };

  const handleBack = () => {
    if (step === "body_picker" || step === "settings") {
      setStep("list");
      setSelectedItem(null);
      return;
    }
    onBack();
  };

  const label = (item: CatalogItem) => locale === "en" ? item.labelEn : item.labelKo;

  return (
    <div className="h-full w-full bg-white flex flex-col">
      {/* 헤더 — RunningProgramSheet 패턴: 좌(뒤로) + 우(북마크/프로필). 가운데 타이틀 X */}
      <div className="flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 border-b border-gray-50">
        <button
          onClick={handleBack}
          aria-label="뒤로가기"
          className="p-2 text-[#1B4332] active:scale-[0.94] transition-transform"
        >
          {ICON_BACK}
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenMyPlans}
            aria-label="내 플랜"
            className="relative p-2 text-[#1B4332] active:scale-[0.94] transition-transform"
          >
            {ICON_MY_PLANS}
            {hasActivePrograms && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />}
          </button>
          <button
            onClick={onOpenProfile}
            aria-label="프로필"
            className="p-2 text-[#1B4332] active:scale-[0.94] transition-transform"
          >
            {ICON_PROFILE}
          </button>
        </div>
      </div>

      {/* 본문 — px-6 pt-6 pb-10 (RunningProgramSheet 미러) */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10">
        {step === "list" ? (
          <>
            {/* caption + h1 + subtitle */}
            <div className="mb-5">
              <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-400">
                WEIGHT TRAINING
              </p>
              <h1 className="text-3xl font-black text-[#1B4332] mt-1">
                {locale === "en" ? "Weight" : "웨이트"}
              </h1>
              <p className="text-[13px] text-gray-500 mt-3 leading-relaxed">
                {locale === "en" ? "Pick one and start today" : "오늘 한 가지 골라 시작하세요"}
              </p>
            </div>

            {/* 회의 ζ-5 ④/Phase 5 정정 (2026-04-30): 진행 중 카드 = RunningProgramSheet 디자인 100% 미러 */}
            {activeWeightPrograms && activeWeightPrograms.length > 0 && (
              <>
                <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-400 mb-3">
                  {locale === "en" ? "IN PROGRESS" : "진행 중"}
                </p>
                <div className="flex flex-col gap-3 mb-6">
                  {activeWeightPrograms.map((p) => {
                    const pct = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
                    return (
                      <button
                        key={p.programId}
                        onClick={() => p.nextSession && onResumeProgram?.(p.programId, p.nextSession.id)}
                        disabled={!p.nextSession}
                        className="w-full bg-white border border-[#2D6A4F]/30 rounded-3xl shadow-sm px-6 py-5 active:scale-[0.98] transition-transform hover:bg-emerald-50/30 text-left disabled:opacity-50"
                      >
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <span className="text-base font-black text-[#1B4332] leading-tight truncate">{p.programName}</span>
                          <span className="shrink-0 text-[11px] font-bold text-[#2D6A4F]">{p.completed}/{p.total}</span>
                        </div>
                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#2D6A4F] transition-[width] duration-500" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-[11px] text-[#2D6A4F] font-bold mt-2">
                          {locale === "en" ? "Continue →" : "이어가기 →"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* 회의 ζ-5 정정 (2026-04-30): 칩 탭 제거 — 온보딩/프로필 목표 자동 매칭 */}

            {/* 카탈로그 카드 — 한 페이지 ≤ 4. RunningProgramSheet 카드 톤 미러 */}
            <div className="flex flex-col gap-3">
              {cards.map((item) => {
                const freq = item.sessionsPerWeek ? `${locale === "en" ? "Wk" : "주"} ${item.sessionsPerWeek}${locale === "en" ? "" : "일"}` : "";
                return (
                  <button
                    key={item.id}
                    onClick={() => handleCardClick(item)}
                    className="w-full bg-white border border-gray-100 rounded-3xl shadow-sm px-6 py-5 active:scale-[0.98] transition-transform hover:bg-gray-50 text-left"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xl font-black text-[#1B4332] leading-tight">
                        {label(item)}
                      </span>
                      {freq && (
                        <span className="shrink-0 text-[11px] font-black text-[#2D6A4F] whitespace-nowrap">
                          {freq}
                        </span>
                      )}
                    </div>
                    {item.descriptionKo && (
                      <p className="text-[12.5px] text-gray-500 mt-1.5 leading-relaxed">
                        {locale === "en" ? "" : item.descriptionKo}
                      </p>
                    )}
                  </button>
                );
              })}
              {cards.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-12">
                  {locale === "en" ? "No programs match. Try another goal chip." : "조건에 맞는 프로그램이 없습니다. 다른 목적 칩을 눌러보세요."}
                </p>
              )}
            </div>
          </>
        ) : step === "body_picker" ? (
          // 회의 ζ-5: body_picker step — 풀스크린 다음 페이지 (러닝 패턴 미러)
          <>
            <div className="mb-5">
              <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-400">
                BODY PART
              </p>
              <h1 className="text-3xl font-black text-[#1B4332] mt-1">
                {locale === "en" ? "Pick one" : "오늘 운동할 부위"}
              </h1>
              <p className="text-[13px] text-gray-500 mt-3 leading-relaxed">
                {locale === "en" ? "5-split pattern · single session today" : "5분할 · 오늘 단일 세션"}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {MUSCLE_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleMuscleSelect(m.id)}
                  className="w-full bg-white border border-gray-100 rounded-3xl shadow-sm px-6 py-5 active:scale-[0.98] transition-transform hover:bg-gray-50 text-center"
                >
                  <span className="text-xl font-black text-[#1B4332] leading-tight">
                    {locale === "en" ? m.en : m.ko}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          // 회의 ζ-5 (2026-04-30): settings step — 주당 빈도 + 시작 시점 (러닝 RunningProgramSheet StepSettings 미러)
          <>
            <div className="mb-6">
              <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-400">
                SETTINGS
              </p>
              <h1 className="text-3xl font-black text-[#1B4332] mt-1">
                {locale === "en" ? "Settings" : "세팅"}
              </h1>
              {selectedItem && (
                <p className="text-[13px] text-gray-500 mt-3 leading-relaxed">
                  {locale === "en" ? selectedItem.labelEn : selectedItem.labelKo}
                </p>
              )}
            </div>

            {/* Q1. 주당 빈도 */}
            <div className="mb-6">
              <p className="text-[14px] font-black text-[#1B4332] mb-3">
                {locale === "en" ? "How many days per week?" : "일주일에 몇 번 운동할 수 있어요?"}
              </p>
              <div className="flex gap-2">
                {[3, 4, 5].map((n) => {
                  const active = settingsFreq === n;
                  return (
                    <button
                      key={n}
                      onClick={() => setSettingsFreq(n)}
                      className={`flex-1 py-3 rounded-2xl text-[15px] font-black transition ${
                        active ? "bg-[#1B4332] text-white" : "bg-gray-50 text-gray-500"
                      }`}
                    >
                      {locale === "en" ? `${n} days` : `${n}일`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Q2. 시작 시점 */}
            <div className="mb-8">
              <p className="text-[14px] font-black text-[#1B4332] mb-3">
                {locale === "en" ? "When do you want to start?" : "언제 시작할까요?"}
              </p>
              <div className="flex gap-2">
                {[
                  { id: "today" as const, ko: "오늘", en: "Today" },
                  { id: "tomorrow" as const, ko: "내일", en: "Tomorrow" },
                  { id: "next_monday" as const, ko: "다음 주 월요일", en: "Next Mon" },
                ].map((s) => {
                  const active = settingsStart === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSettingsStart(s.id)}
                      className={`flex-1 py-3 rounded-2xl text-[13px] font-black transition ${
                        active ? "bg-[#1B4332] text-white" : "bg-gray-50 text-gray-500"
                      }`}
                    >
                      {locale === "en" ? s.en : s.ko}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleStartProgram}
              className="w-full py-4 rounded-2xl bg-[#1B4332] text-white text-[15px] font-black active:scale-[0.98] transition-transform"
            >
              {locale === "en" ? "Build my plan" : "여정 짜기"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
