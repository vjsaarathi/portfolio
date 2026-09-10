/**
 * Manages Webpack Module Federation shared scope initialization.
 * Extracted from dynamicRemote.ts for cleaner separation of concerns.
 */

declare function __webpack_init_sharing__(scope: string): Promise<void>;
declare const __webpack_share_scopes__: Record<string, any>;

let initialized = false;

export async function initializeSharedScope(): Promise<void> {
  if (initialized) return;
  await __webpack_init_sharing__('default');
  initialized = true;
}

export function getSharedScope(): any {
  return __webpack_share_scopes__?.default;
}

export async function initializeContainer(container: any): Promise<void> {
  await initializeSharedScope();
  await container.init(__webpack_share_scopes__.default);
}
