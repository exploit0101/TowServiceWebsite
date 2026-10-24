import { cpSync, existsSync, lstatSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeStaticSegments } from './normalize-static-segments';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const basePath = process.env.GITHUB_PAGES_BASE_PATH || '';
if (!/^(?:\/[A-Za-z0-9._-]+)*$/.test(basePath) || basePath.split('/').some(part => part === '.' || part === '..')) {
  throw new Error('GITHUB_PAGES_BASE_PATH must be empty or a safe /repository path without a trailing slash.');
}
const staging = mkdtempSync(join(root, '.pages-build-'));
const output = join(root, 'pages-out');

// Delete only these generated, direct workspace children; never follow a replaced symlink.
function clearGenerated(path: string) {
  if (dirname(resolve(path)) !== root || (path !== output && path !== staging)) throw new Error('Unsafe generated path.');
  if (existsSync(path)) {
    if (lstatSync(path).isSymbolicLink()) throw new Error('Refusing to remove a generated-directory symlink.');
    rmSync(path, { recursive: true, force: true });
  }
}

try {
  const excluded = [join(root, 'src', 'app', 'api'), join(root, 'src', 'app', 'areas')];
  cpSync(join(root, 'src'), join(staging, 'src'), { recursive: true, filter: path => !excluded.includes(path) });
  for (const entry of ['config', 'public', 'next.config.ts', 'package.json', 'package-lock.json', 'next-env.d.ts']) {
    cpSync(join(root, entry), join(staging, entry), { recursive: true });
  }
  const tsconfig = JSON.parse(readFileSync(join(root, 'tsconfig.json'), 'utf8'));
  tsconfig.include = ['next-env.d.ts', 'src/**/*.ts', 'src/**/*.tsx', '.next/types/**/*.ts'];
  tsconfig.exclude = ['node_modules'];
  writeFileSync(join(staging, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2) + '\n');
  console.log(`Building GitHub Pages design demo at ${basePath || '/'}. Live service, callback delivery and indexing remain disabled.`);
  const result = spawnSync(process.execPath, [join(root, 'node_modules', 'next', 'dist', 'bin', 'next'), 'build', '--webpack'], {
    cwd: staging,
    stdio: 'inherit',
    env: { ...process.env, GITHUB_PAGES_DEMO: '1', GITHUB_PAGES_BASE_PATH: basePath, SITE_DEPLOYMENT: 'preview', NEXT_PUBLIC_GOOGLE_TAG_ID: '', NEXT_TELEMETRY_DISABLED: '1' },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`GitHub Pages build failed (${result.status}).`);
  clearGenerated(output);
  cpSync(join(staging, 'out'), output, { recursive: true });
  const segmentAliases = normalizeStaticSegments(output);
  if (segmentAliases) console.log(`Added ${segmentAliases} static RSC segment aliases for Windows export compatibility.`);
  writeFileSync(join(output, '.nojekyll'), '');
  console.log('GitHub Pages artifact: pages-out/ (normal .next development output was preserved).');
} finally {
  clearGenerated(staging);
}
