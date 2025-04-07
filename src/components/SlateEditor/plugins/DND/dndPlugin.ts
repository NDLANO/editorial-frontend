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
import { DND_PLUGIN, DndPluginOptions } from "./dndTypes";
import { Element, Node } from "slate";
import { BLOCK_QUOTE_ELEMENT_TYPE } from "../blockquote/blockquoteTypes";
import { TYPE_TABLE_CAPTION } from "../table/types";

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
      "br",
    ],
    legalChildren: {
      "list-item": [],
      "grid-cell": ["paragraph", "image", "list", "definition-list", "quote"],
      summary: [],
      aside: [
        "paragraph",
        "table",
        "image",
        "brightcove-embed",
        "audio",
        "h5p",
        "iframe",
        "external",
        "file",
        "code-block",
        "comment-block",
        "grid",
        "list",
        "definition-list",
        "key-figure",
        "pitch",
        "error-embed",
        "campaign-block",
        "gloss-block",
        "quote",
        "link-block-list",
      ],
      details: [
        "table",
        "image",
        "paragraph",
        "brightcove-embed",
        "audio",
        "h5p",
        "iframe",
        "external",
        "file",
        "code-block",
        "comment-block",
        "grid",
        "list",
        "definition-list",
        "key-figure",
        "pitch",
        "error-embed",
        "campaign-block",
        "gloss-block",
        "quote",
        "link-block-list",
      ],
      grid: ["paragraph", "image", "quote", "list", "definition-list"],
      quote: ["paragraph"],
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

        if (Element.isElement(section) && section.type === SECTION_ELEMENT_TYPE) {
          const lowestCommonAncestor = [...Node.nodes(section)].find(([element]) => {
            return (
              Element.isElement(element) &&
              (element.children.length > 1 ||
                [HEADING_ELEMENT_TYPE, PARAGRAPH_ELEMENT_TYPE, BLOCK_QUOTE_ELEMENT_TYPE, TYPE_TABLE_CAPTION].includes(
                  element.type,
                ))
            );
          })?.[0];
          if (Element.isElement(lowestCommonAncestor)) {
            if (lowestCommonAncestor.type === HEADING_ELEMENT_TYPE) {
              return [lowestCommonAncestor];
            }
            if (lowestCommonAncestor.type === LIST_ELEMENT_TYPE) {
              return [lowestCommonAncestor];
            }
            if (lowestCommonAncestor.type === TYPE_TABLE_CAPTION) {
              return lowestCommonAncestor.children;
            }
            if (lowestCommonAncestor.type === LIST_ITEM_ELEMENT_TYPE) {
              const lowestCommonList = [...Node.nodes(section)].find(([element]) => {
                return Element.isElement(element) && element.children.includes(lowestCommonAncestor);
              })?.[0];
              if (Element.isElement(lowestCommonList)) {
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
