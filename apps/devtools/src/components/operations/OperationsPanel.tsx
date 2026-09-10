import React, { useState } from 'react';
import { eventBus } from '@impossible-resume/event-bus';
import { moduleTracker } from '@impossible-resume/runtime-tracker';
import { FailureButton } from './FailureButton';
import { RecoveryStatus } from './RecoveryStatus';

export function OperationsPanel() {
  const [activeFailures, setActiveFailures] = useState<Record<string, boolean>>({});

  const toggleFailure = (key: string, label: string, affectedModule: string) => {
    setActiveFailures((prev) => {
      const nextState = !prev[key];
      const next = { ...prev, [key]: nextState };

      if (nextState) {
        moduleTracker.updateStatus(affectedModule, 'error', { error: `[Simulated Chaos] ${label}` });
        eventBus.emit('ops:failure_injected', 'devtools', { failure: key, module: affectedModule });
      } else {
        moduleTracker.updateStatus(affectedModule, 'mounted', { error: '' });
        eventBus.emit('ops:failure_recovered', 'devtools', { failure: key, module: affectedModule });
      }

      return next;
    });
  };

  const failures = [
    { key: 'disable_blog', label: 'Disable Blog (Vue 3)', module: 'blog' },
    { key: 'break_resume', label: 'Break Resume (Boundary)', module: 'resume' },
    { key: 'slow_analytics', label: 'Slow Analytics Latency', module: 'landing' },
    { key: 'disconnect_contact', label: 'Disconnect Contact API', module: 'contact' },
    { key: 'version_conflict', label: 'Version Mismatch React', module: 'projects' },
    { key: 'expired_auth', label: 'Simulate Auth Expiration', module: 'playground' },
    { key: 'shared_dep_mismatch', label: 'Shared Dep Mismatch', module: 'devtools' },
  ];

  return (
    <div className="operations-panel glass" style={{ padding: '1.25rem', borderRadius: 'var(--radius-xl)', background: 'var(--color-bg-secondary)' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-warning)' }}>
          ⚡ Operations & Chaos Resilience Panel
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
          Inject runtime failures into federated modules to test error boundaries, fallback UIs, and self-healing resilience.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {failures.map((f) => {
          const isActive = !!activeFailures[f.key];
          return (
            <FailureButton
              key={f.key}
              label={f.label}
              description={`Target: ${f.module}`}
              isActive={isActive}
              onToggle={() => toggleFailure(f.key, f.label, f.module)}
            />
          );
        })}
      </div>

      <div className="recovery-status glass-card" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <RecoveryStatus
          items={failures
            .filter((f) => activeFailures[f.key])
            .map((f) => ({ module: f.module, status: 'affected', retryCount: 0 }))}
        />
        <button
          onClick={() => {
            setActiveFailures({});
            failures.forEach((f) => moduleTracker.updateStatus(f.module, 'mounted', { error: '' }));
            eventBus.emit('ops:all_recovered', 'devtools', { timestamp: Date.now() });
          }}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-success)',
            color: 'black',
            fontWeight: 600,
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          Auto-Recover All Modules 💚
        </button>
      </div>
    </div>
  );
}
