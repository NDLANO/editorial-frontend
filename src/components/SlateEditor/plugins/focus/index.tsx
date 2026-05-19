/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin, focusPlugin as _focusPlugin, FOCUS_PLUGIN } from "@ndla/editor";

export const focusPlugin = process.env.NODE_ENV === "test" ? createPlugin({ name: FOCUS_PLUGIN }) : _focusPlugin;
