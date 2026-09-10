/**
 * Resolves static asset URLs produced by Webpack require() or raw strings.
 */
export function resolveAssetUrl(url: any): string | undefined {
  if (!url) return undefined;
  if (typeof url === 'object' && url.default) return url.default;
  if (typeof url === 'string') return url;
  return String(url);
}
