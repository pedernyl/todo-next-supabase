import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // To use authentication, add the following to your E2E test files:
  // test.use({ storageState: 'storageState.json' });
});
