/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element, Transforms } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { createDataAttributes, createHtmlTag, parseElementAttributes } from "@ndla/editor";
import { GridType } from "@ndla/ui";
import { TYPE_GRID, TYPE_GRID_CELL } from "./types";
import { defaultGridCellBlock } from "./utils";
import { SlateSerializer } from "../../interfaces";
import { defaultBlockNormalizer, NormalizerConfig } from "../../utils/defaultNormalizer";
import { afterOrBeforeTextBlockElement } from "../../utils/normalizationHelpers";
import { TYPE_HEADING } from "../heading/types";
import { IMAGE_ELEMENT_TYPE } from "../image/types";
import { KEY_FIGURE_ELEMENT_TYPE } from "../keyFigure/types";
import { TYPE_LIST } from "../list/types";
import { TYPE_PARAGRAPH } from "../paragraph/types";
import { PITCH_ELEMENT_TYPE } from "../pitch/types";

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

const normalizerConfig: NormalizerConfig = {
  previous: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
  next: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
  nodes: {
    allowed: [TYPE_GRID_CELL],
    defaultType: TYPE_GRID_CELL,
  },
};

const normalizerConfigGridCell: NormalizerConfig = {
  nodes: {
    allowed: [KEY_FIGURE_ELEMENT_TYPE, PITCH_ELEMENT_TYPE, TYPE_PARAGRAPH, IMAGE_ELEMENT_TYPE, TYPE_HEADING, TYPE_LIST],
    defaultType: TYPE_PARAGRAPH,
  },
};

export const gridSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== "div") return;
    if (el.dataset.type === TYPE_GRID) {
      const grid = el as HTMLDivElement;
      const attributes = parseElementAttributes(Array.from(grid.attributes));

      return slatejsx(
        "element",
        {
          type: TYPE_GRID,
          data: {
            columns: attributes["columns"],
            border: attributes["border"],
            background: attributes["background"],
          },
        },
        children,
      );
    }
    if (el.dataset.type === TYPE_GRID_CELL) {
      const attributes = parseElementAttributes(Array.from(el.attributes));
      return slatejsx("element", { type: TYPE_GRID_CELL, data: attributes }, children);
    }
  },
  serialize(node, children) {
    if (Element.isElement(node) && node.type === TYPE_GRID) {
      const data = createDataAttributes({
        type: TYPE_GRID,
        columns: node.data.columns,
        border: node.data.border,
        background: node.data.background,
      });
      return createHtmlTag({ tag: "div", data, children });
    } else if (Element.isElement(node) && node.type === TYPE_GRID_CELL) {
      const data = createDataAttributes({ type: TYPE_GRID_CELL, parallaxCell: node.data.parallaxCell ?? "false" });
      return createHtmlTag({ tag: "div", data, children });
    }
  },
};

export const gridPlugin = (editor: Editor) => {
  const { normalizeNode: nextNormalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (Element.isElement(node) && node.type === TYPE_GRID) {
      const columns = node.data.columns === "2x2" ? 4 : Number(node.data.columns);
      if (node.children.length < columns) {
        Transforms.insertNodes(
          editor,
          Array(columns - node.children.length)
            .fill(undefined)
            .map(() => defaultGridCellBlock()),
          { at: [...path, node.children.length] },
        );

        return;
      } else if (node.children.length > columns) {
        Editor.withoutNormalizing(editor, () => {
          Array(node.children.length - columns)
            .fill(undefined)
            .forEach((_, index) =>
              Transforms.removeNodes(editor, {
                at: [...path, node.children.length - 1 - index],
              }),
            );
        });

        return;
      }

      if (defaultBlockNormalizer(editor, node, path, normalizerConfig)) {
        return;
      }
    } else if (Element.isElement(node) && node.type === TYPE_GRID_CELL) {
      if (defaultBlockNormalizer(editor, node, path, normalizerConfigGridCell)) {
        return;
      }
    }

    nextNormalizeNode(entry);
  };

  return editor;
};
