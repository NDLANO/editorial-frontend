import { Editor, Element, Point, Range, Transforms } from 'slate';
import hasNodeOfType from '../../../utils/hasNodeOfType';
import { TYPE_LIST, TYPE_LIST_ITEM } from '..';
import getCurrentBlock from '../../../utils/getCurrentBlock';

const onBackspace = (
  event: KeyboardEvent,
  editor: Editor,
  next?: (event: KeyboardEvent) => void,
) => {
  if (!editor.selection) return next && next(event);
  const isList = hasNodeOfType(editor, TYPE_LIST);

  if (!isList) {
    return next && next(event);
  }

  const [currentItemNode, currentItemPath] = getCurrentBlock(editor, TYPE_LIST_ITEM);

  // Paragraph must be direct child of list
  if (
    currentItemNode &&
    Element.isElement(currentItemNode) &&
    currentItemNode.type === TYPE_LIST_ITEM
  ) {
    // Check that cursor is not expanded.
    if (Range.isCollapsed(editor.selection)) {
      const [, firstItemNodePath] = Editor.node(editor, [...currentItemPath, 0]);
      // If cursor is placed at start of first item child
      if (Point.equals(Range.start(editor.selection), Editor.start(editor, firstItemNodePath))) {
        event.preventDefault();
        return Transforms.liftNodes(editor, { at: currentItemPath });
      }
    }
  }
  return next && next(event);
};

export default onBackspace;
