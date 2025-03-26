/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Node } from "slate";
import { isElementOfType } from "@ndla/editor";
import { KEY_FIGURE_ELEMENT_TYPE } from "./types";

export const isKeyFigureElement = (node: Node | undefined) => isElementOfType(node, KEY_FIGURE_ELEMENT_TYPE);
