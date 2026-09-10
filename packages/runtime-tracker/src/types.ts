export type ModuleStatus = 'discovered' | 'loading' | 'loaded' | 'initializing' | 'mounted' | 'error' | 'unloaded';

export interface ModuleInfo {
  name: string;
  remoteUrl: string;
  version: string;
  framework: 'react' | 'vue' | 'svelte';
  status: ModuleStatus;
  loadStartTime: number | null;
  loadEndTime: number | null;
  mountTime: number | null;
  unmountTime: number | null;
  bundleSize: number | null;
  error: string | null;
  metadata: ModuleMetadata;
}

export interface ModuleMetadata {
  owner: string;
  deploymentId: string;
  gitCommit: string;
  buildTime: string;
  frameworkVersion: string;
  runtimeDependencies: string[];
  sharedDependencies: string[];
  exposedModules: string[];
  consumedRemotes: string[];
}

export interface RuntimeEvent {
  id: string;
  timestamp: number;
  type: 'module_load' | 'module_mount' | 'module_unmount' | 'module_error'
      | 'dependency_resolve' | 'event_register' | 'event_emit'
      | 'route_change' | 'interaction' | 'performance';
  module: string;
  message: string;
  data?: unknown;
}

export interface PerformanceSnapshot {
  fps: number;
  memoryUsed: number;        // MB
  memoryTotal: number;       // MB
  domNodes: number;
  eventThroughput: number;   // events per second
  moduleCount: number;
  loadedModules: string[];
}
