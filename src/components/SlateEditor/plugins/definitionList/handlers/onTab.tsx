/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element, Transforms } from 'slate';
import hasNodeOfType from '../../../utils/hasNodeOfType';
import getCurrentBlock from '../../../utils/getCurrentBlock';
import { TYPE_DEFINITION_DESCRIPTION, TYPE_DEFINITION_LIST, TYPE_DEFINITION_TERM } from '../types';

const onTab = (event: KeyboardEvent, editor: Editor, next?: (event: KeyboardEvent) => void) => {
  event.preventDefault();
  const isDefinition = hasNodeOfType(editor, TYPE_DEFINITION_LIST);
  if (!isDefinition || !editor.selection) {
    return next?.(event);
  }

  const listEntry = getCurrentBlock(editor, TYPE_DEFINITION_LIST);
  const listItemEntry = Editor.parent(editor, editor.selection.anchor.path);

  if (!listEntry || !listItemEntry) {
    return next?.(event);
  }

  const [currentListNode] = listEntry;
  const [currentItemNode, currentItemPath] = listItemEntry;

  if (Element.isElement(currentListNode) && currentListNode.type === TYPE_DEFINITION_LIST) {
    Editor.withoutNormalizing(editor, () => {
      if (
        event.shiftKey &&
        Element.isElement(currentItemNode) &&
        currentItemNode.type === TYPE_DEFINITION_DESCRIPTION
      ) {
        Transforms.setNodes(
          editor,
          {
            type: TYPE_DEFINITION_TERM,
            children: currentItemNode.children,
          },
          { at: currentItemPath },
        );
      } else if (
        Element.isElement(currentItemNode) &&
        currentItemNode.type === TYPE_DEFINITION_TERM
      ) {
        Transforms.setNodes(
          editor,
          {
            type: TYPE_DEFINITION_DESCRIPTION,
            children: currentItemNode.children,
          },
          { at: currentItemPath },
        );
      }
    });
  }
};

export default onTab;
