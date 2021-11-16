/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';

export const TYPE_PARAGRAPH = 'paragraph';

export const defaultParagraphBlock = () =>
  slatejsx('element', { type: TYPE_PARAGRAPH }, { text: '' });

export const getCurrentParagraph = (editor: Editor) => {
  if (!editor.selection?.anchor) return null;
  const [entry] = Editor.nodes(editor, {
    match: node => Element.isElement(node) && !editor.isInline(node),
    mode: 'lowest',
  });

  if (!entry) {
    return null;
  }
  const [startBlock] = entry;

  return Element.isElement(startBlock) && startBlock?.type === TYPE_PARAGRAPH ? startBlock : null;
};
