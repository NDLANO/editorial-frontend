/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Node, Path, Location } from "slate";

const hasNodeOfType = (editor: Editor, type: string, path?: Path) => {
  if (path) {
    const [match] = Editor.nodes(editor, {
      match: (node) => Node.isElement(node) && node.type === type,
      at: path,
    });
    return !!match;
  }

  if (!editor.selection || !Location.isRange(editor.selection)) {
    return false;
  }
  const [match] = Editor.nodes(editor, {
    match: (node) => Node.isElement(node) && node.type === type,
    at: Editor.unhangRange(editor, editor.selection),
  });
  return !!match;
};

export default hasNodeOfType;
