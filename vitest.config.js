import { defineConfig } from 'vitest/config';

export default defineConfig({
    cacheDir: '../node_modules/.vitest',
    test: {
        environment: 'jsdom',
        globals: true,
        root: '_src',
        include: ['tests/**/*.test.js'],
        coverage: {
            provider: 'v8',
            reporters: ['text', 'html', 'lcov'],
            exclude: [
                'node_modules/',
                'tests/',
                '**/*.config.js',
                '**/vendor/**',
            ],
        },
        reporters: ['default'],
    },
});
