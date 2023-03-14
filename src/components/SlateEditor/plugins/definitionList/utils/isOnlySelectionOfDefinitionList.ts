/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element } from 'slate';
import { TYPE_DEFINTION_DESCRIPTION, TYPE_DEFINTION_LIST, TYPE_DEFINTION_TERM } from '../types';
import { isDefinitionListItem } from './isDefinitionListItem';

const isOnlySelectionOfDefinitionList = (editor: Editor) => {
  let hasListItems = false;

  for (const [, path] of Editor.nodes(editor, {
    match: (node, path) =>
      Element.isElement(node) &&
      (node.type === TYPE_DEFINTION_DESCRIPTION || node.type === TYPE_DEFINTION_TERM) &&
      isDefinitionListItem(editor, path),
  })) {
    const [parentNode] = Editor.parent(editor, path);
    if (Element.isElement(parentNode) && parentNode.type === TYPE_DEFINTION_LIST) {
      hasListItems = true;
      continue;
    }
    return false;
  }
  return hasListItems;
};

export default isOnlySelectionOfDefinitionList;
