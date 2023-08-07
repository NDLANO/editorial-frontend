/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Range, Element, Transforms } from 'slate';
import { firstTextBlockElement } from '../../../utils/normalizationHelpers';
import { TYPE_DEFINITION_DESCRIPTION, TYPE_DEFINITION_TERM, TYPE_DEFINITION_LIST } from '../types';
import { isDefinitionListItem } from './isDefinitionListItem';
import isOnlySelectionOfDefinitionList from './isOnlySelectionOfDefinitionList';

export const toggleDefinitionList = (editor: Editor) => {
  if (!Range.isRange(editor.selection)) {
    return;
  }
  const isSelected = isOnlySelectionOfDefinitionList(editor);

  if (isSelected) {
    return Transforms.liftNodes(editor, {
      match: (node, path) =>
        Element.isElement(node) &&
        (node.type === TYPE_DEFINITION_DESCRIPTION || node.type === TYPE_DEFINITION_TERM) &&
        isDefinitionListItem(editor, path),
      mode: 'all',
    });
  } else {
    Editor.withoutNormalizing(editor, () => {
      // The withoutNormalizing function is within its own scope and the selection check above does then not follow
      if (!Range.isRange(editor.selection)) {
        return;
      }

      Transforms.setNodes(
        editor,
        { type: TYPE_DEFINITION_LIST },
        {
          match: (node) => Element.isElement(node) && firstTextBlockElement.includes(node.type),
          at: Editor.unhangRange(editor, editor.selection),
          mode: 'lowest',
        },
      );
    });
  }
};
