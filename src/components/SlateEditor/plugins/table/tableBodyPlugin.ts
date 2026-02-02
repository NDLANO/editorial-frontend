/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin, isElementOfType } from "@ndla/editor";
import { Transforms } from "slate";
import { defaultTableRowBlock } from "./defaultBlocks";
import { isTableRowElement } from "./queries";
import { TABLE_BODY_ELEMENT_TYPE, TABLE_BODY_PLUGIN } from "./types";

export const tableBodyPlugin = createPlugin({
  name: TABLE_BODY_PLUGIN,
  type: TABLE_BODY_ELEMENT_TYPE,
  normalize: (editor, node, path, logger) => {
    if (!isElementOfType(node, TABLE_BODY_ELEMENT_TYPE)) return false;
    for (const [index, child] of node.children.entries()) {
      if (!isTableRowElement(child)) {
        logger.log(`table body child is not a table row. Wrapping in row.`);
        Transforms.wrapNodes(editor, defaultTableRowBlock(0), { at: path.concat(index) });
        return true;
      }
    }
    return false;
  },
});
