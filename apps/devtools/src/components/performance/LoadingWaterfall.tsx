import React from 'react';
import type { ModuleInfo } from '@impossible-resume/runtime-tracker';

interface LoadingWaterfallProps {
  modules: ModuleInfo[];
}

const frameworkColors: Record<string, string> = {
  react: 'var(--color-react)',
  vue: 'var(--color-vue)',
  svelte: 'var(--color-svelte)',
};

export function LoadingWaterfall({ modules }: LoadingWaterfallProps) {
  const modulesWithTiming = modules.filter((m) => m.loadStartTime && m.loadEndTime);
  if (modulesWithTiming.length === 0) return null;

  const earliest = Math.min(...modulesWithTiming.map((m) => m.loadStartTime!));
  const latest = Math.max(...modulesWithTiming.map((m) => m.loadEndTime!));
  const totalRange = latest - earliest || 1;

  return (
    <div className="loading-waterfall">
      <h4 className="loading-waterfall__title">Module Load Waterfall</h4>
      <div className="loading-waterfall__chart">
        {modulesWithTiming.map((mod) => {
          const startPct = ((mod.loadStartTime! - earliest) / totalRange) * 100;
          const widthPct = ((mod.loadEndTime! - mod.loadStartTime!) / totalRange) * 100;
          const loadTime = (mod.loadEndTime! - mod.loadStartTime!).toFixed(0);

          return (
            <div key={mod.name} className="loading-waterfall__row">
              <span className="loading-waterfall__name">{mod.name}</span>
              <div className="loading-waterfall__bar-container">
                <div
                  className="loading-waterfall__bar"
                  style={{
                    marginLeft: `${startPct}%`,
                    width: `${Math.max(widthPct, 2)}%`,
                    background: frameworkColors[mod.framework] || 'var(--color-accent-primary)',
                  }}
                />
              </div>
              <span className="loading-waterfall__time">{loadTime}ms</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
