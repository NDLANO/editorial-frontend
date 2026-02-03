/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isElementOfType } from "@ndla/editor";
import { Node } from "slate";
import { CONCEPT_BLOCK_ELEMENT_TYPE, ConceptBlockElement } from "./types";

export const isConceptBlockElement = (element: Node | undefined): element is ConceptBlockElement =>
  isElementOfType<"concept-block">(element, CONCEPT_BLOCK_ELEMENT_TYPE);
