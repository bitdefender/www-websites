import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    root: '_src',
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: '../coverage',
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.js',
        '**/vendor/**',
      ],
    },
  },
});
