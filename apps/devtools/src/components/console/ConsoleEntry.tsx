import React from 'react';
import type { RuntimeEvent } from '@impossible-resume/runtime-tracker';

interface ConsoleEntryProps {
  event: RuntimeEvent;
  typeColors: Record<string, string>;
}

export function ConsoleEntry({ event, typeColors }: ConsoleEntryProps) {
  return (
    <div className="console-entry animate-slide-in-left" style={{ animationDuration: '200ms' }}>
      <span className="console-entry__time">
        {event.timestamp.toFixed(0)}ms
      </span>
      <span
        className="console-entry__type"
        style={{ color: typeColors[event.type] || 'var(--color-text-secondary)' }}
      >
        [{event.type}]
      </span>
      <span className="console-entry__module">{event.module}</span>
      <span className="console-entry__message">{event.message}</span>
    </div>
  );
}
