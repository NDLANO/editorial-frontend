import { Editor, Element, Node, Range } from 'slate';
import { ReactEditor } from 'slate-react';
import { ListElement, ListItemElement, LIST_TYPES, TYPE_LIST, TYPE_LIST_ITEM } from '..';

export const isListItemSelected = (editor: Editor, node: ListItemElement) => {
  if (!Range.isRange(editor.selection)) return false;

  if (Range.includes(editor.selection, [...ReactEditor.findPath(editor, node), 0, 0])) {
    return true;
  }

  return false;
};

const isListSelected = (editor: Editor, node: ListElement) => {
  if (!Range.isRange(editor.selection)) return;
  for (const [child] of Editor.nodes(editor, {
    at: ReactEditor.findPath(editor, node),
  })) {
    if (Element.isElement(child) && child.type === TYPE_LIST_ITEM) {
      if (isListItemSelected(editor, child)) {
        return true;
      }
    }
  }
  return false;
};

const isEntireListSelected = (editor: Editor, node: ListElement) => {
  if (!Range.isRange(editor.selection)) return;
  for (const [child, path] of Editor.nodes(editor, {
    at: ReactEditor.findPath(editor, node),
  })) {
    if (Element.isElement(child) && child.type === TYPE_LIST_ITEM) {
      if (isListItemSelected(editor, child)) {
        continue;
      } else {
        return false;
      }
    }
  }
  return true;
};

export const isSelectionOnlyOfType = (editor: Editor, type: string) => {
  const otherTypes = LIST_TYPES.filter(t => t !== type);

  // For all selected list elements
  for (const [node, path] of Editor.nodes(editor, {
    match: node =>
      Element.isElement(node) && node.type === TYPE_LIST_ITEM && isListItemSelected(editor, node),
  })) {
    const [parentNode, parentPath] = Editor.parent(editor, path);
    if (Element.isElement(parentNode) && parentNode.type === TYPE_LIST) {
      if (otherTypes.includes(parentNode.listType)) {
        return false;
      } else if (parentNode.listType === type) {
        continue;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  return true;
};
