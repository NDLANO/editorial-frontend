/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin } from "@ndla/editor";
import { REPHRASE_ELEMENT_TYPE, REPHRASE_PLUGIN } from "./rephraseTypes";

export const rephrasePlugin = createPlugin({
  name: REPHRASE_ELEMENT_TYPE,
  type: REPHRASE_PLUGIN,
  isInline: true,
});
