/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin, MarkType } from "@ndla/editor";
import { PASTE_PLUGIN } from "./types";
import { Descendant, Element, Node, Text, Transforms } from "slate";
import { partition } from "@ndla/util";

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
      const [rootElements, rootTexts] = partition(slate, (n) => Element.isElement(n)) as [Element[], Text[]];
      const allElements = rootElements.flatMap((n) => Array.from(Node.elements(n)));
      for (const [node] of allElements) {
        if (!editor.supportsElement(node)) {
          logger.log("Unsupported element found during paste");
          const plainText = data.getData("text/plain");
          return Transforms.insertText(editor, plainText);
        }
      }
      const textElements = rootTexts.concat(rootElements.flatMap((n) => Array.from(Node.texts(n))).map(([n]) => n));
      for (const text of textElements) {
        const { text: _, ...marks } = text;
        const activeMarks = Object.entries(marks).reduce<MarkType[]>((acc, [mark, value]) => {
          if (value) {
            acc.push(mark as MarkType);
          }
          return acc;
        }, []);
        if (!editor.supportsMark(activeMarks)) {
          logger.log("Unsupported marks found during paste", activeMarks);
          const plainText = data.getData("text/plain");
          return Transforms.insertText(editor, plainText);
        }
      }
      return insertData(data);
    };

    return editor;
  },
});
