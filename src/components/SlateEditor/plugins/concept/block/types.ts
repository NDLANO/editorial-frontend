/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ConceptEmbedData } from "@ndla/types-embed";
import { Descendant } from "slate";

export const CONCEPT_BLOCK_ELEMENT_TYPE = "concept-block" as const;
export const CONCEPT_BLOCK_PLUGIN = "concept-block" as const;
export const GLOSS_BLOCK_ELEMENT_TYPE = "gloss-block" as const;

export interface ConceptBlockElement {
  type: "concept-block" | "gloss-block";
  data: ConceptEmbedData;
  children: Descendant[];
  conceptType?: "concept" | "gloss";
  isFirstEdit?: boolean;
}
