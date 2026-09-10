import React, { useState } from 'react';
import { eventBus } from '@impossible-resume/event-bus';
import { moduleTracker } from '@impossible-resume/runtime-tracker';

export function BonusTools() {
  const [activeTab, setActiveTab] = useState<'manifest' | 'config' | 'deps' | 'history'>('manifest');

  const generatedConfig = `// Auto-Generated Webpack 5 Module Federation Config (Live Scope)
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        landing: 'landing@http://localhost:3001/remoteEntry.js',
        projects: 'projects@http://localhost:3002/remoteEntry.js',
        blog: 'blog@http://localhost:3003/remoteEntry.js',
        resume: 'resume@http://localhost:3004/remoteEntry.js',
        contact: 'contact@http://localhost:3005/remoteEntry.js',
        playground: 'playground@http://localhost:3006/remoteEntry.js',
        devtools: 'devtools@http://localhost:3007/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.3.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.3.0' },
        '@impossible-resume/event-bus': { singleton: true },
        '@impossible-resume/runtime-tracker': { singleton: true },
      },
    }),
  ],
};`;

  const history = eventBus.getHistory();

  return (
    <div className="bonus-tools glass" style={{ padding: '1.25rem', borderRadius: 'var(--radius-xl)', background: 'var(--color-bg-secondary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>🛠️ Architectural DevTools & Inspection Suite</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { key: 'manifest', label: 'Remote Manifest' },
            { key: 'config', label: 'Federation Config' },
            { key: 'deps', label: 'Dependency Inspector' },
            { key: 'history', label: 'Time Travel' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: activeTab === tab.key ? 'var(--color-accent-primary)' : 'var(--color-border-primary)',
                background: activeTab === tab.key ? 'var(--color-accent-muted)' : 'transparent',
                color: activeTab === tab.key ? 'var(--color-accent-hover)' : 'var(--color-text-secondary)',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: '#050508', borderRadius: 'var(--radius-lg)', padding: '1rem', minHeight: '200px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
        {activeTab === 'config' && (
          <pre style={{ margin: 0, color: '#a7f3d0', overflowX: 'auto' }}><code>{generatedConfig}</code></pre>
        )}

        {activeTab === 'manifest' && (
          <div>
            <div style={{ color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>// Discovered Plugin Manifest (Loaded dynamically at runtime):</div>
            <pre style={{ margin: 0, color: '#93c5fd', overflowX: 'auto' }}>
              <code>{JSON.stringify(moduleTracker.getModules(), null, 2)}</code>
            </pre>
          </div>
        )}

        {activeTab === 'deps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>Shared Package Scope Analysis</div>
            {[
              { pkg: 'react', version: '^18.3.1', consumers: ['shell', 'landing', 'projects', 'resume', 'contact', 'devtools'] },
              { pkg: 'react-dom', version: '^18.3.1', consumers: ['shell', 'landing', 'projects', 'resume', 'contact', 'devtools'] },
              { pkg: 'vue', version: '^3.4.21', consumers: ['blog'] },
              { pkg: 'svelte', version: '^4.2.12', consumers: ['playground'] },
              { pkg: '@impossible-resume/event-bus', version: 'workspace:*', consumers: ['all remotes'] },
            ].map((d) => (
              <div key={d.pkg} style={{ background: 'var(--color-bg-tertiary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-accent-hover)' }}>{d.pkg} ({d.version})</span>
                <span style={{ color: 'var(--color-text-tertiary)' }}>Used by: {d.consumers.join(', ')}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--color-text-tertiary)' }}>
              <span>Recorded Session Events: {history.length}</span>
              <span>Replay Buffer Active</span>
            </div>
            <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {history.slice(-15).reverse().map((h) => (
                <div key={h.id} style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--color-accent-primary)' }}>[{h.source}]</span>
                  <span style={{ color: 'var(--color-text-primary)' }}>{h.type}</span>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>@ {h.timestamp.toFixed(0)}ms</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
