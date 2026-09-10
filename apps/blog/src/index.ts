import { createApp, App as VueApp } from 'vue';
import BlogApp from './App.vue';
import { eventBus } from '@impossible-resume/event-bus';
import '@impossible-resume/design-tokens/index.css';
import './styles/blog.css';

let app: VueApp | null = null;

export function mount(container: HTMLElement): void {
  app = createApp(BlogApp);
  app.mount(container);
  eventBus.emit('module:mounted', 'blog', { framework: 'vue' });
}

export function unmount(): void {
  if (app) {
    app.unmount();
    app = null;
    eventBus.emit('module:unmounted', 'blog', { framework: 'vue' });
  }
}

// Standalone mode when running on port 3003 directly
if (typeof document !== 'undefined') {
  const container = document.getElementById('blog-standalone-root');
  if (container) {
    mount(container);
  }
}
