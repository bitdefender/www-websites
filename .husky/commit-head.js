const { execSync } = require('child_process');
execSync(`git add head.html`, { stdio: 'inherit' });
execSync(`git add 404.html`, { stdio: 'inherit' });