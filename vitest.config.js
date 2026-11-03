import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    cacheDir: '../node_modules/.vitest',
    resolve: {
        // the design system's components are an empty module in tests: they
        // check the markup the blocks build, not the components' rendering
        alias: [{
            find: /^@repobit\/dex-system-design\/.*$/,
            replacement: fileURLToPath(new URL('./src/tests/dsn-stub.js', import.meta.url)),
        }],
    },
    test: {
        environment: 'jsdom',
        globals: true,
        root: 'src',
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
