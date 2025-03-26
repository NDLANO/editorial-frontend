/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isElementOfType } from "@ndla/editor";
import { Node } from "slate";
import { COMMENT_BLOCK_ELEMENT_TYPE } from "../types";

export const isCommentBlockElement = (node: Node | undefined) => isElementOfType(node, COMMENT_BLOCK_ELEMENT_TYPE);
