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

const KEY_ENTER = 'Enter';
const KEY_BACKSPACE = 'Backspace';

export default function headingPlugin(opts = {}) {
  const options = {
    types: opts.types || [
      'heading-one',
      'heading-two',
      'heading-three',
      'heading-four',
      'heading-five',
      'heading-six',
    ],
    defaultType: opts.defaultType || 'paragraph',
  };

  function onKeyDown(e, change) {
    // Build arguments list
    const { state } = change; // TODO: Change to 'value' for slate > 0.29
    const args = [e, state, options];
    switch (e.key) {
      case KEY_ENTER:
        return onEnter(...args);
      default:
        return null;
    }
  }

  function onKeyUp(e, change) {
    const { state } = change; // TODO: Change to 'value' for slate > 0.29
    const args = [e, state, options];
    switch (e.key) {
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
