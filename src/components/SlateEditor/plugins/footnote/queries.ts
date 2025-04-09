/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { isElementOfType } from "@ndla/editor";
import { FOOTNOTE_ELEMENT_TYPE } from "./types";

export const isFootnoteElement = (node: Descendant | undefined) => isElementOfType(node, FOOTNOTE_ELEMENT_TYPE);
