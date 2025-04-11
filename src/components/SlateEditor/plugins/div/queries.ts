/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { isElementOfType } from "@ndla/editor";
import { DIV_ELEMENT_TYPE } from "./types";

export const isDivElement = (node: Descendant | undefined) => isElementOfType(node, DIV_ELEMENT_TYPE);
