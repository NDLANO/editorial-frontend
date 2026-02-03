/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isElementOfType } from "@ndla/editor";
import { Node } from "slate";
import { MATH_ELEMENT_TYPE } from "../mathTypes";

export const isMathElement = (node: Node | undefined) => isElementOfType(node, MATH_ELEMENT_TYPE);
