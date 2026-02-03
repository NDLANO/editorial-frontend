/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isElementOfType } from "@ndla/editor";
import { Node } from "slate";
import { COMMENT_INLINE_ELEMENT_TYPE } from "../types";

export const isCommentInlineElement = (node: Node | undefined) => isElementOfType(node, COMMENT_INLINE_ELEMENT_TYPE);
