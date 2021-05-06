/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Transforms, Element, Text, Range } from 'new-slate';
import { jsx } from 'new-slate-hyperscript';
import { HeadingElement } from '.';
import { hasNodeOfType, hasNodeWithProps } from '../../utils';

export const toggleHeading = (editor: Editor, level: HeadingElement['level']) => {
  const newHeadingProps: Partial<HeadingElement> = { type: 'heading', level };

  const isIdentical = hasNodeWithProps(editor, newHeadingProps);
  const isHeading = hasNodeOfType(editor, 'heading');

  if (!Range.isRange(editor.selection)) {
    return;
  }

  if (isIdentical) {
    Transforms.unwrapNodes(editor, {
      match: node => Element.isElement(node) && node.type === 'heading',
      at: Editor.unhangRange(editor, editor.selection),
    });
  } else if (isHeading) {
    Transforms.setNodes(editor, newHeadingProps, {
      match: node => Element.isElement(node) && node.type === 'heading',
      hanging: false,
    });
  } else {
    Transforms.wrapNodes(editor, jsx('element', newHeadingProps, []), {
      match: node =>
        Text.isText(node) ||
        (Element.isElement(node) && ['content-link', 'link', 'paragraph'].includes(node.type)),
      at: Editor.unhangRange(editor, editor.selection),
    });
  }
};
