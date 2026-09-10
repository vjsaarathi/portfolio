import React, { ReactNode } from 'react';

interface TimelineProps {
  children: ReactNode;
}

export function Timeline({ children }: TimelineProps) {
  return (
    <div className="timeline-container">
      <div className="timeline">
        {children}
      </div>
    </div>
  );
}
