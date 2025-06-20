/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";

export type DefinitionListType = "definition-list";
export type DefinitionTermType = "definition-term";
export type DefinitionDescriptionType = "definition-description";

export const DEFINITION_LIST_ELEMENT_TYPE = "definition-list" as const;
export const DEFINITION_DESCRIPTION_ELEMENT_TYPE = "definition-description" as const;
export const DEFINITION_TERM_ELEMENT_TYPE = "definition-term" as const;

export const DEFINITION_LIST_PLUGIN = "definition-list" as const;
export const DEFINITION_DESCRIPTION_PLUGIN = "definition-description" as const;
export const DEFINITION_TERM_PLUGIN = "definition-term" as const;

export interface DefinitionListElement {
  type: "definition-list";
  children: Descendant[];
}

export interface DefinitionTermElement {
  type: "definition-term";
  children: Descendant[];
}

export interface DefinitionDescriptionElement {
  type: "definition-description";
  children: Descendant[];
}
