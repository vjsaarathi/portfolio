import React from 'react';
import type { ModuleInfo } from '@impossible-resume/runtime-tracker';

interface NodeInspectorProps {
  module: ModuleInfo;
  onClose: () => void;
}

export function NodeInspector({ module, onClose }: NodeInspectorProps) {
  return (
    <div className="node-inspector glass-card animate-scale-in">
      <div className="node-inspector__header">
        <h4 className="node-inspector__title">{module.name}</h4>
        <button className="node-inspector__close" onClick={onClose}>✕</button>
      </div>
      <div className="node-inspector__body">
        <div className="node-inspector__row">
          <span className="node-inspector__label">Framework</span>
          <span className="node-inspector__value">{module.framework}</span>
        </div>
        <div className="node-inspector__row">
          <span className="node-inspector__label">Version</span>
          <span className="node-inspector__value">v{module.version}</span>
        </div>
        <div className="node-inspector__row">
          <span className="node-inspector__label">Status</span>
          <span className="node-inspector__value">{module.status}</span>
        </div>
        <div className="node-inspector__row">
          <span className="node-inspector__label">Bundle Size</span>
          <span className="node-inspector__value">{module.bundleSize ? `${module.bundleSize}KB` : 'N/A'}</span>
        </div>
        <div className="node-inspector__row">
          <span className="node-inspector__label">Remote URL</span>
          <span className="node-inspector__value node-inspector__value--mono">{module.remoteUrl}</span>
        </div>
        {module.metadata?.exposedModules && (
          <div className="node-inspector__section">
            <span className="node-inspector__label">Exposed Modules</span>
            <div className="node-inspector__tags">
              {module.metadata.exposedModules.map((m: string) => (
                <span key={m} className="node-inspector__tag">{m}</span>
              ))}
            </div>
          </div>
        )}
        {module.metadata?.sharedDependencies && (
          <div className="node-inspector__section">
            <span className="node-inspector__label">Shared Dependencies</span>
            <div className="node-inspector__tags">
              {module.metadata.sharedDependencies.map((d: string) => (
                <span key={d} className="node-inspector__tag">{d}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
