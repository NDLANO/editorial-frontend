/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isElementOfType } from "@ndla/editor";
import { Node } from "slate";
import { COPYRIGHT_ELEMENT_TYPE } from "./types";

export const isCopyrightElement = (node: Node | undefined) => isElementOfType(node, COPYRIGHT_ELEMENT_TYPE);
