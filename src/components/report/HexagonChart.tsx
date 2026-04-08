"use client";

import React from "react";

export interface HexagonAxis {
  label: string;
  /** 0~100 (퍼센타일) */
  value: number;
  /** "28등" 등 표시 텍스트 */
  rankText: string;
}

interface HexagonChartProps {
  axes: HexagonAxis[];
}

/** 육각형 레이더 차트 (SVG) — 6축 고정, 라벨 짤림 방지 */
export const HexagonChart: React.FC<HexagonChartProps> = ({ axes }) => {
  // 내부 좌표계: 중심 200,200 / 차트 반경 80 / 라벨 반경 130 / 전체 400x400
  const vw = 400;
  const vh = 400;
  const cx = 200;
  const cy = 200;
  const maxR = 80;
  const labelR = 135;
  const n = 6;

  const angleFor = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

  // 배경 그리드
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const gridPaths = gridLevels.map((level) => {
    const points = Array.from({ length: n }, (_, i) => {
      const angle = angleFor(i);
      const r = maxR * level;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    });
    return points.join(" ");
  });

  // 축 라인
  const axisLines = Array.from({ length: n }, (_, i) => {
    const angle = angleFor(i);
    return { x2: cx + maxR * Math.cos(angle), y2: cy + maxR * Math.sin(angle) };
  });

  // 데이터 폴리곤
  const dataPoints = axes.map((axis, i) => {
    const angle = angleFor(i);
    const r = maxR * Math.max(0.05, axis.value / 100);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // 라벨 위치
  const labelPositions = axes.map((axis, i) => {
    const angle = angleFor(i);
    return {
      x: cx + labelR * Math.cos(angle),
      y: cy + labelR * Math.sin(angle),
      label: axis.label,
      rankText: axis.rankText,
    };
  });

  return (
    <svg
      viewBox={`0 0 ${vw} ${vh}`}
      className="w-full mx-auto"
      style={{ maxWidth: 320 }}
    >
      {/* 배경 그리드 */}
      {gridPaths.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={i === gridLevels.length - 1 ? 1.5 : 0.7}
          opacity={0.5}
        />
      ))}

      {/* 축 라인 */}
      {axisLines.map((line, i) => (
        <line key={i} x1={cx} y1={cy} x2={line.x2} y2={line.y2} stroke="#E5E7EB" strokeWidth={0.7} opacity={0.5} />
      ))}

      {/* 데이터 폴리곤 */}
      <polygon points={dataPath} fill="#2D6A4F" fillOpacity={0.15} stroke="#2D6A4F" strokeWidth={2.5} strokeLinejoin="round" />

      {/* 데이터 포인트 제거 — 선만 표시 */}

      {/* 라벨 + 등수 */}
      {labelPositions.map((pos, i) => (
        <g key={i}>
          <text
            x={pos.x}
            y={pos.y - 10}
            textAnchor="middle"
            dominantBaseline="auto"
            fontSize={15}
            fontWeight={700}
            fill="#6B7280"
          >
            {pos.label}
          </text>
          <text
            x={pos.x}
            y={pos.y + 12}
            textAnchor="middle"
            dominantBaseline="auto"
            fontSize={18}
            fontWeight={900}
            fill="#1B4332"
          >
            {pos.rankText}
          </text>
        </g>
      ))}
    </svg>
  );
};
