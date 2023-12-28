/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/server/server.ts'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'esnext',
  sourcemap: true,
  sourcesContent: false,
  external: ['dtrace-provider', 'vite'],
  outfile: 'build/server.mjs',
  banner: {
    js: `const require = await import('module').then($=>$.createRequire(import.meta.url));`,
  },
});
