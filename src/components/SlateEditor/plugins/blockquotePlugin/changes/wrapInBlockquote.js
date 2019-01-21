/**
 * Wrap the block in a new blockquote.
 */
function wrapInBlockquote(opts, editor) {
  return editor.wrapBlock(opts.type);
}

export default wrapInBlockquote;
