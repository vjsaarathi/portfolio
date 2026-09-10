import React from 'react';

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  label: string;
}

export function SparklineChart({ data, width = 200, height = 50, color = 'var(--color-accent-primary)', label }: SparklineChartProps) {
  if (data.length < 2) return null;

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <div className="sparkline-chart">
      <div className="sparkline-chart__header">
        <span className="sparkline-chart__label">{label}</span>
        <span className="sparkline-chart__value" style={{ color }}>
          {data[data.length - 1]?.toFixed(0) || '0'}
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="sparkline-chart__svg">
        <polygon points={areaPoints} fill={`${color}`} opacity="0.1" />
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
