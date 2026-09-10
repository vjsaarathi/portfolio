import React, { useEffect, useState } from 'react';
import { eventBus } from '@impossible-resume/event-bus';
import { ModuleCards } from './components/dashboard/ModuleCards';
import { RuntimeConsole } from './components/console/RuntimeConsole';
import { ArchitectureGraph } from './components/graph/ArchitectureGraph';
import { EventBusVisualizer } from './components/eventbus/EventBusVisualizer';
import { OperationsPanel } from './components/operations/OperationsPanel';
import { PerformanceDashboard } from './components/performance/PerformanceDashboard';
import { BonusTools } from './components/bonus/BonusTools';
import '@impossible-resume/design-tokens/index.css';
import './styles/devtools.css';
import './styles/console.css';
import './styles/graph.css';
import './styles/eventbus.css';
import './styles/operations.css';
import './styles/performance.css';

export function DevTools() {
  const [activeTab, setActiveTab] = useState<'all' | 'graph' | 'modules' | 'events' | 'ops' | 'perf'>('all');

  useEffect(() => {
    eventBus.emit('module:viewed', 'devtools', { mode: 'developer' });
  }, []);

  return (
    <div className="devtools-dashboard" style={{ padding: '1rem 0 4rem' }}>
      {/* Header Banner */}
      <div className="devtools-banner glass-card animate-fade-in-down" style={{ position: 'sticky', top: 0, zIndex: 50, marginBottom: '2rem', padding: '1.25rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', borderColor: 'var(--color-accent-primary)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem', color: 'var(--color-accent-primary)' }}>⚙</span>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: 'var(--tracking-tight)' }}>
              DEVTOOLS DASHBOARD
            </h1>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            Inspecting federated remotes and event streams.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Full Overview' },
            { id: 'graph', label: 'Graph' },
            { id: 'modules', label: 'Remotes' },
            { id: 'events', label: 'Event Bus' },
            { id: 'ops', label: 'Chaos Ops' },
            { id: 'perf', label: 'Performance' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                border: '1px solid',
                borderColor: activeTab === tab.id ? 'var(--color-accent-primary)' : 'var(--color-border-primary)',
                background: activeTab === tab.id ? 'var(--color-accent-muted)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-accent-hover)' : 'var(--color-text-secondary)',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {(activeTab === 'all' || activeTab === 'graph') && <ArchitectureGraph />}
        {(activeTab === 'all' || activeTab === 'modules') && <ModuleCards />}
        {(activeTab === 'all' || activeTab === 'events') && <EventBusVisualizer />}
        {(activeTab === 'all' || activeTab === 'events') && <RuntimeConsole />}
        {(activeTab === 'all' || activeTab === 'ops') && <OperationsPanel />}
        {(activeTab === 'all' || activeTab === 'perf') && <PerformanceDashboard />}
        {activeTab === 'all' && <BonusTools />}
      </div>
    </div>
  );
}

export default DevTools;
