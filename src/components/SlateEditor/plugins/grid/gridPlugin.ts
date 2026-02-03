/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  createDataAttributes,
  createHtmlTag,
  createPlugin,
  createSerializer,
  defaultNormalizer,
  NormalizerConfig,
  PARAGRAPH_ELEMENT_TYPE,
  parseElementAttributes,
} from "@ndla/editor";
import { Editor, Transforms } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { afterOrBeforeTextBlockElement } from "../../utils/normalizationHelpers";
import { isGridElement } from "./queries";
import { GRID_CELL_ELEMENT_TYPE, GRID_ELEMENT_TYPE, GRID_PLUGIN } from "./types";
import { defaultGridCellBlock } from "./utils";

export const gridSerializer = createSerializer({
  deserialize: (el, children) => {
    if (el.tagName.toLowerCase() !== "div" || el.dataset.type !== GRID_ELEMENT_TYPE) return;
    const grid = el as HTMLDivElement;
    const attributes = parseElementAttributes(Array.from(grid.attributes));
    return slatejsx(
      "element",
      {
        type: GRID_ELEMENT_TYPE,
        data: {
          columns: attributes["columns"],
          border: attributes["border"],
        },
      },
      children,
    );
  },
  serialize: (node, children) => {
    if (!isGridElement(node)) return;
    const data = createDataAttributes({
      type: GRID_ELEMENT_TYPE,
      columns: node.data.columns,
      border: node.data.border,
    });
    return createHtmlTag({ tag: "div", data, children });
  },
});

const normalizerConfig: NormalizerConfig = {
  previous: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
  next: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
  nodes: {
    allowed: [GRID_CELL_ELEMENT_TYPE],
    defaultType: GRID_CELL_ELEMENT_TYPE,
  },
};

export const gridPlugin = createPlugin({
  name: GRID_PLUGIN,
  type: GRID_ELEMENT_TYPE,
  normalize: (editor, node, path, logger) => {
    if (!isGridElement(node)) return false;
    const columns = node.data.columns === "2x2" ? 4 : Number(node.data.columns);

    if (node.children.length < columns) {
      const missingColumns = columns - node.children.length;
      logger.log("Too few columns in grid, adding {missingColumns} columns");
      const newColumns = Array(missingColumns)
        .fill(undefined)
        .map(() => defaultGridCellBlock());
      Transforms.insertNodes(editor, newColumns, { at: path.concat(node.children.length) });
      return true;
    } else if (node.children.length > columns) {
      Editor.withoutNormalizing(editor, () => {
        const extraColumns = node.children.length - columns;
        logger.log("Too many columns in grid, removing {extraColumns} columns");
        const removeColumns = Array(extraColumns).fill(undefined);
        removeColumns.forEach((_, index) => {
          Transforms.removeNodes(editor, { at: path.concat(node.children.length - 1 - index) });
        });
      });
      return true;
    }

    return defaultNormalizer(editor, node, path, normalizerConfig, logger);
  },
});
