/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isElementOfType } from "@ndla/editor";
import { Node } from "slate";
import { EXTERNAL_ELEMENT_TYPE, IFRAME_ELEMENT_TYPE } from "./types";

export const isIframeElement = (node: Node | undefined) => isElementOfType(node, IFRAME_ELEMENT_TYPE);

export const isExternalElement = (node: Node | undefined) => isElementOfType(node, EXTERNAL_ELEMENT_TYPE);
