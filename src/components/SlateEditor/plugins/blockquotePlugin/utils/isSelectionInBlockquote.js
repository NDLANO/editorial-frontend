import getCurrentBlockquote from './getCurrentBlockquote';

/**
 * Is the selection in a blockquote
 */
function isSelectionInBlockquote(opts, editor) {
  return Boolean(getCurrentBlockquote(opts, editor));
}

export default isSelectionInBlockquote;
