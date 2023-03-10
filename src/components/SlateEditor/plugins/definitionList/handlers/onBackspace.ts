/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element, Transforms, Path, Node } from 'slate';
import hasNodeOfType from '../../../utils/hasNodeOfType';
import { TYPE_DEFINTION_DESCRIPTION, TYPE_DEFINTION_LIST, TYPE_DEFINTION_TERM } from '../types';
import { removeDefinitionPair } from '../utils/keyboardHelpers';

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

  const [, selectionPath] = editor.selection && Editor.node(editor, editor.selection.anchor.path);
  const [selectedDefinitionItem, selectedDefinitionItemPath] = Editor.parent(editor, selectionPath);

  if (
    Element.isElement(selectedDefinitionItem) &&
    selectedDefinitionItem.type === TYPE_DEFINTION_TERM
  ) {
    const [selectedTerm, selectedTermPath] = [selectedDefinitionItem, selectedDefinitionItemPath];
    const [selectedDescription, selectedDescriptionPath] = Editor.node(
      editor,
      Path.next(selectedTermPath),
    );
    if (Node.string(selectedTerm) === '') {
      // Remove text in description pair in order to remove pair
      if (Node.string(selectedDescription) !== '') {
        Transforms.delete(editor, { at: selectedDescriptionPath });
      }

      if (Path.hasPrevious(selectedTermPath)) {
        const previous = Editor.previous(editor, { at: selectedTermPath });
        if (previous) {
          const [, previousDefinitionDescriptionPath] = previous;
          Transforms.select(editor, {
            anchor: Editor.point(editor, previousDefinitionDescriptionPath, {
              edge: 'end',
            }),
            focus: Editor.point(editor, previousDefinitionDescriptionPath, { edge: 'end' }),
          });
          Transforms.move(editor);
          Transforms.select(editor, Editor.range(editor, editor.selection.anchor.path));
        }
      }
      const [parentNode, parentNodePath] = Editor.parent(editor, selectedTermPath);

      Editor.withoutNormalizing(editor, () => {
        Transforms.removeNodes(editor, { at: selectedDescriptionPath });
        Transforms.removeNodes(editor, { at: selectedTermPath });
      });

      if (
        Element.isElement(parentNode) &&
        parentNode.type === TYPE_DEFINTION_LIST &&
        parentNode.children.length === 0
      ) {
        Transforms.liftNodes(editor, { at: parentNodePath });
      }
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

    if (!(Node.string(selectedDescription) === '') && maybeSelectedTerm) {
      const [, selectedTermPath] = maybeSelectedTerm;

      Transforms.select(editor, {
        anchor: Editor.point(editor, selectedTermPath, { edge: 'end' }),
        focus: Editor.point(editor, selectedTermPath, { edge: 'end' }),
      });
    }
  }

  e.preventDefault();
  return nextOnKeyDown && nextOnKeyDown(e);
};

export default onBackspace;
