/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Descendant } from "slate";
import { CommentEmbedData } from "@ndla/types-embed";
import { TYPE_COMMENT_BLOCK } from "./block/types";
import { TYPE_COMMENT_INLINE } from "./inline/types";

type CommentTypes = typeof TYPE_COMMENT_INLINE | typeof TYPE_COMMENT_BLOCK;

export interface CommentElement<T extends CommentTypes> {
  type: T;
  data: CommentEmbedData;
  children: Descendant[];
  isFirstEdit?: boolean;
}
