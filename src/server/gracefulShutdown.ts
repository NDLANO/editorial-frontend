/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Server } from "node:http";
import { sdk } from "../instrumentation";

export const gracefulShutdown = (server: Server): void => {
  void sdk?.shutdown().catch(() => {});
  server.close(() => process.exit(0));
};
