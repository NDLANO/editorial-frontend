import { Editor, Element } from 'slate';
import { TYPE_LIST_ITEM } from '..';
import { getListItemType } from './getListItemType';
import { isListItemPathSelected } from './isListItemSelected';

const hasListItemOfType = (editor: Editor, type: string) => {
  // For all selected list elements
  for (const [, path] of Editor.nodes(editor, {
    match: node => Element.isElement(node) && node.type === TYPE_LIST_ITEM,
  })) {
    const itemListType = getListItemType(editor, path);

    if (itemListType === type && isListItemPathSelected(editor, path)) {
      return true;
    }
  }
  return false;
};

export default hasListItemOfType;
