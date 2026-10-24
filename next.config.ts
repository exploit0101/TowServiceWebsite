import type { NextConfig } from 'next';
const pagesBuild = process.env.GITHUB_PAGES_BUILD === '1' || process.env.GITHUB_PAGES_DEMO === '1' || process.env.GITHUB_PAGES_PRODUCTION === '1';
const pagesProduction = pagesBuild && process.env.GITHUB_PAGES_PRODUCTION === '1';
const basePath = pagesBuild ? process.env.GITHUB_PAGES_BASE_PATH || '' : '';
if (!/^(?:\/[A-Za-z0-9._-]+)*$/.test(basePath) || basePath.split('/').some(part => part === '.' || part === '..')) {
  throw new Error('GITHUB_PAGES_BASE_PATH must be empty or a safe /repository path without a trailing slash.');
}
const config: NextConfig = {
  poweredByHeader: false,
  env: {
    SITE_BUILD_DEPLOYMENT: pagesProduction || (!pagesBuild && process.env.SITE_DEPLOYMENT === 'production') ? 'production' : 'preview',
    SITE_BUILD_STATIC_HOST: pagesBuild ? 'github-pages' : 'server',
    NEXT_PUBLIC_SITE_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_TRAILING_SLASH: pagesBuild ? 'true' : 'false',
  },
  ...(pagesBuild ? { output: 'export', trailingSlash: true, basePath, images: {
    loader: 'custom',
    loaderFile: './src/lib/static-image-loader.ts',
    deviceSizes: [640, 768, 960, 1200, 1440],
    imageSizes: [320, 480],
  } } : {}),
  ...(!pagesBuild ? { async headers() {
    return [{ source: '/(.*)', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ] }];
  } } : {}),
};
export default config;
