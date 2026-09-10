import { PerformanceSnapshot, RuntimeEvent } from './types';

export class PerformanceMonitor {
  private fpsFrames: number[] = [];
  private currentFps = 60;
  private animationFrameId: number | null = null;
  private eventsFn: () => RuntimeEvent[];

  constructor(eventsFn: () => RuntimeEvent[]) {
    this.eventsFn = eventsFn;
  }

  startFpsMonitor(): void {
    const measureFps = () => {
      const now = performance.now();
      this.fpsFrames.push(now);
      while (this.fpsFrames.length > 0 && this.fpsFrames[0] < now - 1000) {
        this.fpsFrames.shift();
      }
      this.currentFps = this.fpsFrames.length;
      this.animationFrameId = requestAnimationFrame(measureFps);
    };
    this.animationFrameId = requestAnimationFrame(measureFps);
  }

  getSnapshot(moduleCount: number, mountedModules: string[]): PerformanceSnapshot {
    const memory = typeof window !== 'undefined' && (performance as any).memory;
    return {
      fps: this.currentFps,
      memoryUsed: memory ? Math.round(memory.usedJSHeapSize / 1048576) : 0,
      memoryTotal: memory ? Math.round(memory.jsHeapSizeLimit / 1048576) : 0,
      domNodes: typeof document !== 'undefined' ? document.querySelectorAll('*').length : 0,
      eventThroughput: this.calculateThroughput(),
      moduleCount,
      loadedModules: mountedModules,
    };
  }

  private calculateThroughput(): number {
    const events = this.eventsFn();
    const now = performance.now();
    const oneSecondAgo = now - 1000;
    return events.filter((e) => e.timestamp > oneSecondAgo).length;
  }

  destroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
