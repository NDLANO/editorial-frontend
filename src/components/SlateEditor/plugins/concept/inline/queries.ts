/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isElementOfType } from "@ndla/editor";
import { CONCEPT_INLINE_ELEMENT_TYPE } from "./types";
import { Node } from "slate";

export const isConceptInlineElement = (node: Node | undefined) => isElementOfType(node, CONCEPT_INLINE_ELEMENT_TYPE);
