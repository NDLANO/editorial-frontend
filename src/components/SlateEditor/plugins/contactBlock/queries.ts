/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isElementOfType } from "@ndla/editor";
import { Node } from "slate";
import { CONTACT_BLOCK_ELEMENT_TYPE } from "./types";

export const isContactBlockElement = (node: Node | undefined) => isElementOfType(node, CONTACT_BLOCK_ELEMENT_TYPE);
