import React from 'react';

interface GraphEdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  animated?: boolean;
}

export function GraphEdge({ x1, y1, x2, y2, animated }: GraphEdgeProps) {
  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke="var(--color-border-primary)"
      strokeWidth="1"
      strokeDasharray={animated ? '5,5' : 'none'}
      className={animated ? 'graph-edge--animated' : ''}
      opacity="0.5"
    />
  );
}
