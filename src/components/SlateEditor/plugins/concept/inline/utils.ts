/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Transforms, Element, Range } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import hasNodeOfType from '../../../utils/hasNodeOfType';
import { TYPE_CONCEPT_INLINE } from './types';

export const insertInlineConcept = (editor: Editor) => {
  if (hasNodeOfType(editor, TYPE_CONCEPT_INLINE)) {
    Transforms.unwrapNodes(editor, {
      match: node => Element.isElement(node) && node.type === TYPE_CONCEPT_INLINE,
      voids: true,
    });
    return;
  }
  if (Range.isRange(editor.selection) && !Range.isCollapsed(editor.selection)) {
    Transforms.wrapNodes(editor, slatejsx('element', { type: TYPE_CONCEPT_INLINE, data: {} }), {
      at: Editor.unhangRange(editor, editor.selection),
      split: true,
    });
  }
};
