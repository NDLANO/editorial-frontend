/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CommentEmbedData } from "@ndla/types-embed";
import { Descendant } from "slate";

export interface CommentInlineElement {
  type: "comment-inline";
  data: CommentEmbedData;
  children: Descendant[];
  isFirstEdit?: boolean;
}

export const COMMENT_INLINE_ELEMENT_TYPE = "comment-inline";
export const COMMENT_INLINE_PLUGIN = "comment-inline";
