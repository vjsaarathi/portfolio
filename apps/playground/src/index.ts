import PlaygroundApp from './App.svelte';
import { eventBus } from '@impossible-resume/event-bus';
import '@impossible-resume/design-tokens/index.css';
import './styles/playground.css';

let app: any = null;

export function mount(container: HTMLElement): void {
  app = new PlaygroundApp({ target: container });
  eventBus.emit('module:mounted', 'playground', { framework: 'svelte' });
}

export function unmount(): void {
  if (app) {
    if (app.$destroy) {
      app.$destroy();
    }
    app = null;
    eventBus.emit('module:unmounted', 'playground', { framework: 'svelte' });
  }
}

// Standalone mode when running on port 3006 directly
if (typeof document !== 'undefined') {
  const container = document.getElementById('playground-standalone-root');
  if (container) {
    mount(container);
  }
}
