/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin } from "@ndla/editor";
import { SINGLE_LINE_PLUGIN } from "./types";
import { Node, Transforms } from "slate";
import { defaultParagraphBlock } from "../paragraph/utils";

export const singleLinePlugin = createPlugin({
  name: SINGLE_LINE_PLUGIN,
  normalize: (editor, node, path, logger) => {
    if (path.length === 1 && path[0] !== 0) {
      logger.log("Single line editor contains more than one root node, removing.");
      Transforms.removeNodes(editor, { at: path });
      return true;
    }

    if (!Node.isElement(node) || path.length !== 1 || path[0] !== 0 || node.children.length <= 1) return false;

    const blockNodes = node.children.filter((child) => Node.isElement(child) && editor.isBlock(child));
    if (blockNodes.length === node.children.length) {
      logger.log("Single line node has more than one child, merging with previous");
      Transforms.mergeNodes(editor, { at: path.concat([1]) });
      return true;
    } else if (blockNodes.length) {
      const newNode = { ...node, children: [{ ...defaultParagraphBlock(), children: node.children }] };
      editor.withoutNormalizing(() => {
        Transforms.removeNodes(editor, { at: path });
        Transforms.insertNodes(editor, newNode, { at: path });
      });
      return true;
    }

    return false;
  },
  transform: (editor) => {
    editor.insertBreak = () => {
      return null;
    };
    return editor;
  },
});
