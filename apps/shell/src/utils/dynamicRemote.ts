interface RemoteConfig {
  scope: string;   // The name used in Module Federation (e.g., 'projects')
  url: string;     // URL to remoteEntry.js
  module: string;  // The exposed module path (e.g., './Projects')
}

export async function loadRemoteModule(config: RemoteConfig): Promise<any> {
  const { scope, url, module: modulePath } = config;

  if (!(window as any)[scope]) {
    await loadRemoteScript(url, scope);
  }

  const container = (window as any)[scope];
  if (!container) {
    throw new Error(`Remote container '${scope}' not found on window after loading ${url}`);
  }

  // Initialize shared scope
  await __webpack_init_sharing__('default');
  await container.init(__webpack_share_scopes__.default);

  const factory = await container.get(modulePath);
  if (!factory) {
    throw new Error(`Module '${modulePath}' not found in remote '${scope}'`);
  }

  return factory();
}

function loadRemoteScript(url: string, scope: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[data-remote="${scope}"]`);
    if (existingScript) {
      if ((window as any)[scope]) {
        resolve();
      } else {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', () => reject(new Error(`Failed to load remote: ${scope}`)));
      }
      return;
    }

    const script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.async = true;
    script.setAttribute('data-remote', scope);

    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load remote entry: ${url}`));

    document.head.appendChild(script);
  });
}

declare function __webpack_init_sharing__(scope: string): Promise<void>;
declare const __webpack_share_scopes__: Record<string, any>;
