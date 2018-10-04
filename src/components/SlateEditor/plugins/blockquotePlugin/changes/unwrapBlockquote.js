/**
 * Unwrap from blockquote.
 */
function unwrapBlockquote(opts, change) {
  return change.unwrapBlock(opts.type);
}

export default unwrapBlockquote;
