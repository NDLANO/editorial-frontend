/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { findNode } from 'slate-react';
import { Text } from 'slate';
import onDrop from './onDrop';
import { getTopNode, shouldCopyTableOrList } from './utils';

function onDragOver(event, editor, next) {
  event.preventDefault();
}

function onDragStart(event, editor, next) {
  event.dataTransfer.effectAllowed = 'copy';
  const dragSource = findNode(event.target, editor);
  const { type } = getTopNode(dragSource, editor);
  if (Text.isText(dragSource) && !shouldCopyTableOrList(type, editor)) {
    // just copy the text natively
    return next();
  }

  event.dataTransfer.setData('text/nodeKey', dragSource.key);
}

export default {
  onDragStart,
  onDragOver,
  onDrop,
  schema: {},
};
