export const getTopNode = (node, editor) => {
  const parent = editor.value.document.getParent(node.key);
  if (!parent) {
    return null;
  }
  if (parent.type === 'section') {
    return node;
  }
  return getTopNode(parent, editor);
};
