/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { defaultParagraphBlock } from "../paragraph/utils";
import { GRID_CELL_ELEMENT_TYPE, GRID_ELEMENT_TYPE } from "./types";

export const defaultGridCellBlock = () => {
  return slatejsx(
    "element",
    {
      type: GRID_CELL_ELEMENT_TYPE,
      data: {},
    },
    defaultParagraphBlock(),
  );
};

export const defaultGridBlock = () => {
  return slatejsx(
    "element",
    {
      type: GRID_ELEMENT_TYPE,
      data: { columns: 2, border: "none" },
    },
    [[defaultGridCellBlock(), defaultGridCellBlock()]],
  );
};
