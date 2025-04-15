/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { ConceptEmbedData } from "@ndla/types-embed";

export const CONCEPT_INLINE_ELEMENT_TYPE = "concept-inline" as const;
export const CONCEPT_INLINE_PLUGIN = "concept-inline" as const;

export interface ConceptInlineElement {
  type: "concept-inline";
  data: ConceptEmbedData;
  children: Descendant[];
  conceptType?: "gloss" | "concept";
  isFirstEdit?: boolean;
}
