"use client";

import React from "react";

/**
 * 회의 64-α (2026-04-19): Kenko 시그니처 Activity Ring — 재사용 SVG 원형 진행률
 * - strokeDasharray / strokeDashoffset 기반 애니메이션
 * - value 100% 초과 입력은 clamp (주간 목표 초과 완주 시각)
 * - 중앙 영역에 children 임의 렌더 (숫자/아이콘/스택)
 */
export interface ActivityRingProps {
  /** 0~100 진행률 */
  value: number;
  /** 외곽 지름 px (기본 120) */
  size?: number;
  /** stroke 두께 px (기본 12) */
  strokeWidth?: number;
  /** 진행 stroke 색 (기본 emerald #2D6A4F) */
  color?: string;
  /** 배경 trail stroke 색 (기본 gray-100) */
  trackColor?: string;
  /** 링 중앙에 렌더할 내용 */
  children?: React.ReactNode;
  /** 값 변화 시 애니메이션 on (기본 true) */
  animate?: boolean;
  /** 접근성 라벨 */
  ariaLabel?: string;
  /** 추가 className */
  className?: string;
}

function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0;
  if (v < 0) return 0;
  if (v > 100) return 100;
  return v;
}

export const ActivityRing: React.FC<ActivityRingProps> = ({
  value,
  size = 120,
  strokeWidth = 12,
  color = "#2D6A4F",
  trackColor = "#F3F4F6",
  children,
  animate = true,
  ariaLabel,
  className,
}) => {
  const clamped = clamp01(value);
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - clamped / 100);
  const center = size / 2;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className ?? ""}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={ariaLabel ?? `${Math.round(clamped)}% progress`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]"
      >
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={animate ? "transition-[stroke-dashoffset] duration-700 ease-out" : ""}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
