/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Node, Element } from 'slate';
import { TYPE_PARAGRAPH } from './index';

export const getCurrentParagraph = (editor: Editor) => {
  if (!editor.selection?.anchor) return null;
  const startBlock = Node.parent(editor, editor.selection?.anchor.path);
  if (!Element.isElement(startBlock)) {
    return null;
  }
  return startBlock && startBlock?.type === TYPE_PARAGRAPH ? startBlock : null;
};
