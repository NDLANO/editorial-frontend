/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isElementOfType } from "@ndla/editor";
import { Node } from "slate";
import {
  DEFINITION_DESCRIPTION_ELEMENT_TYPE,
  DEFINITION_LIST_ELEMENT_TYPE,
  DEFINITION_TERM_ELEMENT_TYPE,
} from "../definitionListTypes";

export const isDefinitionTermElement = (node: Node | undefined) => isElementOfType(node, DEFINITION_TERM_ELEMENT_TYPE);

export const isDefinitionDescriptionElement = (node: Node | undefined) =>
  isElementOfType(node, DEFINITION_DESCRIPTION_ELEMENT_TYPE);

export const isDefinitionListElement = (node: Node | undefined) => isElementOfType(node, DEFINITION_LIST_ELEMENT_TYPE);
