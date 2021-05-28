/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DragEventHandler } from 'react';
import { Editor, Transforms, Element } from 'slate';
import { ReactEditor } from 'slate-react';
import onDrop from './onDrop';
import { getTopNode, shouldCopyTableOrList } from './utils';

const onDragOver = (editor: Editor): DragEventHandler<HTMLDivElement> => event => {
  event.preventDefault();
};

const onDragStart = (editor: Editor): DragEventHandler<HTMLDivElement> => event => {
  event.dataTransfer.effectAllowed = 'copy';

  const node = ReactEditor.toSlateNode(editor, event.target as globalThis.Node);
  const path = ReactEditor.findPath(editor, node);
  if (Element.isElement(node)) {
    event.dataTransfer.setData('application/slate-node-path', JSON.stringify(path));
  }

  const voidMatch =
    Editor.isVoid(editor, node) ||
    Editor['void'](editor, {
      at: path,
      voids: true,
    });

  if (voidMatch) {
    const range = Editor.range(editor, path);
    Transforms.select(editor, range);
  }

  ReactEditor.setFragmentData(editor, event.dataTransfer);

  // OLD
  // event.dataTransfer.effectAllowed = 'copy';
  // const dragSource = editor.findNode(event.target);
  // const { type } = getTopNode(dragSource, editor);
  // if (Text.isText(dragSource) && !shouldCopyTableOrList(type, editor)) {
  //   // just copy the text natively
  //   return next();
  // }

  // event.dataTransfer.setData('text/nodeKey', dragSource.key);
};

export { onDragOver, onDragStart, onDrop };
