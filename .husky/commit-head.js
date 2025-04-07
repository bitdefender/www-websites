const { execSync } = require('child_process');
execSync(`git add head.html`, { stdio: 'inherit' });