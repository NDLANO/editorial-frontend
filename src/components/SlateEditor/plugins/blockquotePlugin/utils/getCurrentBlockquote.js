/**
 * Return the current blockquote, from current selection or from a node.
 */
function getCurrentBlockquote(opts, value, block) {
  const { document } = value;
  let currentBlock = block;

  if (!block) {
    if (!value.selection.start.key) return null;
    currentBlock = value.startBlock;
  }

  const parent = document.getParent(currentBlock.key);

  return parent && parent.type === opts.type ? parent : null;
}

export default getCurrentBlockquote;
