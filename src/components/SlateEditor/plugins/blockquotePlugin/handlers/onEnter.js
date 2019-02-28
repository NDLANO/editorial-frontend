import { getCurrentBlockquote } from '../utils';
import { unwrapBlockquote } from '../changes';

/**
 * User pressed Enter in an editor
 *
 * Enter on an empty block inside a blockquote exit the blockquote.
 */
function onEnter(opts, event, editor, next) {
  const { startBlock } = editor.value;
  if (!getCurrentBlockquote(opts, editor)) {
    return next();
  }

  if (startBlock.text.length !== 0) {
    return next();
  }

  // Block is empty, we exit the blockquote
  event.preventDefault();
  return unwrapBlockquote(opts, editor);
}

export default onEnter;
