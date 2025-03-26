/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isElementOfType } from "@ndla/editor";
import { CODE_BLOCK_ELEMENT_TYPE } from "../types";
import { Node } from "slate";

export const isCodeBlockElement = (node: Node | undefined) => isElementOfType(node, CODE_BLOCK_ELEMENT_TYPE);
