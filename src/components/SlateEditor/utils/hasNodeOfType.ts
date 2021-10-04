/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Range, Editor, Element, Path } from 'slate';

const hasNodeOfType = (editor: Editor, type: string, path?: Path) => {
  if (path) {
    const [match] = Editor.nodes(editor, {
      match: node => Element.isElement(node) && node.type === type,
      at: path,
    });
    return !!match;
  }

  if (!Range.isRange(editor.selection)) {
    return false;
  }
  const [match] = Editor.nodes(editor, {
    match: node => Element.isElement(node) && node.type === type,
    at: Editor.unhangRange(editor, editor.selection),
  });
  return !!match;
};

export default hasNodeOfType;
