/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";

export const BLOCK_QUOTE_ELEMENT_TYPE = "quote";

export const BLOCK_QUOTE_PLUGIN = "quote";

export interface BlockQuoteElement {
  type: "quote";
  children: Descendant[];
  data?: {
    variant: "neutral" | "colored";
  };
}
