/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Node } from "slate";
import { isElementOfType } from "@ndla/editor";
import { LINK_BLOCK_LIST_ELEMENT_TYPE } from "./types";

export const isLinkBlockListElement = (node: Node | undefined) => isElementOfType(node, LINK_BLOCK_LIST_ELEMENT_TYPE);
