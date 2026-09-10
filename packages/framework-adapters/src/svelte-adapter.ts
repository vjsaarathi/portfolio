export interface SvelteAdapterOptions {
  component: any;
  props?: Record<string, unknown>;
}

export interface SvelteAdapterInstance {
  mount: (container: HTMLElement) => void;
  unmount: () => void;
  update: (props: Record<string, unknown>) => void;
}

export function createSvelteAdapter(options: SvelteAdapterOptions): SvelteAdapterInstance {
  let instance: any = null;

  return {
    mount(container: HTMLElement) {
      const Component = options.component;
      instance = new Component({
        target: container,
        props: options.props || {},
      });
    },

    unmount() {
      if (instance) {
        if (instance.$destroy) {
          instance.$destroy();
        }
        instance = null;
      }
    },

    update(props: Record<string, unknown>) {
      if (instance && instance.$set) {
        instance.$set(props);
      }
    },
  };
}
