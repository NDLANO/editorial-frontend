/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Editor, Transforms, Element, Range, Path } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_COMMENT_INLINE } from "./types";
import hasNodeOfType from "../../../utils/hasNodeOfType";

export const insertComment = (editor: Editor) => {
  if (hasNodeOfType(editor, TYPE_COMMENT_INLINE)) {
    Transforms.unwrapNodes(editor, {
      match: (node) => Element.isElement(node) && node.type === TYPE_COMMENT_INLINE,
      voids: true,
    });
    return;
  }
  if (Range.isRange(editor.selection) && !Range.isCollapsed(editor.selection)) {
    const unhangedRange = Editor.unhangRange(editor, editor.selection);
    Transforms.select(editor, unhangedRange);

    const text = Editor.string(editor, unhangedRange);
    const leftSpaces = text.length - text.trimStart().length;
    const rightSpaces = text.length - text.trimEnd().length;

    if (leftSpaces) {
      Transforms.move(editor, { distance: leftSpaces, unit: "offset", edge: "start" });
    }

    if (rightSpaces) {
      Transforms.move(editor, {
        distance: rightSpaces,
        unit: "offset",
        edge: "end",
        reverse: true,
      });
    }
    Transforms.wrapNodes(editor, slatejsx("element", { type: TYPE_COMMENT_INLINE, isFirstEdit: true }), {
      at: Editor.unhangRange(editor, editor.selection),
      split: true,
    });
  }
};
