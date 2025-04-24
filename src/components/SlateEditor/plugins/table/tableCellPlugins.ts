/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin, isElementOfType, PluginConfiguration } from "@ndla/editor";
import {
  TABLE_CELL_ELEMENT_TYPE,
  TABLE_CELL_HEADER_ELEMENT_TYPE,
  TABLE_CELL_HEADER_PLUGIN,
  TABLE_CELL_PLUGIN,
} from "./types";
import { Element, Node, Transforms } from "slate";
import { defaultParagraphBlock } from "../paragraph/utils";
import { HistoryEditor } from "slate-history";
import { updateCell } from "./slateActions";

const normalizeNode =
  <T extends typeof TABLE_CELL_ELEMENT_TYPE | typeof TABLE_CELL_HEADER_ELEMENT_TYPE>(
    type: T,
  ): NonNullable<PluginConfiguration<T>["normalize"]> =>
  (editor, node, path, logger) => {
    if (!isElementOfType(node, type)) return false;
    if (!Element.isElementList(node.children)) {
      logger.log("Table cell children is not a list of elements. Inserting paragraph.");
      Transforms.wrapNodes(
        editor,
        { ...defaultParagraphBlock(), serializeAsText: true },
        { at: path, match: (n) => n !== node },
      );
      return true;
    }

    if (node.data.align) return false;

    const nodeString = Node.string(node);

    // Numbers should be aligned to the right by default.
    if (typeof nodeString === "string" && nodeString.trim() !== "" && !Number.isNaN(+nodeString)) {
      logger.log("Table cell has no alignment, but only contains a number. Aligning to the right.");
      // TODO: I don't know if I like updateCell yet.
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
});
