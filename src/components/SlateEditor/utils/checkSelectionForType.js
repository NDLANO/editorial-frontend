export const checkSelectionForType = ({ type, value, nodeKey }) => {
  const parent = value.document.getParent(nodeKey || value.selection.start.key);

  if (
    !parent ||
    parent.get('type') === 'section' ||
    parent.get('type') === 'document'
  ) {
    return false;
  }
  if (typeof type === 'string') {
    if (parent.get('type') === type) {
      return true;
    }
  } else {
    if (type.includes(parent.get('type'))) {
      return true;
    }
  }
  const { key } = parent;
  return checkSelectionForType({ type, value, nodeKey: key });
};

export default checkSelectionForType;
