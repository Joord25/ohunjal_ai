// ====================================================================
// GpsPermissionDialog — GPS 권한 중앙 팝업 모달 (회의 41)
// ====================================================================
// 대표 지시: 바텀시트 X, 풀스크린 X, 툴팁형 중앙 작은 모달.
// [허용] → 모달 먼저 닫고 1 tick 후 getCurrentPosition (이중 모달 방지)
// [나중에] → 모달만 닫고 세션은 GPS 없이 진행
// ====================================================================

"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface GpsPermissionDialogProps {
  open: boolean;
  onAllow: () => void;
  onLater: () => void;
}

export const GpsPermissionDialog: React.FC<GpsPermissionDialogProps> = ({ open, onAllow, onLater }) => {
  const { t } = useTranslation();

  if (!open) return null;

  const handleAllow = () => {
    // 회의 41 시뮬 결함 #1 해결: 모달 먼저 닫고 1 tick 후 권한 요청
    onLater(); // 상위에서 open=false 트리거
    setTimeout(() => {
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => onAllow(),
          () => onAllow(), // 거부되어도 상위에 이벤트는 전파 (상태는 훅에서 감지)
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        );
      } else {
        onAllow();
      }
    }, 16);
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 animate-fade-in"
      style={{ padding: "env(safe-area-inset-top, 0px) 16px env(safe-area-inset-bottom, 0px) 16px" }}
      onClick={onLater}
    >
      <div
        className="w-80 max-w-[calc(100vw-48px)] bg-white rounded-3xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-5 text-center">
          <h2 className="text-base font-black text-[#1B4332] mb-2">
            {t("running.permission.title")}
          </h2>
          <p className="text-[13px] text-gray-500 leading-relaxed">
            {t("running.permission.desc")}
          </p>
        </div>

        <div className="flex border-t border-gray-100">
          <button
            onClick={onLater}
            className="flex-1 py-4 text-sm font-bold text-gray-500 active:bg-gray-50 transition-colors"
          >
            {t("running.permission.later")}
          </button>
          <div className="w-px bg-gray-100" />
          <button
            onClick={handleAllow}
            className="flex-1 py-4 text-sm font-black text-[#2D6A4F] active:bg-emerald-50 transition-colors"
          >
            {t("running.permission.allow")}
          </button>
        </div>
      </div>
    </div>
  );
};
