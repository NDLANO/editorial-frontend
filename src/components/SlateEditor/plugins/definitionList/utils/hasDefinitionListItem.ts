import { Editor, Element } from 'slate';
import { TYPE_DEFINTION_DESCRIPTION, TYPE_DEFINTION_TERM } from '../types';
import { isDefinitionListItem } from './isDefinitionListItem';

const hasListItem = (editor: Editor, type?: string) => {
  // For all selected list elements
  for (const [, path] of Editor.nodes(editor, {
    match: node =>
      Element.isElement(node) &&
      (node.type === TYPE_DEFINTION_DESCRIPTION || node.type === TYPE_DEFINTION_TERM),
  })) {
    if (isDefinitionListItem(editor, path)) {
      return true;
    }

    return false;
  }
};

export default hasListItem;
