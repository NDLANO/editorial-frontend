/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isElementOfType } from "@ndla/editor";
import { Node } from "slate";
import { GRID_CELL_ELEMENT_TYPE, GRID_ELEMENT_TYPE } from "./types";

export const isGridElement = (node: Node | undefined) => isElementOfType(node, GRID_ELEMENT_TYPE);

export const isGridCellElement = (node: Node | undefined) => isElementOfType(node, GRID_CELL_ELEMENT_TYPE);
