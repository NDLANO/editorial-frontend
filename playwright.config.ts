/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { defineConfig } from '@playwright/test';
import { join } from 'path';

export const STORAGE_STATE = join(__dirname, 'e2e/.auth/user.json');

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: 'html',
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'setup', testMatch: 'e2e/auth.setup.ts' },
    {
      name: 'specs',
      testMatch: '**/*.spec.ts',
      dependencies: ['setup'],
      use: {
        storageState: STORAGE_STATE,
      },
    },
  ],

  // Automatically run against prod-build on CI for speed and accuracy.
  webServer: process.env.CI
    ? {
        command: 'yarn start-prod',
        url: 'http://localhost:3000',
      }
    : undefined,
});
