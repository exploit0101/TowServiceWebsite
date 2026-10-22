/** Public assets need an explicit prefix; Next Link applies basePath itself. */
export function publicAssetPath(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) throw new Error('Expected a local public asset path.');
  return `${process.env.NEXT_PUBLIC_SITE_BASE_PATH || ''}${path}`;
}
