/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin, isElementOfType } from "@ndla/editor";
import { Transforms } from "slate";
import { defaultTableCellBlock } from "./defaultBlocks";
import { isTableRowElement } from "./queries";
import {
  TABLE_CELL_ELEMENT_TYPE,
  TABLE_CELL_HEADER_ELEMENT_TYPE,
  TABLE_ROW_ELEMENT_TYPE,
  TABLE_ROW_PLUGIN,
} from "./types";

export const tableRowPlugin = createPlugin({
  name: TABLE_ROW_PLUGIN,
  type: TABLE_ROW_ELEMENT_TYPE,
  normalize: (editor, node, path, logger) => {
    if (!isTableRowElement(node)) return false;
    for (const [index, child] of node.children.entries()) {
      if (!isElementOfType(child, [TABLE_CELL_ELEMENT_TYPE, TABLE_CELL_HEADER_ELEMENT_TYPE])) {
        logger.log("Table row child is not a table cell. Wrapping in table cell.");
        Transforms.wrapNodes(editor, defaultTableCellBlock(), { at: path.concat(index) });
        return true;
      }
    }

    return false;
  },
});
