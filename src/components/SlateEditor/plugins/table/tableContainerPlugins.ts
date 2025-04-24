/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin, isElementOfType, PluginConfiguration } from "@ndla/editor";
import { TABLE_BODY_ELEMENT_TYPE, TABLE_BODY_PLUGIN, TABLE_HEAD_ELEMENT_TYPE, TABLE_HEAD_PLUGIN } from "./types";
import { isTableRowElement } from "./queries";
import { Transforms } from "slate";
import { defaultTableRowBlock } from "./defaultBlocks";

const normalizeNode =
  <T extends typeof TABLE_BODY_ELEMENT_TYPE | typeof TABLE_HEAD_ELEMENT_TYPE>(
    type: T,
  ): PluginConfiguration<T>["normalize"] =>
  (editor, node, path, logger) => {
    if (!isElementOfType(node, type)) return false;
    for (const [index, child] of node.children.entries()) {
      if (!isTableRowElement(child)) {
        logger.log(`${type} child is not a table row. Wrapping in row.`);
        Transforms.wrapNodes(editor, defaultTableRowBlock(0), { at: path.concat(index) });
        return true;
      }
    }
    return false;
  };

export const tableBodyPlugin = createPlugin({
  name: TABLE_BODY_PLUGIN,
  type: TABLE_BODY_ELEMENT_TYPE,
  normalize: normalizeNode(TABLE_BODY_ELEMENT_TYPE),
});

// TODO: Remove or merge with other tableHeadPlugin
export const tableHeadPlugin = createPlugin({
  name: TABLE_HEAD_PLUGIN,
  type: TABLE_HEAD_ELEMENT_TYPE,
  normalize: normalizeNode(TABLE_HEAD_ELEMENT_TYPE),
});
