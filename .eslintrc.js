module.exports = {
  root: true,
  extends: 'airbnb-base',
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'linebreak-style': ['error',
      process.platform === 'win32' ? 'windows' : 'unix',
    ],
    // allow reassigning param
    'no-param-reassign': [2, { props: false }],
    'import/extensions': ['error', {
      js: 'always',
    }],
    // the node resolver doesn't read `exports`; vite.config.mjs resolves these
    'import/no-unresolved': ['error', { ignore: ['^@repobit/dex-system-design/'] }],
  },
  overrides: [{
    // the build runs in Node and imports build tools, which are devDependencies:
    // `dependencies` lists only the runtime packages the build bundles
    files: ['vite.config.mjs'],
    env: { browser: false, node: true },
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      // the node resolver doesn't read `exports`
      'import/no-unresolved': ['error', { ignore: ['^vite$'] }],
    },
  }],
};
