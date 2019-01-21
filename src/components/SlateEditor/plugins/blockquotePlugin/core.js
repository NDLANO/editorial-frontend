// @flow
import Options from './options';
import { isSelectionInBlockquote } from './utils';
import { wrapInBlockquote, unwrapBlockquote } from './changes';

import { schema } from './validation';

/**
 * Bind a change to given options, and scope it to act only inside a blockquote
 */
function bindAndScopeChange(opts, fn) {
  return (editor, ...args) => {
    if (!editor.isSelectionInBlockquote()) {
      return editor;
    }

    // $FlowFixMe
    return fn(...[opts, editor].concat(args));
  };
}

/**
 * The core of the plugin, which does not relies on `slate-react`, and includes
 * everything but behavior and rendering logic.
 */
function core(optsParam) {
  const opts = new Options(optsParam);

  return {
    schema: schema(opts),

    queries: {
      isSelectionInBlockquote: isSelectionInBlockquote.bind(null, opts),
    },

    commands: {
      wrapInBlockquote: wrapInBlockquote.bind(null, opts),
      unwrapBlockquote: bindAndScopeChange(opts, unwrapBlockquote),
    },
  };
}

export default core;
