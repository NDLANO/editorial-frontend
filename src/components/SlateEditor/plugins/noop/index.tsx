/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { noopPlugin as _noopPlugin, noopSerializer as _noopSerializer } from "@ndla/editor";
import { inlineElements } from "../../utils/normalizationHelpers";

export const noopSerializer = _noopSerializer;

export const noopPlugin = _noopPlugin.configure({
  options: {
    inlineBlocks: inlineElements,
  },
});

export const inlineNoopPlugin = _noopPlugin.configure({ options: { inlineBlocks: { value: [], override: true } } });
