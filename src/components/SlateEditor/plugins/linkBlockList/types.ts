/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { LinkBlockEmbedData } from "@ndla/types-embed";
import { Descendant } from "slate";

export interface LinkBlockListElement {
  type: "link-block-list";
  data?: LinkBlockEmbedData[];
  isFirstEdit?: boolean;
  children: Descendant[];
}

export const LINK_BLOCK_LIST_ELEMENT_TYPE = "link-block-list";
export const LINK_BLOCK_LIST_PLUGIN = "link-block-list";
