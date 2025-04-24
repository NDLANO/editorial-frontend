/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin } from "@ndla/editor";
import { TABLE_CAPTION_ELEMENT_TYPE, TABLE_CAPTION_PLUGIN } from "./types";
import { isTableCaptionElement, isTableElement } from "./queries";
import { Text, Transforms } from "slate";
import { isKeyHotkey } from "is-hotkey";

export const tableCaptionPlugin = createPlugin({
  name: TABLE_CAPTION_PLUGIN,
  type: TABLE_CAPTION_ELEMENT_TYPE,
  shortcuts: {
    onEnter: {
      keyCondition: isKeyHotkey("enter"),
      handler: (editor, event, logger) => {
        if (!editor.selection) return false;
        const [entry] = editor.nodes({ match: isTableCaptionElement });
        if (!entry) return false;
        logger.log("Tried pressing enter in table caption");
        event.preventDefault();
        return true;
      },
    },
  },
  normalize: (editor, node, path, logger) => {
    if (!isTableCaptionElement(node)) return false;

    // TODO: Not really sure if we need to check that the parent is a table. We could also do this with the defaultNormalizer if we really wanted to.
    if (path[path.length - 1] !== 0 || !isTableElement(editor.parent(path)?.[0])) {
      logger.log("Caption is not the first child of the table. Removing.");
      Transforms.removeNodes(editor, { at: path });
      return true;
    }

    for (const [index, child] of node.children.entries()) {
      if (!Text.isText(child)) {
        Transforms.unwrapNodes(editor, { at: path.concat(index) });
        return true;
      } else if (child.bold || child.code || child.italic || child.sub || child.sup || child.underlined) {
        logger.log("Table caption child has formatting, removing.");
        Transforms.unsetNodes(editor, ["bold", "code", "italic", "sub", "sup", "underlined"], {
          at: path.concat(index),
        });
        return true;
      }
    }
    return false;
  },
});
