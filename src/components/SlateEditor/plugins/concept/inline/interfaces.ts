/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { ConceptEmbedData } from "@ndla/types-embed";

export interface ConceptInlineElement {
  type: "concept-inline";
  data: ConceptEmbedData;
  isFirstEdit?: boolean;
  children: Descendant[];
}
