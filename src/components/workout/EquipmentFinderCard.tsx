"use client";

import React, { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { getEquipmentInfo, getEquipmentFindGuide, getEquipmentUseGuide } from "@/constants/exerciseEquipment";
import { getFormCues, getFormCueSource } from "@/constants/formCues";
import { getExerciseName } from "@/utils/exerciseName";
import { getVideoEmbedUrl } from "@/constants/exerciseVideos";

/** Q1 컨펌 (회의 ζ): 단일 파일 + mode prop 분기. find = 위치/외형 / use = 안전 셋업 + 폼 cue */
type EquipmentCardMode = "find" | "use";

interface EquipmentFinderCardProps {
  exerciseName: string;
  mode: EquipmentCardMode;
}

/** 회의 2026-04-28: 기구 사진 캐러셀 — 단일 이미지면 그대로, 여러 장이면 슬라이드(점 indicator + 좌우 버튼). */
const EquipmentImageCarousel: React.FC<{ imagePath: string | string[]; alt: string }> = ({ imagePath, alt }) => {
  const images = Array.isArray(imagePath) ? imagePath : [imagePath];
  const [idx, setIdx] = useState(0);
  const isMulti = images.length > 1;

  return (
    <div className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[idx]}
        alt={alt}
        loading="eager"
        className="w-full aspect-square object-contain rounded-2xl bg-gray-50 border border-gray-100"
      />
      {isMulti && (
        <>
          <button
            type="button"
            onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
            aria-label="prev image"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center active:scale-90 transition-transform"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setIdx((i) => (i + 1) % images.length)}
            aria-label="next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center active:scale-90 transition-transform"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`image ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? "bg-white w-4" : "bg-white/60"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const EquipmentFinderCard: React.FC<EquipmentFinderCardProps> = ({ exerciseName, mode }) => {
  const { t, locale } = useTranslation();
  const equipment = getEquipmentInfo(exerciseName);
  const displayName = getExerciseName(exerciseName, locale);

  if (mode === "find") {
    const findGuide = getEquipmentFindGuide(exerciseName, locale);
    return (
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-400">
            {t("beginner_mode.equipment.label")}
          </p>
          <h2 className="text-2xl font-black text-[#1B4332] mt-1">{displayName}</h2>
        </div>

        {equipment && (
          <EquipmentImageCarousel imagePath={equipment.imagePath} alt={displayName} />
        )}

        {findGuide.length > 0 && (
          <section>
            <p className="text-[12px] font-bold text-[#1B4332] mb-2">
              {t("beginner_mode.equipment.find_label")}
            </p>
            <ul className="flex flex-col gap-1.5 text-[13px] leading-relaxed text-gray-700">
              {findGuide.map((line, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#2D6A4F] font-bold flex-shrink-0">·</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }

  // mode === "use"
  const useGuide = getEquipmentUseGuide(exerciseName, locale);
  const cues = getFormCues(exerciseName, locale);
  const source = getFormCueSource(exerciseName);
  const videoUrl = getVideoEmbedUrl(exerciseName);

  return (
    <div className="flex flex-col gap-5">
      {/* 회의 2026-04-28: 상단 캡션 EQUIPMENT로 통일(find와 parallel). "사용법"은 bullet 위 섹션 헤더로 이동. */}
      <div>
        <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-400">
          {t("beginner_mode.equipment.label")}
        </p>
        <h2 className="text-2xl font-black text-[#1B4332] mt-1">{displayName}</h2>
      </div>

      {/* 회의 2026-04-29: 영상이 YouTube Shorts/Reels(9:16 세로)라 aspect-video(16:9)로
          담으면 양옆 검은 바 발생. 9:16 컨테이너 + max-w-[240px] 가운데 정렬 — 폰 모양 프리뷰. */}
      {videoUrl && (
        <div className="w-full max-w-[240px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            loading="lazy"
            title={displayName}
          />
        </div>
      )}

      {useGuide.length > 0 && (
        <section>
          <p className="text-[12px] font-bold text-[#1B4332] mb-2">
            {t("beginner_mode.equipment.use.label")}
          </p>
          <ul className="flex flex-col gap-1.5 text-[13px] leading-relaxed text-gray-700">
            {useGuide.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[#2D6A4F] font-bold flex-shrink-0">·</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {cues.length > 0 && (
        <section>
          <p className="text-[12px] font-bold text-[#1B4332] mb-2">
            {t("beginner_mode.equipment.cue_label")}
          </p>
          <ol className="flex flex-col gap-1.5 text-[13px] leading-relaxed text-gray-700">
            {cues.map((line, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="text-[#2D6A4F] font-bold flex-shrink-0 w-4">{i + 1}.</span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
          {source && (
            <p className="text-[10px] text-gray-400 mt-2 italic">
              {t("beginner_mode.equipment.cue_source").replace("{source}", source)}
            </p>
          )}
        </section>
      )}
    </div>
  );
};
