/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Element, Editor, Node, Transforms, Location } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import hasNodeOfType from "./hasNodeOfType";

const toggleBlock = (editor: Editor, type: Element["type"]) => {
  if (!editor.selection || !Location.isRange(editor.selection)) {
    return false;
  }
  const isActive = hasNodeOfType(editor, type);

  if (isActive) {
    Transforms.unwrapNodes(editor, {
      mode: "lowest",
      match: (node) => Node.isElement(node) && node.type === type,
      split: true,
      at: Editor.unhangRange(editor, editor.selection),
    });
  } else {
    Transforms.wrapNodes(editor, slatejsx("element", { type }, []), {
      at: Editor.unhangRange(editor, editor.selection),
    });
  }
};

export default toggleBlock;
