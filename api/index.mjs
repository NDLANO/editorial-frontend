/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// This is just an entrypoint for vercel.

import express from "express";
import backend from "../build/server.mjs";

const app = express();

app.use(backend);

export default app;
