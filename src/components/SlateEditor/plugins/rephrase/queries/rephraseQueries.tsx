/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Node } from "slate";
import { isElementOfType } from "@ndla/editor";
import { REPHRASE_ELEMENT_TYPE } from "../rephraseTypes";

export const isRephraseElement = (node: Node | undefined) => isElementOfType(node, REPHRASE_ELEMENT_TYPE);
