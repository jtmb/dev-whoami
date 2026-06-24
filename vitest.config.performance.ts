// Performance test configuration for bundle size analysis, memory usage, and code coverage
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/tests/performance/**/*.test.{ts,tsx}'],
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    isolate: false, // Enable cross-test coverage reporting
    coverage: {
      reporter: ['text', 'json', 'lcov', 'html'],
      reportsDirectory: './coverage/performance',
      include: [
        'src/**/*.ts',
        'src/**/*.tsx'
      ],
      exclude: ['**/node_modules/**', '**/.git/**'],
    },
  },
});