/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin, isElementOfType, PARAGRAPH_ELEMENT_TYPE, SPAN_ELEMENT_TYPE } from "@ndla/editor";
import { UNSUPPORTED_ELEMENT_TYPE, UNSUPPORTED_PLUGIN } from "./types";
import { Editor, Node, Transforms } from "slate";
import { blockContentToHTML } from "../../../../util/articleContentConverter";

export const unsupportedPlugin = createPlugin({
  name: UNSUPPORTED_PLUGIN,
  type: UNSUPPORTED_ELEMENT_TYPE,
  normalize: (editor, node, path, logger) => {
    if (!Node.isElement(node) || node.type === UNSUPPORTED_ELEMENT_TYPE) return false;
    if (editor.supportsElement(node)) return false;
    logger.log(`Encountered an element that no plugin supports, converting to unsupported element, ${node.type}`);
    const serializedOriginalElement = blockContentToHTML([node]);
    Transforms.setNodes(
      editor,
      {
        type: UNSUPPORTED_ELEMENT_TYPE,
        children: node.children,
        data: { originalElement: node, serializedOriginalElement },
      },
      { at: path, match: (n) => Node.isElement(n) && n.type === node.type },
    );
    return true;
  },
  transform: (editor) => {
    const { isVoid, isInline } = editor;
    editor.isVoid = (node) => {
      if (node.type === UNSUPPORTED_ELEMENT_TYPE && Node.string(node) === "") {
        return true;
      }
      return isVoid?.(node);
    };

    editor.isInline = (node) => {
      if (node.type === UNSUPPORTED_ELEMENT_TYPE) {
        // This is kind of dumb. `ReactEditor.findPath` crashes and I don't really know why.
        // We should try to find a better way of doing this, as this is kind of slow. Seeing as unsupported elements are (hopefully) temporary, this shouldn't be too big of an issue.
        const [entry] = Editor.nodes(editor, { at: [], match: (n) => Node.isElement(n) && n.id === node.id });
        if (entry) {
          const parent = Node.parent(editor, entry[1]);
          if (isElementOfType(parent, [PARAGRAPH_ELEMENT_TYPE, SPAN_ELEMENT_TYPE])) {
            return true;
          }
        }
      }

      return isInline?.(node);
    };

    return editor;
  },
});
