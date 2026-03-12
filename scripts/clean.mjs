/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { rm } from "node:fs/promises";

// This will do nothing if the path does not exist.
await rm("./build", { recursive: true, force: true });
await rm("./node_modules/.cache", { recursive: true, force: true });
await rm("./node_modules/.vite", { recursive: true, force: true });
