/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin, NOOP_ELEMENT_TYPE } from "@ndla/editor";
import { SINGLE_LINE_PLUGIN } from "./types";
import { Element, Transforms } from "slate";

export const singleLinePlugin = createPlugin({
  name: SINGLE_LINE_PLUGIN,
  options: {
    rootNode: NOOP_ELEMENT_TYPE,
  },
  normalize: (editor, node, path, logger) => {
    if (Element.isElement(node) && path.length === 1 && path[0] === 0 && node.children.length > 1) {
      logger.log("Single line node has more than one child, merging with previous");
      Transforms.mergeNodes(editor, { at: path.concat([1]) });
      return true;
    } else if (path.length === 1 && path[0] !== 0) {
      logger.log("Single line editor contains more than one root node, removing.");
      Transforms.removeNodes(editor, { at: path });
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
