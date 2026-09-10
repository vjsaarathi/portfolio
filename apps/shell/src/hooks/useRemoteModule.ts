import React, { useState, useEffect, useRef } from 'react';
import { loadRemoteModule } from '../utils/dynamicRemote';
import { moduleTracker } from '@impossible-resume/runtime-tracker';

interface UseRemoteModuleResult {
  component: React.ComponentType<any> | null;
  mountFn: ((container: HTMLElement) => void) | null;
  unmountFn: (() => void) | null;
  loading: boolean;
  error: Error | null;
  retry: () => void;
}

interface RemoteModuleConfig {
  name: string;
  scope: string;
  module: string;
  url: string;
  framework: 'react' | 'vue' | 'svelte';
}

export function useRemoteModule(config: RemoteModuleConfig): UseRemoteModuleResult {
  const [component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [mountFn, setMountFn] = useState<((el: HTMLElement) => void) | null>(null);
  const [unmountFn, setUnmountFn] = useState<(() => void) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const loadStartTime = useRef<number>(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      loadStartTime.current = performance.now();

      moduleTracker.updateStatus(config.name, 'loading');

      // Chaos Engineering Check
      const trackerModule = moduleTracker.getModules().find(m => m.name === config.name);
      if (trackerModule?.metadata?.error?.includes('Chaos') && trackerModule?.status !== 'mounted') {
        const simError = new Error(trackerModule.metadata.error);
        setError(simError);
        setLoading(false);
        moduleTracker.updateStatus(config.name, 'error', { error: simError.message });
        return;
      }

      try {
        const remoteModule = await loadRemoteModule({
          scope: config.scope,
          url: config.url,
          module: config.module,
        });

        if (cancelled) return;

        const loadTime = performance.now() - loadStartTime.current;

        moduleTracker.updateStatus(config.name, 'loaded', {
          bundleSize: Math.floor(Math.random() * 150 + 30),
        });

        if (config.framework === 'react') {
          setComponent(() => remoteModule.default || remoteModule);
        } else {
          setMountFn(() => remoteModule.mount);
          setUnmountFn(() => remoteModule.unmount);
        }

        setLoading(false);
        moduleTracker.updateStatus(config.name, 'initializing');
      } catch (err) {
        if (cancelled) return;
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setLoading(false);
        moduleTracker.updateStatus(config.name, 'error', { error: error.message });
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [config.name, config.scope, config.module, config.url, config.framework, retryCount]);

  return {
    component,
    mountFn,
    unmountFn,
    loading,
    error,
    retry: () => setRetryCount((c) => c + 1),
  };
}
