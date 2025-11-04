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
  },
};
