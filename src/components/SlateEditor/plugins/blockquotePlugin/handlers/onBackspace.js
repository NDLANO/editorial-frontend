// import { getCurrentBlockquote } from '../utils';
// import { unwrapBlockquote } from '../changes';

/**
 * User pressed Delete in an editor:
 * Unwrap the blockquote if at the start of the inner block.
 */
function onBackspace(opts, event, editor, next) {
  // seems like this functionality was not doing anything as deleting it changed nothing, as far as ive checked
}

export default onBackspace;
