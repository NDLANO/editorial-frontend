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
  if (!editor.selection) return nextOnKeyDown && nextOnKeyDown(e);
  const isDefinition = hasNodeOfType(editor, TYPE_DEFINTION_LIST);

  if (!isDefinition) {
    return nextOnKeyDown && nextOnKeyDown(e);
  }

  const [selectedDefinitionItem, selectedDefinitionItemPath] = Editor.parent(
    editor,
    editor.selection.anchor.path,
  );

  if (
    Element.isElement(selectedDefinitionItem) &&
    selectedDefinitionItem.type === TYPE_DEFINTION_TERM
  ) {
    const [, firstItemNodePath] = Editor.node(editor, [...selectedDefinitionItemPath, 0]);
    // If cursor is placed at start of first item child
    if (
      Point.equals(Range.start(editor.selection), Editor.start(editor, firstItemNodePath)) &&
      !Path.hasPrevious(selectedDefinitionItemPath)
    ) {
      e.preventDefault();
      Editor.withoutNormalizing(editor, () => {
        Transforms.removeNodes(editor, { at: Path.next(selectedDefinitionItemPath) });
        Transforms.liftNodes(editor, { at: selectedDefinitionItemPath });
      });
      return;
    } else if (Range.start(editor.selection) && Node.string(selectedDefinitionItem) === '') {
      e.preventDefault();
      Transforms.select(editor, Editor.end(editor, Path.previous(selectedDefinitionItemPath)));
      Editor.withoutNormalizing(editor, () => {
        Transforms.removeNodes(editor, { at: Path.next(selectedDefinitionItemPath) });
        Transforms.removeNodes(editor, { at: selectedDefinitionItemPath });
      });

      return;
    }
  } else if (
    Element.isElement(selectedDefinitionItem) &&
    selectedDefinitionItem.type === TYPE_DEFINTION_DESCRIPTION
  ) {
    if (
      Range.start(editor.selection) &&
      Node.string(selectedDefinitionItem) === '' &&
      Path.hasPrevious(selectedDefinitionItemPath)
    ) {
      Transforms.select(editor, Editor.start(editor, Path.previous(selectedDefinitionItemPath)));
      e.preventDefault();
      return;
    }
  }
  return nextOnKeyDown && nextOnKeyDown(e);
};

export default onBackspace;
