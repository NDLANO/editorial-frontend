import Options from './options';
import { onKeyDown } from './handlers';
import core from './core';

/**
 * A Slate plugin to handle keyboard events in lists.
 */

function blockquotePlugin(opts) {
  const options = new Options(opts);

  const corePlugin = core(options);

  return {
    ...corePlugin,
    onKeyDown: onKeyDown.bind(null, options),
  };
}

export default blockquotePlugin;
