/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Node } from "slate";
import { isElementOfType } from "@ndla/editor";
import {
  DEFINITION_DESCRIPTION_ELEMENT_TYPE,
  DEFINITION_LIST_ELEMENT_TYPE,
  DEFINITION_TERM_ELEMENT_TYPE,
} from "../definitionListTypes";

export const isDefinitionTerm = (node: Node | undefined) => isElementOfType(node, DEFINITION_TERM_ELEMENT_TYPE);

export const isDefinitionDescription = (node: Node | undefined) =>
  isElementOfType(node, DEFINITION_DESCRIPTION_ELEMENT_TYPE);

export const isDefinitionList = (node: Node | undefined) => isElementOfType(node, DEFINITION_LIST_ELEMENT_TYPE);
