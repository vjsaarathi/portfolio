export interface VueAdapterOptions {
  component: any;
  props?: Record<string, unknown>;
  elementId?: string;
}

export interface VueAdapterInstance {
  mount: (container: HTMLElement) => void;
  unmount: () => void;
  update: (props: Record<string, unknown>) => void;
}

export function createVueAdapter(options: VueAdapterOptions): VueAdapterInstance {
  let app: any = null;

  return {
    mount(container: HTMLElement) {
      import('vue').then(({ createApp, reactive }) => {
        const state = reactive(options.props || {});
        app = createApp(options.component, state);
        app.mount(container);
      }).catch((err) => {
        console.error('[VueAdapter] Error mounting Vue component:', err);
      });
    },

    unmount() {
      if (app) {
        app.unmount();
        app = null;
      }
    },

    update(props: Record<string, unknown>) {
      console.warn('[VueAdapter] Props update should be handled via reactive state/event bus', props);
    },
  };
}
