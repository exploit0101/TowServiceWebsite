import { spawnSync } from 'node:child_process';
import { loadEnvConfig } from '@next/env';
import launch from '../config/launch.json';
import { launchErrors } from '../src/lib/launch';
import { resolveSiteConfig } from '../src/lib/configuration';
loadEnvConfig(process.cwd());
const mode = process.argv[2];
if (mode !== 'preview' && mode !== 'production') throw new Error('Choose preview or production.');
if (mode === 'production') {
  const errors = launchErrors(resolveSiteConfig(launch, process.env.CANONICAL_DOMAIN));
  if (errors.length) { console.error('LAUNCH BLOCKED\n' + errors.map(x => ` - ${x}`).join('\n')); process.exit(1); }
}
console.log(`Building ${mode}. ${mode === 'preview' ? 'Search indexing, live service and submissions are disabled. Labelled demo dialer links may be enabled.' : ''}`);
const result = spawnSync(process.execPath, ['node_modules/next/dist/bin/next', 'build'], { stdio: 'inherit', env: { ...process.env, SITE_DEPLOYMENT: mode } });
process.exit(result.status ?? 1);
