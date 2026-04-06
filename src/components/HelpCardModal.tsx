"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { TIERS } from "@/utils/questSystem";

interface HelpCardModalProps {
  helpCard: string;
  onClose: () => void;
}

export const HelpCardModal: React.FC<HelpCardModalProps> = ({ helpCard, onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] p-6 pb-2 animate-slide-up shadow-2xl z-50 max-h-[85vh] flex flex-col">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 shrink-0" />
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {helpCard === "tierSystem" && (
            <>
              <h3 className="text-lg font-black text-[#1B4332] mb-3">{t("proof.help.tierSystem")}</h3>
              <div className="space-y-3 text-[13px] text-gray-600 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: t("proof.help.tierDesc1") }} />
                <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                  <p className="text-[11px] font-bold text-gray-500">{t("proof.help.howToGetExp")}</p>
                  <div className="space-y-1.5 text-[11px]">
                    <p>{t("proof.help.expWorkout")} <span className="font-bold text-[#2D6A4F]">+1 EXP</span></p>
                    <p>{t("proof.help.expQuest")} <span className="font-bold text-[#2D6A4F]">+2~5 EXP</span></p>
                    <p>{t("proof.help.expAllClear")} <span className="font-bold text-[#2D6A4F]">+5 EXP</span></p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                  <p className="text-[11px] font-bold text-gray-500">{t("proof.help.tierRanges")}</p>
                  <div className="space-y-1.5">
                    {TIERS.map((tier, i) => {
                      const next = TIERS[i + 1];
                      return (
                        <div key={tier.name} className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded shrink-0 min-w-[72px] text-center" style={{ backgroundColor: `${tier.color}20`, color: tier.color }}>{tier.name}</span>
                          <span className="text-[10px] text-gray-500">{next ? `${tier.minExp}~${next.minExp - 1} EXP` : `${tier.minExp} EXP+`}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p dangerouslySetInnerHTML={{ __html: t("proof.help.tierReset") }} />
                <p dangerouslySetInnerHTML={{ __html: t("proof.help.tierGoal") }} />
              </div>
            </>
          )}
          {helpCard === "loadTimeline" && (
            <>
              <h3 className="text-lg font-black text-[#1B4332] mb-3">{t("proof.help.4weekTitle")}</h3>
              <div className="space-y-3 text-[13px] text-gray-600 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: t("proof.help.4weekDesc") }} />
                <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded-sm inline-block shrink-0" />
                    <p className="text-[11px]"><span className="font-bold text-[#2D6A4F]">{t("proof.help.zoneGreenLabel")}</span></p>
                  </div>
                  <p className="text-[11px] text-gray-500 ml-5">{t("proof.help.zoneGreenDesc")}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-3 h-3 bg-amber-50 border border-amber-200 rounded-sm inline-block shrink-0" />
                    <p className="text-[11px]"><span className="font-bold text-amber-600">{t("proof.help.zoneYellowLabel")}</span></p>
                  </div>
                  <p className="text-[11px] text-gray-500 ml-5">{t("proof.help.zoneYellowDesc")}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-3 h-3 bg-[#2D6A4F] rounded-full inline-block shrink-0" />
                    <p className="text-[11px]"><span className="font-bold text-[#2D6A4F]">{t("proof.help.dotLabel")}</span></p>
                  </div>
                  <p className="text-[11px] text-gray-500 ml-5">{t("proof.help.dotDesc")}</p>
                </div>
                <p dangerouslySetInnerHTML={{ __html: t("proof.help.zoneConclusion") }} />
                <p className="text-[10px] text-gray-400 mt-2 pt-2 border-t border-gray-100">ACSM, Schoenfeld et al. (2017), NSCA</p>
              </div>
            </>
          )}
          {helpCard === "trainingLevel" && (
            <>
              <h3 className="text-lg font-black text-[#1B4332] mb-3">{t("proof.help.gradeTitle")}</h3>
              <div className="space-y-3 text-[13px] text-gray-600 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: t("proof.help.gradeDesc") }} />
                <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                  <p className="text-[11px] font-bold text-gray-500">{t("proof.help.howToGrade")}</p>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-black text-[#2D6A4F] mt-0.5 shrink-0">{t("proof.help.gradePriority1")}</span>
                      <p className="text-[11px]" dangerouslySetInnerHTML={{ __html: t("proof.help.gradePriority1Desc") }} />
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-black text-[#2D6A4F] mt-0.5 shrink-0">{t("proof.help.gradePriority2")}</span>
                      <p className="text-[11px]" dangerouslySetInnerHTML={{ __html: t("proof.help.gradePriority2Desc") }} />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                  <p className="text-[11px] font-bold text-gray-500">{t("proof.help.gradeStandardMale")}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-medium text-gray-500">{t("proof.help.exercise")}</span>
                      <div className="flex gap-3">
                        <span className="font-bold text-gray-400 w-10 text-center">{t("proof.level.beginner")}</span>
                        <span className="font-bold text-[#2D6A4F] w-10 text-center">{t("proof.level.intermediate")}</span>
                        <span className="font-bold text-amber-600 w-10 text-center">{t("proof.level.advanced")}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-600">{t("proof.help.squat")}</span>
                      <div className="flex gap-3">
                        <span className="text-gray-400 w-10 text-center">~0.75x</span>
                        <span className="text-[#2D6A4F] w-10 text-center">0.75x</span>
                        <span className="text-amber-600 w-10 text-center">1.25x+</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-600">{t("proof.help.benchPress")}</span>
                      <div className="flex gap-3">
                        <span className="text-gray-400 w-10 text-center">~0.50x</span>
                        <span className="text-[#2D6A4F] w-10 text-center">0.50x</span>
                        <span className="text-amber-600 w-10 text-center">1.00x+</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-600">{t("proof.help.deadlift")}</span>
                      <div className="flex gap-3">
                        <span className="text-gray-400 w-10 text-center">~0.75x</span>
                        <span className="text-[#2D6A4F] w-10 text-center">0.75x</span>
                        <span className="text-amber-600 w-10 text-center">1.50x+</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                  <p className="text-[11px] font-bold text-gray-500">{t("proof.help.bodyweightMale")}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-600">{t("proof.help.pushup")}</span>
                      <span className="text-gray-500">{t("proof.help.pushupRange")}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-600">{t("proof.help.pullup")}</span>
                      <span className="text-gray-500">{t("proof.help.pullupRange")}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-xl p-3">
                  <p className="text-[11px] font-bold text-amber-700 mb-1">{t("proof.help.gradeKeep")}</p>
                  <p className="text-[10px] text-amber-600">{t("proof.help.gradeKeepDesc")}</p>
                </div>
                <p>{t("proof.help.femaleNote")}</p>
                <p className="text-[10px] text-gray-400 mt-2 pt-2 border-t border-gray-100">NSCA, Rippetoe & Kilgore (2006)</p>
              </div>
            </>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 mt-5 rounded-2xl bg-[#1B4332] text-white font-bold text-sm active:scale-[0.98] transition-all shrink-0"
        >
          {t("proof.help.confirm")}
        </button>
      </div>
    </div>
  );
};
