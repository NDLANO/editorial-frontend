/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DragEventHandler } from 'react';
import { Editor, Element, Text } from 'slate';
import { ReactEditor } from 'slate-react';
import onDrop from './onDrop';
import { getTopNode } from './utils';

const onDragOver = (editor: Editor): DragEventHandler<HTMLDivElement> => event => {
  event.preventDefault();
};

const onDragStart = (editor: Editor): DragEventHandler<HTMLDivElement> => event => {
  event.dataTransfer.effectAllowed = 'copy';

  const node = ReactEditor.toSlateNode(editor, event.target as globalThis.Node);
  const path = ReactEditor.findPath(editor, node);
  const topNode = getTopNode(editor, path);
  if (!Text.isText(node) && topNode && Element.isElement(topNode[0])) {
    event.dataTransfer.setData('application/slate-node-path', JSON.stringify(topNode[1]));
  }
};

export { onDragOver, onDragStart, onDrop };
