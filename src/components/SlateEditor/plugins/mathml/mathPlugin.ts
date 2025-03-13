/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin } from "@ndla/editor";
import { MATH_ELEMENT_TYPE, MATH_PLUGIN } from "./mathTypes";

export const mathPlugin = createPlugin({
  name: MATH_PLUGIN,
  type: MATH_ELEMENT_TYPE,
  isInline: true,
  isVoid: true,
});
