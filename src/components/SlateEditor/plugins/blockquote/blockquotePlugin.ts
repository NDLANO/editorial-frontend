/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  createPlugin,
  defaultNormalizer,
  getCurrentBlock,
  NormalizerConfig,
  PARAGRAPH_ELEMENT_TYPE,
} from "@ndla/editor";
import { Element, Location, Node, Transforms } from "slate";
import { BLOCK_QUOTE_ELEMENT_TYPE, BLOCK_QUOTE_PLUGIN } from "./blockquoteTypes";
import { isBlockQuoteElement } from "./queries/blockquoteQueries";

const normalizerConfig: NormalizerConfig = {
  nodes: {
    allowed: [PARAGRAPH_ELEMENT_TYPE],
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
};

export const blockQuotePlugin = createPlugin({
  name: BLOCK_QUOTE_PLUGIN,
  type: BLOCK_QUOTE_ELEMENT_TYPE,
  transform: (editor, logger) => {
    const { insertBreak } = editor;

    editor.insertBreak = () => {
      if (!editor.selection || !Location.isRange(editor.selection)) return insertBreak();
      const entry = getCurrentBlock<Element["type"]>(editor, BLOCK_QUOTE_ELEMENT_TYPE);
      if (!entry) {
        return insertBreak();
      }

      const [currentNode, currentPath] = editor.node(editor.selection.anchor.path);
      if (Node.string(currentNode) === "") {
        logger.log("Pressed enter in empty element, lifting element out of quote");
        return Transforms.liftNodes(editor, { at: currentPath.slice(0, -1) });
      }
      return insertBreak();
    };
    return editor;
  },
  // TODO: Reconsider this normalization once all plugins are refactored to use the new plugin system
  // If you presse enter inside an empty blockquote without this you'll be able to insert a new section
  normalize: (editor, node, path, logger) => {
    if (isBlockQuoteElement(node)) {
      return defaultNormalizer(editor, node, path, normalizerConfig, logger);
    }
    return false;
  },
});
