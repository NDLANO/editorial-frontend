/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { GridType } from "@ndla/ui";

export const GRID_ELEMENT_TYPE = "grid";
export const GRID_PLUGIN = "grid";

export const GRID_CELL_ELEMENT_TYPE = "grid-cell";
export const GRID_CELL_PLUGIN = "grid-cell";

export interface GridElement {
  type: "grid";
  data: GridType;
  children: Descendant[];
}

export interface GridCellElement {
  type: "grid-cell";
  data: {
    parallaxCell: string;
  };
  children: Descendant[];
}
