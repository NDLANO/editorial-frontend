/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import {
  DEFINITION_DESCRIPTION_ELEMENT_TYPE,
  DEFINITION_LIST_ELEMENT_TYPE,
  DEFINITION_TERM_ELEMENT_TYPE,
} from "./definitionListTypes";

export const defaultDefinitionTermBlock = () =>
  slatejsx("element", { type: DEFINITION_TERM_ELEMENT_TYPE }, [{ text: "" }]);

export const defaultDefinitionDescriptionBlock = () =>
  slatejsx("element", { type: DEFINITION_DESCRIPTION_ELEMENT_TYPE }, [{ text: "" }]);

export const defaultDefinitionListBlock = () =>
  slatejsx("element", { type: DEFINITION_LIST_ELEMENT_TYPE }, [defaultDefinitionTermBlock()]);
