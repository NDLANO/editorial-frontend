/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  format: "esm",
  platform: "node",
  target: "esnext",
  sourcemap: true,
  sourcesContent: false,
  external: ["dtrace-provider", "vite"],
  outfile: "build/server.mjs",
  // Mixing ESM and CJS is still a struggle. This is a workaround for now.
  banner: {
    js: `const require = createRequire(import.meta.url);`,
  },
});
