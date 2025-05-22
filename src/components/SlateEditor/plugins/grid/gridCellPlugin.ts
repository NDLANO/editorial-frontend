/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import {
  createDataAttributes,
  createHtmlTag,
  createPlugin,
  createSerializer,
  defaultNormalizer,
  HEADING_ELEMENT_TYPE,
  LIST_ELEMENT_TYPE,
  NormalizerConfig,
  PARAGRAPH_ELEMENT_TYPE,
  parseElementAttributes,
} from "@ndla/editor";
import { GRID_CELL_ELEMENT_TYPE, GRID_CELL_PLUGIN } from "./types";
import { isGridCellElement } from "./queries";
import { KEY_FIGURE_ELEMENT_TYPE } from "../keyFigure/types";
import { PITCH_ELEMENT_TYPE } from "../pitch/types";
import { IMAGE_ELEMENT_TYPE } from "../image/types";

export const gridCellSerializer = createSerializer({
  deserialize: (el, children) => {
    if (el.tagName.toLowerCase() !== "div" || el.dataset.type !== GRID_CELL_ELEMENT_TYPE) return;
    const attributes = parseElementAttributes(Array.from(el.attributes));
    return slatejsx("element", { type: GRID_CELL_ELEMENT_TYPE, data: attributes }, children);
  },
  serialize: (node, children) => {
    if (!isGridCellElement(node)) return;
    const data = createDataAttributes({
      type: GRID_CELL_ELEMENT_TYPE,
      parallaxCell: node.data.parallaxCell ?? "false",
    });
    return createHtmlTag({ tag: "div", data, children });
  },
});

const normalizerConfig: NormalizerConfig = {
  nodes: {
    allowed: [
      KEY_FIGURE_ELEMENT_TYPE,
      PITCH_ELEMENT_TYPE,
      PARAGRAPH_ELEMENT_TYPE,
      IMAGE_ELEMENT_TYPE,
      HEADING_ELEMENT_TYPE,
      LIST_ELEMENT_TYPE,
    ],
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
};

export const gridCellPlugin = createPlugin({
  name: GRID_CELL_PLUGIN,
  type: GRID_CELL_ELEMENT_TYPE,
  normalize: (editor, node, path, logger) => {
    if (!isGridCellElement(node)) return false;
    return defaultNormalizer(editor, node, path, normalizerConfig, logger);
  },
});
