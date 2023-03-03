/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element, Transforms, Node, Path } from 'slate';
import hasNodeOfType from '../../../utils/hasNodeOfType';
import { TYPE_DEFINTION_DESCRIPTION, TYPE_DEFINTION_LIST, TYPE_DEFINTION_TERM } from '../types';
import { nodeContainsText, removeDefinitionPair } from '../utils/keyboardHelpers';

const onBackspace = (
  e: KeyboardEvent,
  editor: Editor,
  nextOnKeyDown: ((e: KeyboardEvent) => void) | undefined,
) => {
  if (!editor.selection) return nextOnKeyDown && nextOnKeyDown(e);
  const isDefinition = hasNodeOfType(editor, TYPE_DEFINTION_LIST);

  if (!isDefinition) {
    return nextOnKeyDown && nextOnKeyDown(e);
  }

  const [, selectedPath] = editor.selection && Editor.node(editor, editor.selection.focus);
  const [selectedDefinitionItem, selectedDefinitionItemPath] = Editor.parent(editor, selectedPath);
  if (
    Element.isElement(selectedDefinitionItem) &&
    selectedDefinitionItem.type === TYPE_DEFINTION_TERM
  ) {
    const [selectedTerm, selectedTermPath] = [selectedDefinitionItem, selectedDefinitionItemPath];

    const [selectedDescription, selectedDescriptionPath] = Editor.node(
      editor,
      Path.next(selectedTermPath),
    );

    if (!nodeContainsText(selectedTerm)) {
      // Remove text in description pair in order to remove pair
      if (nodeContainsText(selectedDescription)) {
        Transforms.delete(editor, { at: selectedDescriptionPath });
      }

      const previous = Editor.previous(editor, { at: selectedTermPath });

      Editor.withoutNormalizing(editor, () => {
        removeDefinitionPair(editor, selectedDescriptionPath, selectedTermPath);
        const [parentNode, parentNodePath] = Editor.parent(editor, selectedTermPath);

        if (
          Element.isElement(parentNode) &&
          parentNode.type === 'definition-list' &&
          parentNode.children.length === 0
        ) {
          Transforms.removeNodes(editor, { at: parentNodePath });
        }
      });

      if (previous) {
        const [, previousDefinitionDescriptionPath] = previous;
        Transforms.select(editor, previousDefinitionDescriptionPath);
      }

      e.preventDefault();
      return nextOnKeyDown && nextOnKeyDown(e);
    }
  } else if (
    Element.isElement(selectedDefinitionItem) &&
    selectedDefinitionItem.type === TYPE_DEFINTION_DESCRIPTION
  ) {
    const [selectedDescription, selectedDescriptionPath] = [
      selectedDefinitionItem,
      selectedDefinitionItemPath,
    ];
    const maybeSelectedTerm = Editor.previous(editor, {
      at: selectedDescriptionPath,
    });

    if (!nodeContainsText(selectedDescription) && maybeSelectedTerm) {
      const [, selectedTermPath] = maybeSelectedTerm;

      Transforms.select(editor, selectedTermPath);
      e.preventDefault();

      return;
    } else if (
      Node.string(Node.child(selectedDescription, 0)) !== '' &&
      editor.selection.anchor.offset === 0
    ) {
      e.preventDefault();
    }
  }

  return nextOnKeyDown && nextOnKeyDown(e);
};

export default onBackspace;
