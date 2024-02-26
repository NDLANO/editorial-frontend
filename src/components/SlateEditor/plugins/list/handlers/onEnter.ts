/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Editor, Node, Element, Range, Transforms, Path, Point } from "slate";

import { ReactEditor } from "slate-react";
import { TYPE_PARAGRAPH } from "../../paragraph/types";
import { defaultParagraphBlock } from "../../paragraph/utils";
import { getEditorAncestors } from "../../toolbar/toolbarState";
import { TYPE_LIST_ITEM } from "../types";
import { defaultListItemBlock } from "../utils/defaultBlocks";

const onEnter = (event: KeyboardEvent, editor: Editor, next?: (event: KeyboardEvent) => void) => {
  if (event.shiftKey || !editor.selection) return next?.(event);

  const [firstChild, secondChild] = getEditorAncestors(editor, true);
  const selectedDefinitionItem = firstChild.type === TYPE_LIST_ITEM ? firstChild : secondChild;

  if (!selectedDefinitionItem) {
    return next?.(event);
  }

  const selectedDefinitionItemPath = ReactEditor.findPath(editor, selectedDefinitionItem);

  // Check that list and paragraph are of correct type.
  if (selectedDefinitionItem.type !== TYPE_LIST_ITEM) {
    return next?.(event);
  }
  event.preventDefault();

  // If selection is expanded, delete selected content first.
  // Selection should now be collapsed
  if (Range.isExpanded(editor.selection)) {
    Editor.deleteFragment(editor);
  }

  // If list-item is empty, remove list item and jump out of list.
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
    match: (node) => Element.isElement(node) && node.type === TYPE_PARAGRAPH,
    mode: "lowest",
  });

  // If at end of list-item, insert a new list item.
  const listItemEnd = Editor.end(editor, selectedDefinitionItemPath);
  if (Point.equals(listItemEnd, editor.selection.anchor)) {
    const nextPath = Path.next(selectedDefinitionItemPath);
    Transforms.insertNodes(
      editor,
      { ...defaultListItemBlock(), children: [defaultParagraphBlock()] },
      { at: nextPath },
    );
    Transforms.select(editor, Editor.start(editor, nextPath));
    return;
  }

  // If at the start of list-item, insert a new list item at current path
  const listItemStart = Editor.start(editor, selectedDefinitionItemPath);
  if (Point.equals(listItemStart, editor.selection.anchor)) {
    Transforms.insertNodes(
      editor,
      { ...defaultListItemBlock(), children: [defaultParagraphBlock()] },
      { at: selectedDefinitionItemPath },
    );
    return;
  }
  // Split current listItem at selection.
  Transforms.splitNodes(editor, {
    match: (node) => Element.isElement(node) && node.type === TYPE_LIST_ITEM,
    mode: "lowest",
  });
  Transforms.select(editor, Editor.start(editor, Path.next(selectedDefinitionItemPath)));
};

export default onEnter;
