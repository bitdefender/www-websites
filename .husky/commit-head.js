const { execSync } = require('child_process');
execSync(`git add head.html`, { stdio: 'inherit' });
execSync(`git add 404.html`, { stdio: 'inherit' });
execSync(`git add -A _src/dist`, { stdio: 'inherit' });
