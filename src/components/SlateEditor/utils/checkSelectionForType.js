export const checkSelectionForType = (type, value, nodeKey) => {
  const parent = value.document.getParent(nodeKey);

  if (
    !parent ||
    parent.get('type') === 'section' ||
    parent.get('type') === 'document'
  ) {
    return false;
  }
  if (parent.get('type') === type) {
    return true;
  }
  const { key } = parent;
  return checkSelectionForType(type, value, key);
};

export default checkSelectionForType;
