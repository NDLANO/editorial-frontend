import { Editor, Element, Path } from 'slate';
import { TYPE_LIST } from '..';

export const getListItemType = (editor: Editor, path: Path) => {
  const [parentNode] = Editor.node(editor, Path.parent(path));

  if (Element.isElement(parentNode) && parentNode.type === TYPE_LIST) {
    return parentNode.listType;
  }
  return 'numbered-list';
};
