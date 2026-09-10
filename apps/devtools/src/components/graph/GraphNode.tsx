import React from 'react';

interface GraphNodeProps {
  name: string;
  framework: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

export function GraphNode({ name, framework, x, y, radius, color, isSelected, onClick }: GraphNodeProps) {
  return (
    <g className="graph-node" onClick={onClick} style={{ cursor: 'pointer' }}>
      {isSelected && (
        <circle cx={x} cy={y} r={radius + 8} fill="none" stroke={color} strokeWidth="2" opacity="0.3" className="graph-node__pulse" />
      )}
      <circle cx={x} cy={y} r={radius} fill={`${color}20`} stroke={color} strokeWidth="2" />
      <text x={x} y={y - radius - 8} textAnchor="middle" fill="var(--color-text-secondary)" fontSize="11" fontFamily="var(--font-sans)">
        {name}
      </text>
      <text x={x} y={y + 4} textAnchor="middle" fill={color} fontSize="9" fontFamily="var(--font-mono)">
        {framework}
      </text>
    </g>
  );
}
