/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Element, Editor, Transforms, Range } from 'new-slate';
import { jsx } from 'new-slate-hyperscript';
import { hasNodeOfType } from '.';

const toggleBlock = (editor: Editor, type: Element['type']) => {
  if (!Range.isRange(editor.selection)) {
    return false;
  }
  const isActive = hasNodeOfType(editor, type);

  if (isActive) {
    Transforms.unwrapNodes(editor, {
      mode: 'lowest',
      match: node => Element.isElement(node) && node.type === type,
      split: true,
      at: Editor.unhangRange(editor, editor.selection),
    });
  } else {
    Transforms.wrapNodes(editor, jsx('element', { type }, []), {
      at: Editor.unhangRange(editor, editor.selection),
    });
  }
};

export default toggleBlock;
