import React from 'react';
import type { EventPayload } from '@impossible-resume/event-bus';

interface EventTimelineProps {
  events: EventPayload[];
  onSelectEvent: (event: EventPayload) => void;
}

const typeColors: Record<string, string> = {
  'module:loaded': 'var(--color-info)',
  'module:mounted': 'var(--color-success)',
  'module:error': 'var(--color-error)',
  'navigation:route_change': 'var(--color-react)',
  'devmode:toggle': 'var(--color-accent-primary)',
  'interaction:hover': 'var(--color-text-tertiary)',
};

export function EventTimeline({ events, onSelectEvent }: EventTimelineProps) {
  const recentEvents = events.slice(-20);

  return (
    <div className="event-timeline">
      <h4 className="event-timeline__title">Recent Events</h4>
      <div className="event-timeline__list">
        {recentEvents.map((event) => (
          <div
            key={event.id}
            className="event-timeline__item"
            onClick={() => onSelectEvent(event)}
          >
            <span
              className="event-timeline__dot"
              style={{ background: typeColors[event.type] || 'var(--color-text-muted)' }}
            />
            <span className="event-timeline__type">{event.type}</span>
            <span className="event-timeline__source">{event.source}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
