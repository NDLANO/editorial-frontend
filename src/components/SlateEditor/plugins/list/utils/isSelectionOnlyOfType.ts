import { Editor, Element } from 'slate';
import { LIST_TYPES, TYPE_LIST, TYPE_LIST_ITEM } from '..';
import { isListItemSelected } from './isListItemSelected';

export const isSelectionOnlyOfType = (editor: Editor, type: string) => {
  const otherTypes = LIST_TYPES.filter(t => t !== type);

  let hasListItems = false;
  // For all selected list elements
  for (const [, path] of Editor.nodes(editor, {
    match: node =>
      Element.isElement(node) && node.type === TYPE_LIST_ITEM && isListItemSelected(editor, node),
  })) {
    const [parentNode] = Editor.parent(editor, path);
    if (Element.isElement(parentNode) && parentNode.type === TYPE_LIST) {
      if (otherTypes.includes(parentNode.listType)) {
        return false;
      } else if (parentNode.listType === type) {
        hasListItems = true;
        continue;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  return hasListItems;
};
