/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  createPlugin,
  HEADING_ELEMENT_TYPE,
  LIST_ELEMENT_TYPE,
  LIST_ITEM_ELEMENT_TYPE,
  PARAGRAPH_ELEMENT_TYPE,
  SECTION_ELEMENT_TYPE,
} from "@ndla/editor";
import { Node } from "slate";
import { textBlockElements } from "../../utils/normalizationHelpers";
import { BLOCK_QUOTE_ELEMENT_TYPE } from "../blockquote/blockquoteTypes";
import { COPYRIGHT_ELEMENT_TYPE } from "../copyright/types";
import { IMAGE_ELEMENT_TYPE } from "../image/types";
import { KEY_FIGURE_ELEMENT_TYPE } from "../keyFigure/types";
import { PITCH_ELEMENT_TYPE } from "../pitch/types";
import { TABLE_CAPTION_ELEMENT_TYPE } from "../table/types";
import { DND_PLUGIN, DndPluginOptions } from "./dndTypes";

export const dndPlugin = createPlugin<any, DndPluginOptions>({
  name: DND_PLUGIN,
  options: {
    disabledElements: [
      "section",
      "summary",
      "list-item",
      "definition-description",
      "definition-term",
      "table-cell-header",
      "table-head",
      "table-body",
      "table-cell",
      "table-caption",
      "table-row",
      "grid-cell",
      "copyright",
      "br",
    ],
    legalChildren: {
      "list-item": [],
      "table-cell": [],
      "table-row": [],
      "grid-cell": [
        KEY_FIGURE_ELEMENT_TYPE,
        PITCH_ELEMENT_TYPE,
        PARAGRAPH_ELEMENT_TYPE,
        IMAGE_ELEMENT_TYPE,
        HEADING_ELEMENT_TYPE,
        LIST_ELEMENT_TYPE,
      ],
      "table-head": [],
      "table-cell-header": [],
      summary: [],
      "framed-content": textBlockElements.concat(COPYRIGHT_ELEMENT_TYPE),
      aside: textBlockElements,
      copyright: textBlockElements,
      details: textBlockElements,
      quote: [PARAGRAPH_ELEMENT_TYPE],
    },
  },
  transform: (editor) => {
    const { getFragment } = editor;
    // TODO: Revise this at some point, it's copy pasted from the old dnd implementation
    // If we remove this, copy pasting within nested containers will break
    editor.getFragment = () => {
      const selection = editor.selection;
      if (selection) {
        const fragment = Node.fragment(editor, selection);
        const section = fragment[0];

        if (Node.isElement(section) && section.type === SECTION_ELEMENT_TYPE) {
          const lowestCommonAncestor = [...Node.nodes(section)].find(([element]) => {
            return (
              Node.isElement(element) &&
              (element.children.length > 1 ||
                [
                  HEADING_ELEMENT_TYPE,
                  PARAGRAPH_ELEMENT_TYPE,
                  BLOCK_QUOTE_ELEMENT_TYPE,
                  TABLE_CAPTION_ELEMENT_TYPE,
                ].includes(element.type))
            );
          })?.[0];
          if (lowestCommonAncestor && Node.isElement(lowestCommonAncestor)) {
            if (lowestCommonAncestor.type === HEADING_ELEMENT_TYPE) {
              return [lowestCommonAncestor];
            }
            if (lowestCommonAncestor.type === LIST_ELEMENT_TYPE) {
              return [lowestCommonAncestor];
            }
            if (lowestCommonAncestor.type === TABLE_CAPTION_ELEMENT_TYPE) {
              return lowestCommonAncestor.children;
            }
            if (lowestCommonAncestor.type === LIST_ITEM_ELEMENT_TYPE) {
              const lowestCommonList = [...Node.nodes(section)].find(([element]) => {
                return Node.isElement(element) && element.children.includes(lowestCommonAncestor);
              })?.[0];
              if (lowestCommonList && Node.isElement(lowestCommonList)) {
                return [lowestCommonList];
              }
            }
            return lowestCommonAncestor.children;
          }
        }
      }

      return getFragment();
    };
    return editor;
  },
});
