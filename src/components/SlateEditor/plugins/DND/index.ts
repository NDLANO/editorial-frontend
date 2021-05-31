/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DragEventHandler } from 'react';
import { Editor, Element, Path } from 'slate';
import { ReactEditor } from 'slate-react';
import onDrop from './onDrop';

const onDragOver = (editor: Editor): DragEventHandler<HTMLDivElement> => event => {
  event.preventDefault();
};

const onDragStart = (editor: Editor): DragEventHandler<HTMLDivElement> => event => {
  event.dataTransfer.effectAllowed = 'copy';

  const node = ReactEditor.toSlateNode(editor, event.target as globalThis.Node);
  const path = ReactEditor.findPath(editor, node);
  if (Element.isElement(node)) {
    event.dataTransfer.setData('application/slate-node-path', JSON.stringify(path));
    return;
  }
  const [parent, parentPath] = Editor.node(editor, Path.parent(path));
  if (Element.isElement(parent) && parent.type === 'heading') {
    if (!editor.selection) return;

    if (
      !Path.isChild(editor.selection.anchor.path, parentPath) ||
      !Path.isChild(editor.selection.focus.path, parentPath)
    ) {
      return;
    }
    console.log(JSON.stringify(editor.selection));
    event.dataTransfer.setData('application/slate-heading-range', JSON.stringify(editor.selection));
    event.dataTransfer.setData('application/slate-heading-path', JSON.stringify(parentPath));
  }
};

export { onDragOver, onDragStart, onDrop };
