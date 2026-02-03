/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin } from "@ndla/editor";
import { Editor, Transforms } from "slate";
import { HistoryEditor } from "slate-history";
import { defaultTableRowBlock } from "./defaultBlocks";
import { isTableCellElement, isTableHeadElement, isTableRowElement } from "./queries";
import { updateCell } from "./slateActions";
import { TABLE_CELL_HEADER_ELEMENT_TYPE, TABLE_HEAD_ELEMENT_TYPE, TABLE_HEAD_PLUGIN } from "./types";

export const tableHeadPlugin = createPlugin({
  name: TABLE_HEAD_PLUGIN,
  type: TABLE_HEAD_ELEMENT_TYPE,
  normalize: (editor, node, path, logger) => {
    if (!isTableHeadElement(node)) return false;

    for (const [index, child] of node.children.entries()) {
      if (!isTableRowElement(child)) {
        logger.log(`table head child is not a table row. Wrapping in row.`);
        Transforms.wrapNodes(editor, defaultTableRowBlock(0), { at: path.concat(index) });
        return true;
      }
    }
    const cells = Array.from(editor.nodes({ match: isTableCellElement, at: path, mode: "all" }));
    if (cells.length) {
      logger.log("Table head has regular table cells. Converting to table header cells.");
      HistoryEditor.withoutSaving(editor, () => {
        Editor.withoutNormalizing(editor, () => {
          for (const [cell] of cells) {
            updateCell(editor, cell, { scope: "col" }, TABLE_CELL_HEADER_ELEMENT_TYPE);
          }
        });
      });
      return true;
    }
    return false;
  },
});
