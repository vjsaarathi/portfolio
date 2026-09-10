import { moduleTracker } from '@impossible-resume/runtime-tracker';
import type { ModuleInfo } from '@impossible-resume/runtime-tracker';

class ModuleRegistry {
  private disabledModules: Set<string> = new Set();

  registerModule(name: string, url: string, framework: 'react' | 'vue' | 'svelte', metadata: any): void {
    moduleTracker.registerModule(name, url, framework, metadata);
  }

  disableModule(name: string): void {
    this.disabledModules.add(name);
    moduleTracker.updateStatus(name, 'error', { error: 'Manually disabled via operations panel' });
  }

  enableModule(name: string): void {
    this.disabledModules.delete(name);
    moduleTracker.updateStatus(name, 'discovered');
  }

  isDisabled(name: string): boolean {
    return this.disabledModules.has(name);
  }

  getModules(): ModuleInfo[] {
    return moduleTracker.getModules();
  }

  getModule(name: string): ModuleInfo | undefined {
    return moduleTracker.getModule(name);
  }
}

export const moduleRegistry = new ModuleRegistry();
