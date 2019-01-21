/**
 * Return the current blockquote, from current selection or from a node.
 */
function getCurrentBlockquote(opts, editor, block) {
  const { document, selection, startBlock } = editor.value;
  let currentBlock = block;

  if (!block) {
    if (!selection.start.key) return null;
    currentBlock = startBlock;
  }

  const parent = document.getParent(currentBlock.key);

  return parent && parent.type === opts.type ? parent : null;
}

export default getCurrentBlockquote;
