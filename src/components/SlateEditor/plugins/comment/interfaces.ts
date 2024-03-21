/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Descendant } from "slate";
import { CommentEmbedData } from "@ndla/types-embed";

export interface CommentElement {
  type: "comment";
  data: CommentEmbedData;
  children: Descendant[];
  isFirstEdit?: boolean;
}
