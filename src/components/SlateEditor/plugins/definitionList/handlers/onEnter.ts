/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element, Path, Transforms, Node, Range, Point } from 'slate';
import { TYPE_DEFINTION_TERM, TYPE_DEFINTION_DESCRIPTION } from '../types';
import { definitionTerm } from '../utils/defaultBlocks';

const onEnter = (
  editor: Editor,
  e: KeyboardEvent,
  nextOnKeyDown: ((e: KeyboardEvent) => void) | undefined,
) => {
  if (e.shiftKey && nextOnKeyDown) return nextOnKeyDown(e);
  if (!editor.selection && nextOnKeyDown) return nextOnKeyDown(e);
  else if (!editor.selection) return undefined;

  const [selectedDefinitionItem, selectedDefinitionItemPath] = Editor.parent(
    editor,
    editor.selection.anchor.path,
  );

  if (!selectedDefinitionItem) {
    return nextOnKeyDown?.(e);
  }

  if (
    Element.isElement(selectedDefinitionItem) &&
    selectedDefinitionItem.type === TYPE_DEFINTION_TERM
  ) {
    const [term, termPath] = [selectedDefinitionItem, selectedDefinitionItemPath];
    const maybeDescription = Editor.next(editor, { at: selectedDefinitionItemPath });

    if (Range.isExpanded(editor.selection)) {
      Editor.deleteFragment(editor);
    }
    if (maybeDescription) {
      const [description] = maybeDescription;
      if (
        Path.hasPrevious(termPath) &&
        Node.string(Editor.node(editor, Path.previous(termPath))[0]) === '' &&
        Node.string(term) === '' &&
        Node.string(description) === ''
      ) {
        Editor.withoutNormalizing(editor, () => {
          Transforms.removeNodes(editor, { at: Path.next(termPath) });
          Transforms.unwrapNodes(editor, { at: termPath });
          Transforms.liftNodes(editor, { at: termPath });
        });
        return;
      }
    }

    Transforms.select(editor, {
      anchor: Editor.point(editor, Path.next(termPath), { edge: 'end' }),
      focus: Editor.point(editor, Path.next(termPath), { edge: 'end' }),
    });
    e.preventDefault();
    return;
  } else if (
    Element.isElement(selectedDefinitionItem) &&
    selectedDefinitionItem.type === TYPE_DEFINTION_DESCRIPTION
  ) {
    const [description, descriptionPath] = [selectedDefinitionItem, selectedDefinitionItemPath];

    if (Range.isExpanded(editor.selection)) {
      Editor.deleteFragment(editor);
    }

    const maybeSelectedTerm = Editor.previous(editor, { at: selectedDefinitionItemPath });
    if (maybeSelectedTerm) {
      const [selectedTerm, selectedTermPath] = maybeSelectedTerm;
      if (Node.string(description) === '' && Node.string(selectedTerm) === '') {
        Editor.withoutNormalizing(editor, () => {
          Transforms.removeNodes(editor, { at: descriptionPath });
          Transforms.unwrapNodes(editor, { at: selectedTermPath });
          Transforms.liftNodes(editor, { at: selectedTermPath });
        });

        e.preventDefault();
        return;
      }
    }

    // If at end of list-item, insert a new definition pair.
    const nextPoint = Editor.after(editor, Range.end(editor.selection));
    const listItemEnd = Editor.end(editor, descriptionPath);
    if (
      (nextPoint && Point.equals(listItemEnd, nextPoint)) ||
      Point.equals(listItemEnd, editor.selection.anchor)
    ) {
      const nextPath = Path.next(descriptionPath);
      Editor.withoutNormalizing(editor, () => {
        Transforms.insertNodes(editor, definitionTerm, { at: nextPath });
        Transforms.select(editor, Editor.start(editor, nextPath));
      });

      e.preventDefault();

      return;
    }

    // Split current listItem at selection.
    Transforms.splitNodes(editor, {
      match: node => Element.isElement(node) && node.type === TYPE_DEFINTION_TERM,
      mode: 'lowest',
    });
  }
  return nextOnKeyDown?.(e);
};

export default onEnter;
