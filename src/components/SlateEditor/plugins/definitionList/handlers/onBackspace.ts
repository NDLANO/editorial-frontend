/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element, Transforms, Path, Node, Range, Point } from 'slate';
import hasNodeOfType from '../../../utils/hasNodeOfType';
import { TYPE_DEFINTION_DESCRIPTION, TYPE_DEFINTION_LIST, TYPE_DEFINTION_TERM } from '../types';

const onBackspace = (
  e: KeyboardEvent,
  editor: Editor,
  nextOnKeyDown: ((e: KeyboardEvent) => void) | undefined,
) => {
  if (!editor.selection) return nextOnKeyDown?.(e);
  const isDefinition = hasNodeOfType(editor, TYPE_DEFINTION_LIST);

  if (!isDefinition) {
    return nextOnKeyDown?.(e);
  }

  const [selectedDefinitionItem, selectedDefinitionItemPath] = Editor.parent(
    editor,
    editor.selection.anchor.path,
  );

  if (
    Element.isElement(selectedDefinitionItem) &&
    selectedDefinitionItem.type === TYPE_DEFINTION_TERM
  ) {
    const [selectedTerm, selectedTermPath] = [selectedDefinitionItem, selectedDefinitionItemPath];
    const [, firstItemNodePath] = Editor.node(editor, [...selectedTermPath, 0]);
    // If cursor is placed at start of first item child
    if (
      (Point.equals(Range.start(editor.selection), Editor.start(editor, firstItemNodePath)) &&
        !Path.hasPrevious(selectedTermPath)) ||
      (Range.start(editor.selection) && Node.string(selectedTerm) === '')
    ) {
      Editor.withoutNormalizing(editor, () => {
        Transforms.removeNodes(editor, { at: Path.next(selectedTermPath) });
        Transforms.liftNodes(editor, { at: selectedTermPath });
      });
      return;
    }
    return;
  } else if (
    Element.isElement(selectedDefinitionItem) &&
    selectedDefinitionItem.type === TYPE_DEFINTION_DESCRIPTION
  ) {
    const [selectedDescription, selectedDescriptionPath] = [
      selectedDefinitionItem,
      selectedDefinitionItemPath,
    ];
    if (
      Range.start(editor.selection) &&
      Node.string(selectedDescription) === '' &&
      Path.hasPrevious(selectedDescriptionPath)
    ) {
      Transforms.select(editor, Editor.end(editor, Path.previous(selectedDescriptionPath)));
      return;
    }
  }
  return nextOnKeyDown?.(e);
};

export default onBackspace;
