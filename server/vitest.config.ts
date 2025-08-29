import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'src/tests/',
        '**/*.test.ts',
        '**/*.spec.ts'
      ]
    },
    testTimeout: 10000,
    hookTimeout: 10000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@/config': path.resolve(__dirname, './config'),
      '@/database': path.resolve(__dirname, './database'),
      '@/routes': path.resolve(__dirname, './routes'),
      '@/services': path.resolve(__dirname, './services'),
      '@/utils': path.resolve(__dirname, './utils'),
      '@/types': path.resolve(__dirname, './types')
    }
  }
});
