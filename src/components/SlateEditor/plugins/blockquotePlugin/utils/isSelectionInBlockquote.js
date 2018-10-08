import getCurrentBlockquote from './getCurrentBlockquote';

/**
 * Is the selection in a blockquote
 */
function isSelectionInBlockquote(opts, value) {
  return Boolean(getCurrentBlockquote(opts, value));
}

export default isSelectionInBlockquote;
