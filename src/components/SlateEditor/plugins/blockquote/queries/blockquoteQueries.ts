/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isElementOfType } from "@ndla/editor";
import { Node } from "slate";
import { BLOCK_QUOTE_ELEMENT_TYPE } from "../blockquoteTypes";

export const isBlockQuoteElement = (element: Node | undefined) => isElementOfType(element, BLOCK_QUOTE_ELEMENT_TYPE);
