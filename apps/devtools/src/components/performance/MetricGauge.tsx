import React from 'react';

interface MetricGaugeProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  thresholds?: { good: number; warning: number };
}

export function MetricGauge({ label, value, max, unit, thresholds }: MetricGaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (percentage / 100) * circumference;

  let color = 'var(--color-success)';
  if (thresholds) {
    if (value < thresholds.warning) color = 'var(--color-error)';
    else if (value < thresholds.good) color = 'var(--color-warning)';
  }

  return (
    <div className="metric-gauge">
      <svg viewBox="0 0 80 80" className="metric-gauge__svg">
        <circle cx="40" cy="40" r="36" fill="none" stroke="var(--color-border-primary)" strokeWidth="4" />
        <circle
          cx="40" cy="40" r="36" fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
          className="metric-gauge__progress"
        />
        <text x="40" y="36" textAnchor="middle" fill="var(--color-text-primary)" fontSize="16" fontWeight="600" fontFamily="var(--font-mono)">
          {Math.round(value)}
        </text>
        <text x="40" y="50" textAnchor="middle" fill="var(--color-text-tertiary)" fontSize="8">
          {unit}
        </text>
      </svg>
      <span className="metric-gauge__label">{label}</span>
    </div>
  );
}
