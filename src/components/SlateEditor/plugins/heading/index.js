/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import schema from './schema';
import { onEnter, onBackspace } from './actions';

const KEY_ENTER = 'enter';
const KEY_BACKSPACE = 'backspace';

export default function headingPlugin(opts = {}) {
  const options = {
    types: opts.types || [
      'heading-one',
      'heading-two',
      'heading-three',
      'heading-four',
      'heading-five',
      'heading-six',
      'summary',
    ],
    defaultType: opts.defaultType || 'paragraph',
  };

  function onKeyDown(e, data, change) {
    // Build arguments list
    const args = [e, data, change, options];
    switch (data.key) {
      case KEY_ENTER:
        return onEnter(...args);
      default:
        return null;
    }
  }

  function onKeyUp(e, data, change) {
    const args = [e, data, change, options];
    switch (data.key) {
      case KEY_BACKSPACE:
        return onBackspace(...args);
      default:
        return null;
    }
  }

  return {
    onKeyDown,
    onKeyUp,
    schema,
  };
}
