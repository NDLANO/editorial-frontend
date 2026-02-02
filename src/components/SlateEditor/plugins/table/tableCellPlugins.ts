/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin, isElementOfType, PluginConfiguration } from "@ndla/editor";
import { Node, Range } from "slate";
import { HistoryEditor } from "slate-history";
import { isTableCellHeaderElement } from "./queries";
import { updateCell } from "./slateActions";
import {
  TABLE_CELL_ELEMENT_TYPE,
  TABLE_CELL_HEADER_ELEMENT_TYPE,
  TABLE_CELL_HEADER_PLUGIN,
  TABLE_CELL_PLUGIN,
} from "./types";

const normalizeNode =
  <T extends typeof TABLE_CELL_ELEMENT_TYPE | typeof TABLE_CELL_HEADER_ELEMENT_TYPE>(
    type: T,
  ): NonNullable<PluginConfiguration<T>["normalize"]> =>
  (editor, node, _path, logger) => {
    if (!isElementOfType(node, type)) return false;

    if (node.data.align) return false;

    const nodeString = Node.string(node);

    // Numbers should be aligned to the right by default.
    if (typeof nodeString === "string" && nodeString.trim() !== "" && !Number.isNaN(+nodeString)) {
      logger.log("Table cell has no alignment, but only contains a number. Aligning to the right.");
      HistoryEditor.withoutSaving(editor, () => updateCell(editor, node, { align: "right" }));
      return true;
    }
    return false;
  };

export const tableCellPlugin = createPlugin({
  name: TABLE_CELL_PLUGIN,
  type: TABLE_CELL_ELEMENT_TYPE,
  normalize: normalizeNode(TABLE_CELL_ELEMENT_TYPE),
});

export const tableCellHeaderPlugin = createPlugin({
  name: TABLE_CELL_HEADER_PLUGIN,
  type: TABLE_CELL_HEADER_ELEMENT_TYPE,
  normalize: normalizeNode(TABLE_CELL_HEADER_ELEMENT_TYPE),
  transform: (editor) => {
    const { shouldHideBlockPicker } = editor;
    editor.shouldHideBlockPicker = () => {
      if (editor.selection && Range.isCollapsed(editor.selection)) {
        const [cell] = editor.nodes({ match: isTableCellHeaderElement });
        return !!cell;
      }
      return shouldHideBlockPicker?.();
    };

    return editor;
  },
});
