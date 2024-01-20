/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    test: {
      include: ['src/**/__tests__/*-test.(js|jsx|ts|tsx)'],
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/__tests__/vitest.setup.ts',
    },
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
      }),
    ],
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  };
});
