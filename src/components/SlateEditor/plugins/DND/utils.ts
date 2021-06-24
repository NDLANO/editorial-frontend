import { Editor, Element, Node, NodeEntry, Path } from 'slate';

export const getTopNode = (editor: Editor, path: Path): NodeEntry<Node> | null => {
  const node = Editor.node(editor, path);
  if (Element.isElement(node[0]) && node[0].type === 'section') {
    return node;
  }
  const parent = Editor.node(editor, Path.parent(path));
  if (!parent) {
    return null;
  }
  if (Element.isElement(parent[0]) && parent[0].type === 'section' && Element.isElement(node[0])) {
    return node;
  }
  return getTopNode(editor, parent[1]);
};
