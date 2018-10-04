/**
 * Wrap the block in a new blockquote.
 */
function wrapInBlockquote(opts, change) {
  return change.wrapBlock(opts.type);
}

export default wrapInBlockquote;
