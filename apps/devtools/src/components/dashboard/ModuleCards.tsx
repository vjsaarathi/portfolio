import React, { useEffect, useState } from 'react';
import { moduleTracker, ModuleInfo } from '@impossible-resume/runtime-tracker';
import { ModuleCard } from './ModuleCard';

export function ModuleCards() {
  const [modules, setModules] = useState<ModuleInfo[]>([]);

  useEffect(() => {
    setModules(moduleTracker.getModules());

    const interval = setInterval(() => {
      setModules(moduleTracker.getModules());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="module-cards-panel">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Loaded Remote Applications ({modules.length})
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          Real-time state, versions, load times, and shared scope dependencies for each microfrontend remote
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {modules.map((mod) => (
          <ModuleCard key={mod.name} module={mod} />
        ))}
      </div>
    </div>
  );
}
