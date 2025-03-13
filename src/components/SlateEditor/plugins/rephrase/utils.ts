/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { Range, Editor, Element, Transforms, Node } from "slate";
import { REPHRASE_ELEMENT_TYPE } from ".";

export const isRephrase = (node: Node) => Element.isElement(node) && node.type === REPHRASE_ELEMENT_TYPE;

export const unwrapRephrase = (editor: Editor) => {
  Transforms.unwrapNodes(editor, {
    match: isRephrase,
  });
};

export const wrapRephrase = (editor: Editor) => {
  if (!editor.selection) {
    return;
  }

  const isCollapsed = editor.selection && Range.isCollapsed(editor.selection);

  const node = slatejsx(
    "element",
    {
      type: REPHRASE_ELEMENT_TYPE,
    },
    [],
  );

  if (!isCollapsed) {
    Transforms.wrapNodes(editor, node, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};
