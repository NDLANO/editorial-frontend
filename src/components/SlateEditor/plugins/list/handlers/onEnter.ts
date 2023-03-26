import { Editor, Node, Element, Range, Transforms, Path, Point } from 'slate';

import { TYPE_LIST_ITEM } from '../types';
import getCurrentBlock from '../../../utils/getCurrentBlock';
import { defaultParagraphBlock } from '../../paragraph/utils';
import { defaultListItemBlock } from '../utils/defaultBlocks';
import { TYPE_PARAGRAPH } from '../../paragraph/types';

const onEnter = (event: KeyboardEvent, editor: Editor, next?: (event: KeyboardEvent) => void) => {
  if (event.shiftKey && next) return next(event);

  if (!editor.selection && next) return next(event);
  else if (!editor.selection) return undefined;

  const listItemEntry = getCurrentBlock(editor, TYPE_LIST_ITEM);
  const paragraphEntry = getCurrentBlock(editor, TYPE_PARAGRAPH);

  if (!listItemEntry || !paragraphEntry) {
    return next && next(event);
  }

  const [currentListItem, currentListItemPath] = listItemEntry;
  const [currentParagraph, currentParagraphPath] = paragraphEntry;

  // Check that list and paragraph are of correct type.
  if (!Element.isElement(currentListItem) || currentListItem.type !== TYPE_LIST_ITEM) {
    return next && next(event);
  }
  if (!Element.isElement(currentParagraph) || currentParagraph.type !== TYPE_PARAGRAPH) {
    return next && next(event);
  }

  // Paragraph must be a direct child of list item
  if (!Path.isChild(currentParagraphPath, currentListItemPath)) {
    return next && next(event);
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
    match: node => Element.isElement(node) && node.type === TYPE_PARAGRAPH,
    mode: 'lowest',
  });

  // If at end of list-item, insert a new list item.
  const nextPoint = Editor.after(editor, Range.end(editor.selection));
  const listItemEnd = Editor.end(editor, currentListItemPath);
  if (
    (nextPoint && Point.equals(listItemEnd, nextPoint)) ||
    Point.equals(listItemEnd, editor.selection.anchor)
  ) {
    const nextPath = Path.next(currentListItemPath);
    Transforms.insertNodes(
      editor,
      { ...defaultListItemBlock(), children: [defaultParagraphBlock()] },
      { at: nextPath },
    );
    Transforms.select(editor, Editor.start(editor, nextPath));
    return;
  }

  // Split current listItem at selection.
  Transforms.splitNodes(editor, {
    match: node => Element.isElement(node) && node.type === TYPE_LIST_ITEM,
    mode: 'lowest',
  });
};

export default onEnter;
