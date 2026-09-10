import React, { useEffect, useState } from 'react';
import { moduleTracker, PerformanceSnapshot, ModuleInfo } from '@impossible-resume/runtime-tracker';
import { MetricGauge } from './MetricGauge';
import { LoadingWaterfall } from './LoadingWaterfall';


export function PerformanceDashboard() {
  const [snapshot, setSnapshot] = useState<PerformanceSnapshot>(moduleTracker.getPerformanceSnapshot());
  const [modules, setModules] = useState<ModuleInfo[]>(moduleTracker.getModules());
  const [throughputHistory, setThroughputHistory] = useState<number[]>(new Array(20).fill(0));

  useEffect(() => {
    const interval = setInterval(() => {
      const snap = moduleTracker.getPerformanceSnapshot();
      setSnapshot(snap);
      setModules(moduleTracker.getModules());
      setThroughputHistory((prev) => [...prev.slice(-19), snap.eventThroughput]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const getFpsColor = (fps: number) => {
    if (fps >= 55) return 'var(--color-success)';
    if (fps >= 30) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  return (
    <div className="performance-dashboard glass" style={{ padding: '1.25rem', borderRadius: 'var(--radius-xl)', background: 'var(--color-bg-secondary)' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Real-Time System Performance & Module Waterfall</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
          Monitors browser rendering FPS, memory heap, DOM density, event throughput, and remote module initialization latency
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <MetricGauge label="Frame Rate" value={snapshot.fps} max={60} unit="FPS" thresholds={{ good: 55, warning: 30 }} />
        <MetricGauge label="DOM Nodes" value={snapshot.domNodes} max={5000} unit="Nodes" />
        <MetricGauge label="Event Stream" value={snapshot.eventThroughput} max={100} unit="evt/s" />
        <MetricGauge label="Mounted Remotes" value={snapshot.loadedModules.length} max={snapshot.moduleCount} unit={`/ ${snapshot.moduleCount}`} />
      </div>

      <LoadingWaterfall modules={modules} />
    </div>
  );
}
