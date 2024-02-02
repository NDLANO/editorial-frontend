/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { ConceptEmbedData } from "@ndla/types-embed";
import { TYPE_CONCEPT_BLOCK } from "./types";

export const defaultConceptBlock = (conceptType: ConceptEmbedData["conceptType"] = "concept") =>
  slatejsx("element", { type: TYPE_CONCEPT_BLOCK, data: { conceptType: conceptType }, isFirstEdit: true }, [
    { text: "" },
  ]);
