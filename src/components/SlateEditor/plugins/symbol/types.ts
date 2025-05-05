/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, ElementType } from "slate";

export const SYMBOL_ELEMENT_TYPE = "symbol";
export const SYMBOL_PLUGIN = "symbol";

export interface SymbolElement {
  type: typeof SYMBOL_ELEMENT_TYPE;
  children: Descendant[];
  isFirstEdit?: boolean;
  symbol?: string;
}

export interface SymbolPluginOptions {
  allowedParents: ElementType[];
}
