/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CommentEmbedData } from "@ndla/types-embed";
import { Descendant } from "slate";

export interface CommentBlockElement {
  type: "comment-block";
  data: CommentEmbedData;
  children: Descendant[];
  isFirstEdit?: boolean;
}

export const COMMENT_BLOCK_ELEMENT_TYPE = "comment-block";
export const COMMENT_BLOCK_PLUGIN = "comment-block";
