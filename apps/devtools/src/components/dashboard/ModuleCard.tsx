import React from 'react';
import { ModuleInfo } from '@impossible-resume/runtime-tracker';

interface ModuleCardProps {
  module: ModuleInfo;
}

export function ModuleCard({ module }: ModuleCardProps) {
  const statusColor: Record<string, string> = {
    mounted: 'var(--color-status-healthy)',
    loading: 'var(--color-status-loading)',
    loaded: 'var(--color-status-loading)',
    initializing: 'var(--color-status-loading)',
    error: 'var(--color-status-error)',
    discovered: 'var(--color-status-offline)',
    unloaded: 'var(--color-status-offline)',
  };

  const frameworkColor: Record<string, string> = {
    react: 'var(--color-react)',
    vue: 'var(--color-vue)',
    svelte: 'var(--color-svelte)',
  };

  const loadTime = module.loadEndTime && module.loadStartTime
    ? `${(module.loadEndTime - module.loadStartTime).toFixed(0)}ms`
    : '—';

  return (
    <div className="module-card glass-card">
      <div className="module-card__header">
        <div className="module-card__status">
          <span
            className="module-card__status-dot"
            style={{ backgroundColor: statusColor[module.status] || 'var(--color-status-offline)' }}
          />
          <span className="module-card__status-text">{module.status}</span>
        </div>
        <span
          className="module-card__framework-badge"
          style={{
            color: frameworkColor[module.framework] || 'var(--color-accent-primary)',
            borderColor: frameworkColor[module.framework] || 'var(--color-accent-primary)',
            background: 'rgba(255,255,255,0.04)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase'
          }}
        >
          {module.framework}
        </span>
      </div>

      <h3 className="module-card__name" style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '0.75rem', marginBottom: '0.25rem' }}>{module.name}</h3>
      <p className="module-card__version" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '1rem' }}>v{module.version}</p>

      <div className="module-card__metrics" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: 'var(--color-bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
        <div className="module-card__metric">
          <span className="module-card__metric-label" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>Load Time</span>
          <span className="module-card__metric-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 600 }}>{loadTime}</span>
        </div>
        <div className="module-card__metric">
          <span className="module-card__metric-label" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>Bundle Size</span>
          <span className="module-card__metric-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 600 }}>
            {module.bundleSize ? `${module.bundleSize}KB` : '—'}
          </span>
        </div>
      </div>

      <div className="module-card__metadata" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--color-text-tertiary)' }}>Owner:</span>
          <span>{module.metadata.owner}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--color-text-tertiary)' }}>Deployment:</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{module.metadata.deploymentId}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--color-text-tertiary)' }}>Git Commit:</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{module.metadata.gitCommit}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--color-text-tertiary)' }}>Framework:</span>
          <span>{module.metadata.frameworkVersion}</span>
        </div>
      </div>

      <div className="module-card__dependencies">
        <h4 style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Shared Dependencies</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
          {module.metadata.sharedDependencies.map((dep: string) => (
            <span key={dep} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', color: 'var(--color-text-secondary)' }}>
              {dep.replace('@impossible-resume/', '')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
