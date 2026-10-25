import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    globalSetup: ['./src/tests/global-setup.ts'],
    testTimeout: 60000,
    hookTimeout: 60000,
  },
});
