import type { NextConfig } from 'next';
const pagesDemo = process.env.GITHUB_PAGES_DEMO === '1';
const basePath = pagesDemo ? process.env.GITHUB_PAGES_BASE_PATH || '' : '';
if (!/^(?:\/[A-Za-z0-9._-]+)*$/.test(basePath) || basePath.split('/').some(part => part === '.' || part === '..')) {
  throw new Error('GITHUB_PAGES_BASE_PATH must be empty or a safe /repository path without a trailing slash.');
}
const config: NextConfig = {
  poweredByHeader: false,
  env: {
    SITE_BUILD_DEPLOYMENT: !pagesDemo && process.env.SITE_DEPLOYMENT === 'production' ? 'production' : 'preview',
    NEXT_PUBLIC_SITE_BASE_PATH: basePath,
  },
  ...(pagesDemo ? { output: 'export', trailingSlash: true, basePath, images: { unoptimized: true } } : {}),
  ...(!pagesDemo ? { async headers() {
    return [{ source: '/(.*)', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ] }];
  } } : {}),
};
export default config;
