import { loadEnvConfig } from '@next/env';
import launch from '../config/launch.json';
import { launchErrors } from '../src/lib/launch';
import { resolveSiteConfig } from '../src/lib/configuration';
loadEnvConfig(process.cwd());
const errors = launchErrors(resolveSiteConfig(launch, process.env.CANONICAL_DOMAIN));
if (errors.length) { console.error('LAUNCH BLOCKED\n' + errors.map(x => ` - ${x}`).join('\n')); process.exitCode = 1; }
else console.log('Configured launch gates pass. Documentary approvals remain the owner’s responsibility.');
