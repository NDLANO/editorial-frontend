/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { CONCEPT_BLOCK_ELEMENT_TYPE, ConceptBlockElement } from "./types";

export const defaultConceptBlock = (conceptType: ConceptBlockElement["conceptType"] = "concept") =>
  slatejsx("element", { type: CONCEPT_BLOCK_ELEMENT_TYPE, data: {}, isFirstEdit: true, conceptType }, [{ text: "" }]);
