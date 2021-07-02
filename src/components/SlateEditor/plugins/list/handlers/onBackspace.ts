import { KeyboardEvent, KeyboardEventHandler } from 'react';
import { Editor, Element, Transforms, Path, Range, Node } from 'slate';
import hasNodeOfType from '../../../utils/hasNodeOfType';
import { TYPE_LIST, TYPE_LIST_ITEM } from '..';
import getCurrentBlock from '../../../utils/getCurrentBlock';

const onBackspace = (
  event: KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  next?: KeyboardEventHandler<HTMLDivElement>,
) => {
  if (!editor.selection) return next && next(event);
  const isList = hasNodeOfType(editor, TYPE_LIST);

  if (!isList) {
    return next && next(event);
  }

  const [currentItemNode, currentItemPath] = getCurrentBlock(editor, TYPE_LIST_ITEM);
  const [currentListNode] = getCurrentBlock(editor, TYPE_LIST);

  // Confirm type of item and list
  if (
    currentItemNode &&
    Element.isElement(currentItemNode) &&
    currentItemNode.type === TYPE_LIST_ITEM &&
    currentListNode &&
    Element.isElement(currentListNode) &&
    currentListNode.type === TYPE_LIST
  ) {
    // Check that cursor is not expanded and that cursor is placed inside list item
    if (
      Range.isCollapsed(editor.selection) &&
      Path.isDescendant(editor.selection.anchor.path, currentItemPath)
    ) {
      const [firstItemNode, firstItemNodePath] = Editor.node(editor, [...currentItemPath, 0]);
      // If the first block in list item is an empty string
      if (Node.string(firstItemNode) === '') {
        event.preventDefault();

        // Remove first block since it is empty and lift entire item.
        // List Normalizer will remove empty list caused by lifting list items out
        return Editor.withoutNormalizing(editor, () => {
          Transforms.removeNodes(editor, { at: firstItemNodePath });
          Transforms.liftNodes(editor, { at: currentItemPath });
        });
      }
    }
  }
  return next && next(event);
};

export default onBackspace;
