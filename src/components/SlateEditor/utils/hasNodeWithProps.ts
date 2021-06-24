/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element, Range } from 'slate';

const hasNodeWithProps = (editor: Editor, props: Partial<Element>) => {
  if (!Range.isRange(editor.selection)) {
    return false;
  }
  const [match] = Editor.nodes(editor, {
    match: node => {
      return Element.isElement(node) && Element.matches(node, props);
    },
    at: Editor.unhangRange(editor, editor.selection),
  });
  return !!match;
};

export default hasNodeWithProps;
