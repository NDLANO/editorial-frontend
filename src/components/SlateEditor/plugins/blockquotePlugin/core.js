// @flow
import Options from './options';
import { isSelectionInBlockquote } from './utils';
import { wrapInBlockquote, unwrapBlockquote } from './changes';

import { schema } from './validation';

/**
 * Bind a change to given options, and scope it to act only inside a blockquote
 */
function bindAndScopeChange(opts, fn) {
  return (change, ...args) => {
    const { value } = change;

    if (!isSelectionInBlockquote(opts, value)) {
      return change;
    }

    // $FlowFixMe
    return fn(...[opts, change].concat(args));
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

    utils: {
      isSelectionInBlockquote: isSelectionInBlockquote.bind(null, opts),
    },

    changes: {
      wrapInBlockquote: wrapInBlockquote.bind(null, opts),
      unwrapBlockquote: bindAndScopeChange(opts, unwrapBlockquote),
    },
  };
}

export default core;
