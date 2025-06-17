/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin } from "@ndla/editor";
import { PASTE_PLUGIN } from "./types";
import { Descendant, Element, Node, Transforms } from "slate";

export const b64Decode = (data: string | undefined): Descendant[] => {
  try {
    return JSON.parse(decodeURIComponent(atob(data ?? "")));
  } catch (e) {
    return [];
  }
};

export const pastePlugin = createPlugin({
  name: PASTE_PLUGIN,
  transform: (editor, logger) => {
    const { insertData } = editor;

    editor.insertData = (data) => {
      const slate = b64Decode(data.getData("application/x-slate-fragment"));
      if (!slate) return insertData(data);
      const allElements = slate.filter((n) => Element.isElement(n)).flatMap((n) => Array.from(Node.elements(n)));
      for (const [node] of allElements) {
        if (!editor.supportsElement(node)) {
          logger.log("Unsupported element found during paste");
          const plainText = data.getData("text/plain");
          return Transforms.insertText(editor, plainText);
        }
      }
      return insertData(data);
    };

    return editor;
  },
});
