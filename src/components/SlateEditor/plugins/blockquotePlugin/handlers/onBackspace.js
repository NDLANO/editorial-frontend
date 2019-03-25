import { getCurrentBlockquote } from '../utils';
import { unwrapBlockquote } from '../changes';

/**
 * User pressed Delete in an editor:
 * Unwrap the blockquote if at the start of the inner block.
 */
function onBackspace(opts, event, editor, next) {
  const { value } = editor;
  const { start, isCollapsed } = value.selection;

  if (!getCurrentBlockquote(opts, editor) || !isCollapsed) {
    return next();
  }

  if (start.offset !== 0) {
    return next();
  }

  // Block is empty, we exit the blockquote
  event.preventDefault();

  return unwrapBlockquote(opts, editor);
}

export default onBackspace;
