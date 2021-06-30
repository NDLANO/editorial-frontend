import { Editor, Transforms, Element, Range, Path } from 'slate';
import { ReactEditor } from 'slate-react';
import { TYPE_LIST, TYPE_LIST_ITEM } from '..';
import hasNodeOfType from '../../../utils/hasNodeOfType';
import { TYPE_PARAGRAPH } from '../../paragraph/utils';
import { defaultListBlock, defaultListItemBlock } from './defaultBlocks';
import { isListItemSelected, isSelectionOnlyOfType } from './isSelectionOnlyOfType';

export const toggleList = (editor: Editor, type: string) => {
  const listType = type ? type : 'numbered-list';

  const isIdentical = isSelectionOnlyOfType(editor, listType);

  const isList = hasNodeOfType(editor, TYPE_LIST);
  if (!Range.isRange(editor.selection)) {
    return;
  }

  if (isIdentical) {
    if (!Range.isRange(editor.selection)) {
      return;
    }

    return Transforms.liftNodes(editor, {
      match: node =>
        Element.isElement(node) && node.type === TYPE_LIST_ITEM && isListItemSelected(editor, node),
      mode: 'all',
    });
    // List normalizer removes empty list blocks afterwards.
  } else if (isList) {
    Transforms.setNodes(
      editor,
      { changeTo: listType },
      {
        match: node => {
          if (
            !Element.isElement(node) ||
            node.type !== TYPE_LIST_ITEM ||
            !isListItemSelected(editor, node)
          ) {
            return false;
          }
          const [parentNode] = Editor.node(editor, Path.parent(ReactEditor.findPath(editor, node)));

          const shouldChange =
            Element.isElement(parentNode) &&
            parentNode.type === TYPE_LIST &&
            parentNode.listType !== listType;

          return shouldChange;
        },
        mode: 'all',
      },
    );
    // List normalizer splits and merges list items that are changed to new list type.
  } else {
    Editor.withoutNormalizing(editor, () => {
      for (const [node, path] of Editor.nodes(editor, {
        match: node => Element.isElement(node) && node.type === TYPE_PARAGRAPH,
      })) {
        Transforms.wrapNodes(editor, defaultListItemBlock(), {
          at: path,
        });
        Transforms.wrapNodes(editor, defaultListBlock(type), {
          at: path,
        });
      }
    });
  }
};
