import { Editor, Transforms, Element, Range, Path } from 'slate';
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

    Transforms.liftNodes(editor, {
      match: node =>
        Element.isElement(node) && node.type === TYPE_LIST_ITEM && isListItemSelected(editor, node),
      mode: 'all',
    });
  } else if (isList) {
    Transforms.setNodes(
      editor,
      { listType: type },
      {
        match: node => Element.isElement(node) && node.type === TYPE_LIST,
        mode: 'lowest',
        hanging: false,
      },
    );
  } else {
    Transforms.wrapNodes(editor, defaultListItemBlock(), {
      match: node => Element.isElement(node) && node.type === TYPE_PARAGRAPH,
    });
    Transforms.wrapNodes(editor, defaultListBlock(type), {
      match: node => Element.isElement(node) && node.type === TYPE_LIST_ITEM,
    });
  }
};
