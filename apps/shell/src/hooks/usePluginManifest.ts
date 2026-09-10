import { useState, useEffect } from 'react';
import { moduleTracker } from '@impossible-resume/runtime-tracker';
import { eventBus } from '@impossible-resume/event-bus';

interface ManifestRemote {
  name: string;
  scope: string;
  module: string;
  url: string;
  devUrl: string;
  route: string;
  navLabel: string | null;
  navOrder: number;
  framework: 'react' | 'vue' | 'svelte';
  version: string;
  metadata: Record<string, any>;
}

export function usePluginManifest() {
  const [manifest, setManifest] = useState<ManifestRemote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadManifest() {
      try {
        // Runtime fetch — NOT bundled at build time.
        // This allows adding new remotes without rebuilding the shell.
        const isDev = process.env.NODE_ENV !== 'production';
        let remotes: ManifestRemote[];

        if (isDev) {
          // In dev, import the local manifest file
          const manifestData = await import('../manifest.json');
          remotes = manifestData.remotes || (manifestData as any).default?.remotes;
        } else {
          // In production, fetch from the static server
          const response = await fetch('/portfolio/manifest.json');
          const manifestData = await response.json();
          remotes = manifestData.remotes;
        }

        setManifest(remotes);

        for (const remote of remotes) {
          moduleTracker.registerModule(
            remote.name,
            remote.url,
            remote.framework,
            remote.metadata as any
          );
        }

        moduleTracker.addEvent('module_load', 'shell', `Discovered ${remotes.length} remote applications`);
        eventBus.emit('manifest:loaded', 'shell', { count: remotes.length });
      } catch (err) {
        console.error('Failed to load manifest:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }

    loadManifest();
  }, []);

  return { manifest, loading, error };
}

export type { ManifestRemote };
