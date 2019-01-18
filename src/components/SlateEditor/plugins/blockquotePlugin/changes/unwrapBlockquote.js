/**
 * Unwrap from blockquote.
 */
function unwrapBlockquote(opts, editor) {
  return editor.unwrapBlock(opts.type);
}

export default unwrapBlockquote;
