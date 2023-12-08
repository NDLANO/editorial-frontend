/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Editor, Node, Element, Range, Transforms, Path, Point } from 'slate';

import getCurrentBlock from '../../../utils/getCurrentBlock';
import { TYPE_PARAGRAPH } from '../../paragraph/types';
import { defaultParagraphBlock } from '../../paragraph/utils';
import { TYPE_LIST_ITEM } from '../types';
import { defaultListItemBlock } from '../utils/defaultBlocks';

const onEnter = (event: KeyboardEvent, editor: Editor, next?: (event: KeyboardEvent) => void) => {
  if (event.shiftKey || !editor.selection) return next?.(event);

  const listItemEntry = getCurrentBlock(editor, TYPE_LIST_ITEM);
  const paragraphEntry = getCurrentBlock(editor, TYPE_PARAGRAPH);

  if (!listItemEntry || !paragraphEntry) {
    return next?.(event);
  }

  const [currentListItem, currentListItemPath] = listItemEntry;
  const [currentParagraph, currentParagraphPath] = paragraphEntry;

  // Check that list and paragraph are of correct type.
  if (!Element.isElement(currentListItem) || currentListItem.type !== TYPE_LIST_ITEM) {
    return next?.(event);
  }
  if (!Element.isElement(currentParagraph) || currentParagraph.type !== TYPE_PARAGRAPH) {
    return next?.(event);
  }

  // Paragraph must be a direct child of list item
  if (!Path.isChild(currentParagraphPath, currentListItemPath)) {
    return next?.(event);
  }

  event.preventDefault();

  // If selection is expanded, delete selected content first.
  // Selection should now be collapsed
  if (Range.isExpanded(editor.selection)) {
    Editor.deleteFragment(editor);
  }

  // If list-item is empty, remove list item and jump out of list.
  if (Node.string(currentListItem) === '' && currentListItem.children.length === 1) {
    Editor.withoutNormalizing(editor, () => {
      Transforms.unwrapNodes(editor, {
        at: currentListItemPath,
      });
      Transforms.liftNodes(editor, {
        at: currentListItemPath,
      });
    });
    return;
  }

  Transforms.unsetNodes(editor, 'serializeAsText', {
    match: (node) => Element.isElement(node) && node.type === TYPE_PARAGRAPH,
    mode: 'lowest',
  });

  // If at end of list-item, insert a new list item.
  const listItemEnd = Editor.end(editor, currentListItemPath);
  if (Point.equals(listItemEnd, editor.selection.anchor)) {
    const nextPath = Path.next(currentListItemPath);
    Transforms.insertNodes(
      editor,
      { ...defaultListItemBlock(), children: [defaultParagraphBlock()] },
      { at: nextPath },
    );
    Transforms.select(editor, Editor.start(editor, nextPath));
    return;
  }

  // If at the start of list-item, insert a new list item at current path
  const listItemStart = Editor.start(editor, currentListItemPath);
  if (Point.equals(listItemStart, editor.selection.anchor)) {
    Transforms.insertNodes(
      editor,
      { ...defaultListItemBlock(), children: [defaultParagraphBlock()] },
      { at: currentListItemPath },
    );
    return;
  }
  // Split current listItem at selection.
  Transforms.splitNodes(editor, {
    match: (node) => Element.isElement(node) && node.type === TYPE_LIST_ITEM,
    mode: 'lowest',
  });
  Transforms.select(editor, Editor.start(editor, Path.next(currentListItemPath)));
};

export default onEnter;
