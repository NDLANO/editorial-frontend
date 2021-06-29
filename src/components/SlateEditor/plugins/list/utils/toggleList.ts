import { Editor, Transforms, Element, Range, Path, Node } from 'slate';
import { jsx } from 'slate-hyperscript';
import { ReactEditor } from 'slate-react';
import { ListElement, ListItemElement, LIST_TYPES, TYPE_LIST, TYPE_LIST_ITEM } from '..';
import hasNodeOfType from '../../../utils/hasNodeOfType';
import hasNodeWithProps from '../../../utils/hasNodeWithProps';
import { TYPE_PARAGRAPH } from '../../paragraph/utils';
import { defaultListBlock, defaultListItemBlock } from './defaultBlocks';
import { isListItemSelected, isSelectionOnlyOfType } from './isSelectionOnlyOfType';

export const toggleList = (editor: Editor, type: string) => {
  const listType = type ? type : 'numbered-list';
  const newListProps: Partial<ListElement> = { type: TYPE_LIST, listType };
  const newListItemProps: Partial<ListItemElement> = { type: TYPE_LIST_ITEM };

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
    // for (const [node, path] of Editor.nodes(editor, {
    //   match: node =>
    //     Element.isElement(node) && node.type === TYPE_LIST_ITEM && isListItemSelected(editor, node),
    //   reverse: true,
    // })) {
    // }
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
    // List normalizer

    // Transforms.setNodes(
    //   editor,
    //   { listType: type },
    //   {
    //     match: node => Element.isElement(node) && node.type === TYPE_LIST,
    //     mode: 'lowest',
    //     hanging: false,
    //   },
    // );
  } else {
    Transforms.wrapNodes(editor, defaultListItemBlock(), {
      match: node => Element.isElement(node) && node.type === TYPE_PARAGRAPH,
    });
    Transforms.wrapNodes(editor, defaultListBlock(type), {
      match: node => Element.isElement(node) && node.type === TYPE_LIST_ITEM,
    });
  }
};
