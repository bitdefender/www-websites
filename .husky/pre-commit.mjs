import { execSync } from 'node:child_process';

// `_src/` is generated from `src/` (see vite.config.mjs). Rebuild and stage it
// whenever a source is staged (added, changed or deleted) or the inputs of
// the vendor bundle change, so the served tree never lags its source.
const BUILD_INPUTS = ['package.json', 'package-lock.json', 'vite.config.mjs'];

const staged = execSync('git diff --cached --name-only', { encoding: 'utf8' }).split('\n').filter(Boolean);
if (staged.some((file) => file.startsWith('src/') || BUILD_INPUTS.includes(file))) {
  execSync('npm run build --silent', { stdio: 'inherit' });
  execSync('git add -A _src', { stdio: 'inherit' });
}
