import React, { useState, useEffect } from 'react';
import { FrameworkBridge } from './FrameworkBridge';
import { LoadingFallback } from './LoadingFallback';
import { useRemoteModule } from '../hooks/useRemoteModule';
import type { ManifestRemote } from '../hooks/usePluginManifest';
import { eventBus } from '@impossible-resume/event-bus';
import { moduleTracker } from '@impossible-resume/runtime-tracker';

// ──────────────────────────────────────────────
// Module-level chaos state — persists across
// component mount/unmount cycles so that a
// module killed while off-screen stays killed
// when navigated to.
// ──────────────────────────────────────────────
const chaosFailures = new Set<string>();
const chaosListeners = new Set<() => void>();

function notifyChaosListeners() {
  chaosListeners.forEach((fn) => fn());
}

// Single global subscription — runs once when this module is first imported
eventBus.subscribe('ops:failure_injected', 'remote-loader', (payload: any) => {
  const mod = payload.data?.module ?? payload.module;
  if (mod) {
    chaosFailures.add(mod);
    notifyChaosListeners();
  }
});

eventBus.subscribe('ops:failure_recovered', 'remote-loader', (payload: any) => {
  const mod = payload.data?.module ?? payload.module;
  if (mod) {
    chaosFailures.delete(mod);
    notifyChaosListeners();
  }
});

eventBus.subscribe('ops:all_recovered', 'remote-loader', () => {
  chaosFailures.clear();
  notifyChaosListeners();
});

// ──────────────────────────────────────────────

interface RemoteLoaderProps {
  remote: ManifestRemote;
}

export function RemoteLoader({ remote }: RemoteLoaderProps) {
  const isDev = process.env.NODE_ENV !== 'production';
  const remoteUrl = isDev ? remote.devUrl : remote.url;

  // Local state driven by the global chaosFailures set
  const [simulatedError, setSimulatedError] = useState<Error | null>(
    chaosFailures.has(remote.name)
      ? new Error(`[Simulated Chaos] Module ${remote.name} failure`)
      : null
  );

  useEffect(() => {
    // Sync on mount in case chaos state changed between render and effect
    if (chaosFailures.has(remote.name) && !simulatedError) {
      setSimulatedError(new Error(`[Simulated Chaos] Module ${remote.name} failure`));
    }

    // Listen for future chaos state changes
    const listener = () => {
      if (chaosFailures.has(remote.name)) {
        setSimulatedError(new Error(`[Simulated Chaos] Module ${remote.name} failure`));
      } else {
        setSimulatedError(null);
      }
    };
    chaosListeners.add(listener);

    return () => {
      chaosListeners.delete(listener);
    };
  }, [remote.name]);

  const { component: Component, mountFn, unmountFn, loading, error } = useRemoteModule({
    name: remote.name,
    scope: remote.scope,
    module: remote.module,
    url: remoteUrl,
    framework: remote.framework,
  });

  if (simulatedError || error) {
    throw (simulatedError || error);
  }

  if (loading) {
    return <LoadingFallback moduleName={remote.name} />;
  }

  if (remote.framework === 'react' && Component) {
    return <Component />;
  }

  if ((remote.framework === 'vue' || remote.framework === 'svelte') && mountFn && unmountFn) {
    return (
      <FrameworkBridge
        name={remote.name}
        mountFn={mountFn}
        unmountFn={unmountFn}
        framework={remote.framework}
      />
    );
  }

  return null;
}
