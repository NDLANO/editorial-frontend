/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { RelatedContentEmbedData } from "@ndla/types-embed";

export interface RelatedElement {
  type: "related";
  data: RelatedContentEmbedData[];
  children: Descendant[];
}

export const RELATED_ELEMENT_TYPE = "related";
export const RELATED_PLUGIN = "related";
