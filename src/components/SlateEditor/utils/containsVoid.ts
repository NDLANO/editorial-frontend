import { Editor, Node } from 'slate';

const containsVoid = (editor: Editor, node: Node) => {
  const nodes = Node.elements(node);

  for (let entry of nodes) {
    const [child] = entry;
    if (!child) break;
    if (editor.isVoid(child)) {
      return true;
    }
  }
  return false;
};

export default containsVoid;
