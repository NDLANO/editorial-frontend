/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DragEventHandler } from "react";
import { Editor, Element, Node, Text } from "slate";
import { ReactEditor } from "slate-react";
import {
  HEADING_ELEMENT_TYPE,
  LIST_ELEMENT_TYPE,
  LIST_ITEM_ELEMENT_TYPE,
  PARAGRAPH_ELEMENT_TYPE,
  SECTION_ELEMENT_TYPE,
} from "@ndla/editor";
import onDrop from "./onDrop";
import { getTopNode } from "./utils";
import { TABLE_CAPTION_ELEMENT_TYPE } from "../table/types";
import { BLOCK_QUOTE_ELEMENT_TYPE } from "../blockquote/blockquoteTypes";

const onDragOver = (): DragEventHandler<HTMLDivElement> => (event) => {
  event.preventDefault();
};

const onDragStart =
  (editor: Editor): DragEventHandler<HTMLDivElement> =>
  (event) => {
    event.dataTransfer.effectAllowed = "copy";

    const node = ReactEditor.toSlateNode(editor, event.target as globalThis.Node);
    const path = ReactEditor.findPath(editor, node);
    const topNode = getTopNode(editor, path);
    if (!Text.isText(node) && topNode && Element.isElement(topNode[0])) {
      event.dataTransfer.setData("application/slate-node-path", JSON.stringify(topNode[1]));
    }
  };

const dndPlugin = (editor: Editor) => {
  const { getFragment } = editor;
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
              [
                HEADING_ELEMENT_TYPE,
                PARAGRAPH_ELEMENT_TYPE,
                BLOCK_QUOTE_ELEMENT_TYPE,
                TABLE_CAPTION_ELEMENT_TYPE,
              ].includes(element.type))
          );
        })?.[0];
        if (Element.isElement(lowestCommonAncestor)) {
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
};

export { onDragOver, onDragStart, onDrop, dndPlugin };
