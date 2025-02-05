/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { KeyboardEvent } from "react";
import { Editor, Element, Path, Transforms, Node, Range, Point } from "slate";
import { ReactEditor } from "slate-react";
import { getEditorAncestors } from "../../toolbar/toolbarState";
import { TYPE_DEFINITION_TERM, TYPE_DEFINITION_DESCRIPTION } from "../types";
import { definitionDescription, definitionTerm } from "../utils/defaultBlocks";

const onEnter = (
  e: KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  nextOnKeyDown: ((e: KeyboardEvent<HTMLDivElement>) => void) | undefined,
) => {
  if ((e.shiftKey && nextOnKeyDown) || (!editor.selection && nextOnKeyDown)) {
    return nextOnKeyDown(e);
  } else if (!editor.selection) return;

  const [firstChild, secondChild] = getEditorAncestors(editor, true);
  const selectedDefinitionItem =
    firstChild.type === TYPE_DEFINITION_DESCRIPTION || firstChild.type === TYPE_DEFINITION_TERM
      ? firstChild
      : secondChild;

  if (!selectedDefinitionItem) {
    return nextOnKeyDown?.(e);
  }

  const selectedDefinitionItemPath = ReactEditor.findPath(editor, selectedDefinitionItem);

  if (
    !selectedDefinitionItem ||
    !Element.isElement(selectedDefinitionItem) ||
    (selectedDefinitionItem.type !== TYPE_DEFINITION_DESCRIPTION &&
      selectedDefinitionItem.type !== TYPE_DEFINITION_TERM)
  ) {
    return nextOnKeyDown?.(e);
  }

  e.preventDefault();

  if (Range.isExpanded(editor.selection)) {
    Editor.deleteFragment(editor);
  }

  if (Node.string(selectedDefinitionItem) === "" && selectedDefinitionItem.children.length === 1) {
    Editor.withoutNormalizing(editor, () => {
      Transforms.unwrapNodes(editor, {
        at: selectedDefinitionItemPath,
      });
      Transforms.liftNodes(editor, {
        at: selectedDefinitionItemPath,
      });
    });
    return;
  }

  Transforms.unsetNodes(editor, "serializeAsText", {
    match: (node) =>
      Element.isElement(node) && (node.type === TYPE_DEFINITION_DESCRIPTION || node.type === TYPE_DEFINITION_TERM),
    mode: "lowest",
  });

  const nextPoint = Editor.after(editor, Range.end(editor.selection));
  const listItemEnd = Editor.end(editor, selectedDefinitionItemPath);

  if ((nextPoint && Point.equals(listItemEnd, nextPoint)) || Point.equals(listItemEnd, editor.selection.anchor)) {
    const nextPath = Path.next(selectedDefinitionItemPath);
    if (Element.isElement(selectedDefinitionItem) && selectedDefinitionItem.type === TYPE_DEFINITION_TERM) {
      Transforms.insertNodes(editor, definitionTerm(), { at: nextPath });
    } else if (
      Element.isElement(selectedDefinitionItem) &&
      selectedDefinitionItem.type === TYPE_DEFINITION_DESCRIPTION
    ) {
      Transforms.insertNodes(editor, definitionDescription(), { at: nextPath });
    }
    Transforms.select(editor, Editor.start(editor, nextPath));
    return;
  }

  // Split current listItem at selection.
  Transforms.splitNodes(editor, {
    match: (node) =>
      Element.isElement(node) && (node.type === TYPE_DEFINITION_TERM || node.type === TYPE_DEFINITION_DESCRIPTION),
    mode: "lowest",
  });
};

export default onEnter;
