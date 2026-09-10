import React from 'react';
import type { EventPayload } from '@impossible-resume/event-bus';

interface EventInspectorProps {
  event: EventPayload;
}

export function EventInspector({ event }: EventInspectorProps) {
  return (
    <div className="event-inspector glass-card animate-scale-in">
      <div className="event-inspector__header">
        <span className="event-inspector__type">{event.type}</span>
        <span className="event-inspector__time">{event.timestamp.toFixed(0)}ms</span>
      </div>
      <div className="event-inspector__body">
        <div className="event-inspector__row">
          <span className="event-inspector__label">Source</span>
          <span className="event-inspector__value">{event.source}</span>
        </div>
        <div className="event-inspector__row">
          <span className="event-inspector__label">ID</span>
          <span className="event-inspector__value event-inspector__value--mono">{event.id}</span>
        </div>
        {event.data && (
          <div className="event-inspector__row">
            <span className="event-inspector__label">Payload</span>
            <pre className="event-inspector__payload">{JSON.stringify(event.data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
