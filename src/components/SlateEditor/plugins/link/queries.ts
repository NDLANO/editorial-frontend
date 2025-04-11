/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Node } from "slate";
import { isElementOfType } from "@ndla/editor";
import { CONTENT_LINK_ELEMENT_TYPE, LINK_ELEMENT_TYPE } from "./types";

export const isLinkElement = (node: Node | undefined) => isElementOfType(node, LINK_ELEMENT_TYPE);

export const isContentLinkElement = (node: Node | undefined) => isElementOfType(node, CONTENT_LINK_ELEMENT_TYPE);
