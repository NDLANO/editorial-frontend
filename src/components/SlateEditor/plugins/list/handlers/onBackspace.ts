import { KeyboardEvent, KeyboardEventHandler } from 'react';
import { Editor, Element, Transforms, Path, Range, Node } from 'slate';
import { ReactEditor } from 'slate-react';

import hasNodeOfType from '../../../utils/hasNodeOfType';
import { TYPE_LIST, TYPE_LIST_ITEM } from '..';

import { defaultListBlock } from '../utils/defaultBlocks';
import getCurrentBlock from '../../../utils/getCurrentBlock';
import { TYPE_PARAGRAPH } from '../../paragraph/utils';

const onBackspace = (
  event: KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  next?: KeyboardEventHandler<HTMLDivElement>,
) => {
  // If no selection use default behaviour.
  if (!editor.selection) return next && next(event);
  const isList = hasNodeOfType(editor, TYPE_LIST);

  if (!isList) {
    return next && next(event);
  }

  const [currentItemNode, currentItemPath] = getCurrentBlock(editor, TYPE_LIST_ITEM);
  const [currentListNode, currentListPath] = getCurrentBlock(editor, TYPE_LIST);

  if (
    currentItemNode &&
    Element.isElement(currentItemNode) &&
    currentItemNode.type === TYPE_LIST_ITEM &&
    currentListNode &&
    Element.isElement(currentListNode) &&
    currentListNode.type === TYPE_LIST
  ) {
    if (!editor.selection) {
      return;
    }
    if (
      Range.isCollapsed(editor.selection) &&
      Path.isDescendant(editor.selection.anchor.path, currentItemPath)
    ) {
      const [firstItemNode, firstItemNodePath] = Editor.node(editor, [...currentItemPath, 0]);
      const [parentNode] = Editor.node(editor, Path.parent(currentListPath));
      // If first block of list element is empty (usually a header, paragraph or blockquote)
      if (Node.string(firstItemNode) === '') {
        event.preventDefault();
        if (!Element.isElement(parentNode) || parentNode.type !== TYPE_LIST_ITEM) {
          const childList = currentItemNode.children[currentItemNode.children.length - 1];
          if (Element.isElement(childList) && childList.type === TYPE_LIST) {
            if (childList.listType !== currentListNode.listType) {
              Transforms.setNodes(
                editor,
                { listType: currentListNode.listType },
                { at: [...currentItemPath, currentItemNode.children.length - 1] },
              );
            }
          }
        }
        // Remove first block since it is empty and lift entire item.
        // List Normalizer will remove empty list
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
