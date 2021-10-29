/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Transforms, Element, Range } from 'slate';
import { jsx } from 'slate-hyperscript';
import { HeadingElement } from '.';
import hasNodeOfType from '../../utils/hasNodeOfType';
import hasNodeWithProps from '../../utils/hasNodeWithProps';

export const toggleHeading = (editor: Editor, level: HeadingElement['level']) => {
  const newHeadingProps: Partial<HeadingElement> = { type: 'heading', level };

  const isIdentical = hasNodeWithProps(editor, newHeadingProps);
  const isHeading = hasNodeOfType(editor, 'heading');

  if (!Range.isRange(editor.selection)) {
    return;
  }

  if (isIdentical) {
    Editor.withoutNormalizing(editor, () => {
      if (!Range.isRange(editor.selection)) {
        return;
      }
      Transforms.unsetNodes(editor, ['level'], {
        match: node => Element.isElement(node) && node.type === 'heading',
        at: Editor.unhangRange(editor, editor.selection),
      });
      Transforms.setNodes(
        editor,
        { type: 'paragraph' },
        {
          match: node => Element.isElement(node) && node.type === 'heading',
          at: Editor.unhangRange(editor, editor.selection),
        },
      );
    });
  } else if (isHeading) {
    Transforms.setNodes(editor, newHeadingProps, {
      match: node => Element.isElement(node) && node.type === 'heading',
      hanging: false,
    });
  } else {
    Transforms.setNodes(editor, jsx('element', newHeadingProps, []), {
      match: node => Element.isElement(node) && node.type === 'paragraph',
      at: Editor.unhangRange(editor, editor.selection),
    });
  }
};
