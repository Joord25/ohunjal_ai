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
  size?: number;
}

/** 육각형 레이더 차트 (SVG) — 6축 고정 */
export const HexagonChart: React.FC<HexagonChartProps> = ({ axes, size = 240 }) => {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.35;
  const labelR = size * 0.48;
  const n = 6;

  // 각도 계산 (12시 방향부터 시계방향)
  const angleFor = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

  // 배경 그리드 (20%, 40%, 60%, 80%, 100%)
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
    return {
      x2: cx + maxR * Math.cos(angle),
      y2: cy + maxR * Math.sin(angle),
    };
  });

  // 데이터 폴리곤 (value는 0~100 → 0~1 비율)
  const dataPoints = axes.map((axis, i) => {
    const angle = angleFor(i);
    const r = maxR * Math.max(0.05, axis.value / 100); // 최소 5%는 보이게
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
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* 배경 그리드 */}
      {gridPaths.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={i === gridLevels.length - 1 ? 1 : 0.5}
          opacity={0.5}
        />
      ))}

      {/* 축 라인 */}
      {axisLines.map((line, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={line.x2}
          y2={line.y2}
          stroke="#E5E7EB"
          strokeWidth={0.5}
          opacity={0.5}
        />
      ))}

      {/* 데이터 폴리곤 */}
      <polygon
        points={dataPath}
        fill="#2D6A4F"
        fillOpacity={0.15}
        stroke="#2D6A4F"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* 데이터 포인트 */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#fff" stroke="#2D6A4F" strokeWidth={2} />
      ))}

      {/* 라벨 + 등수 */}
      {labelPositions.map((pos, i) => (
        <g key={i}>
          <text
            x={pos.x}
            y={pos.y - 6}
            textAnchor="middle"
            dominantBaseline="auto"
            className="text-[9px] font-bold fill-gray-500"
          >
            {pos.label}
          </text>
          <text
            x={pos.x}
            y={pos.y + 7}
            textAnchor="middle"
            dominantBaseline="auto"
            className="text-[10px] font-black fill-[#1B4332]"
          >
            {pos.rankText}
          </text>
        </g>
      ))}
    </svg>
  );
};
