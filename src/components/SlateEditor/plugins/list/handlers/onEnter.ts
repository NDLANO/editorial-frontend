import { Editor, Node, Element, Range, Transforms, Path, Text } from 'slate';

import { TYPE_LIST_ITEM } from '..';
import getCurrentBlock from '../../../utils/getCurrentBlock';
import { TYPE_PARAGRAPH } from '../../paragraph/utils';
import { defaultListItemBlock } from '../utils/defaultBlocks';

const onEnter = (event: KeyboardEvent, editor: Editor, next?: (event: KeyboardEvent) => void) => {
  if (event.shiftKey && next) return next(event);

  if (!editor.selection && next) return next(event);
  else if (!editor.selection) return undefined;

  const [currentListItem, currentListItemPath] = getCurrentBlock(editor, TYPE_LIST_ITEM);
  const [currentParagraph, currentParagraphPath] = getCurrentBlock(editor, TYPE_PARAGRAPH);

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

  // If expanded selection is expanded, delete selected content first.
  // Selection should now be collapsed
  if (Range.isExpanded(editor.selection)) {
    Editor.deleteForward(editor);
  }

  // If paragraph is empty, remove list item and jump out of list.
  if (
    Node.string(currentParagraph) === '' &&
    currentParagraph.children.length === 1 &&
    Text.isText(currentParagraph.children[0])
  ) {
    Editor.withoutNormalizing(editor, () => {
      Transforms.unwrapNodes(editor, { at: currentListItemPath });
      Transforms.liftNodes(editor, { at: currentListItemPath });
    });
    return;
  }

  // Split current listItem at selection.
  Editor.withoutNormalizing(editor, () => {
    Transforms.splitNodes(editor, { always: true });
    Transforms.wrapNodes(editor, defaultListItemBlock(), { at: currentParagraphPath });
    Transforms.liftNodes(editor, { at: currentParagraphPath });
  });
};

export default onEnter;
