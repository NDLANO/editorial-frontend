/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element, Path, Transforms } from 'slate';
import { TYPE_DEFINTION_TERM, TYPE_DEFINTION_DESCRIPTION } from '../types';
import { definitionDescription, definitionTerm } from '../utils/defaultBlocks';
import {
  nodeContainsText,
  removeDefinitionPair,
  moveSelectionOutOfDefinitionList,
} from '../utils/keyboardHelpers';

const onEnter = (
  editor: Editor,
  e: KeyboardEvent,
  nextOnKeyDown: ((e: KeyboardEvent) => void) | undefined,
) => {
  if (e.shiftKey && nextOnKeyDown) return nextOnKeyDown(e);
  if (!editor.selection && nextOnKeyDown) return nextOnKeyDown(e);
  else if (!editor.selection) return undefined;

  const [selectionNode, selectionPath] =
    editor.selection && Editor.node(editor, editor.selection.anchor.path);
  const [selectedDefinitionItem, selectedDefinitionItemPath] = Editor.parent(editor, selectionPath);

  if (
    Element.isElement(selectedDefinitionItem) &&
    selectedDefinitionItem.type === TYPE_DEFINTION_TERM
  ) {
    const [, selectedTermPath] = [selectedDefinitionItem, selectedDefinitionItemPath];
    e.preventDefault();

    if (Path.hasPrevious(selectedTermPath)) {
      const previous = Editor.previous(editor, { at: selectedTermPath });
      if (previous) {
        const [previousDefinitionDescription, previousDefinitionDescriptionPath] = previous;

        if (!nodeContainsText(previousDefinitionDescription)) {
          Editor.withoutNormalizing(editor, () => {
            removeDefinitionPair(editor, Path.next(selectedTermPath), selectedTermPath);
            moveSelectionOutOfDefinitionList(editor, previousDefinitionDescriptionPath);
          });
          return;
        }
      }
    }
    Transforms.select(editor, {
      anchor: Editor.point(editor, Path.next(selectedTermPath), { edge: 'end' }),
      focus: Editor.point(editor, Path.next(selectedTermPath), { edge: 'end' }),
    });
    return;
  } else if (
    Element.isElement(selectedDefinitionItem) &&
    selectedDefinitionItem.type === TYPE_DEFINTION_DESCRIPTION
  ) {
    const [selectedDescription, selectedDescriptionPath] = [
      selectedDefinitionItem,
      selectedDefinitionItemPath,
    ];

    const [selectedTerm, selectedTermPath] = Editor.node(
      editor,
      Path.previous(selectedDescriptionPath),
    );

    //If empty move selection out of list and remove empty pair
    if (!nodeContainsText(selectedDescription) && !nodeContainsText(selectedTerm)) {
      Editor.withoutNormalizing(editor, () =>
        moveSelectionOutOfDefinitionList(editor, selectedDescriptionPath),
      );
      Editor.withoutNormalizing(editor, () =>
        removeDefinitionPair(editor, selectedDescriptionPath, selectedTermPath),
      );
      e.preventDefault();
      return;
    } else {
      // If not empty insert new definition pair
      Editor.withoutNormalizing(editor, () => {
        Transforms.insertNodes(editor, [definitionDescription], {
          at: Path.next(selectedDescriptionPath),
        });
        Transforms.insertNodes(editor, [definitionTerm], {
          at: Path.next(selectedDescriptionPath),
        });
        Transforms.select(editor, {
          anchor: Editor.point(editor, Path.next(selectedDescriptionPath), { edge: 'end' }),
          focus: Editor.point(editor, Path.next(selectedDescriptionPath), { edge: 'end' }),
        });
      });

      e.preventDefault();

      return;
    }
  }
  return nextOnKeyDown && nextOnKeyDown(e);
};

export default onEnter;
