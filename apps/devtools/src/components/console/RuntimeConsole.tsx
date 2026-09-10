import React, { useEffect, useState, useRef } from 'react';
import { moduleTracker, RuntimeEvent } from '@impossible-resume/runtime-tracker';
import { ConsoleFilter } from './ConsoleFilter';
import { ConsoleEntry } from './ConsoleEntry';


export function RuntimeConsole() {
  const [events, setEvents] = useState<RuntimeEvent[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEvents(moduleTracker.getEvents());

    const unsub = moduleTracker.onEvent((event) => {
      setEvents((prev) => [...prev.slice(-300), event]);
    });

    return unsub;
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const typeColors: Record<string, string> = {
    module_load: 'var(--color-info)',
    module_mount: 'var(--color-success)',
    module_unmount: 'var(--color-warning)',
    module_error: 'var(--color-error)',
    dependency_resolve: 'var(--color-accent-primary)',
    event_register: 'var(--color-text-secondary)',
    event_emit: 'var(--color-vue)',
    route_change: 'var(--color-react)',
    interaction: 'var(--color-text-tertiary)',
    performance: 'var(--color-svelte)',
  };

  const filteredEvents = filter === 'all'
    ? events
    : events.filter((e) => e.type === filter);

  return (
    <div className="runtime-console glass" style={{ display: 'flex', flexDirection: 'column', height: '420px', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
      <div className="runtime-console__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border-primary)' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="animate-live-pulse" style={{ color: 'var(--color-success)', fontSize: '0.75rem' }}>●</span>
          Live Activity Console Telemetry
        </h3>
        <ConsoleFilter
          filters={['all', 'module_load', 'module_mount', 'event_emit', 'interaction', 'module_error']}
          activeFilter={filter}
          onFilterChange={setFilter}
        />
      </div>

      <div ref={scrollRef} style={{ flex: 1, padding: '0.75rem', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', background: '#050508' }}>
        {filteredEvents.length === 0 ? (
          <div style={{ color: 'var(--color-text-tertiary)', textAlign: 'center', marginTop: '2rem' }}>Listening for live events...</div>
        ) : (
          filteredEvents.map((event) => (
            <ConsoleEntry key={event.id} event={event} typeColors={typeColors} />
          ))
        )}
      </div>
    </div>
  );
}
