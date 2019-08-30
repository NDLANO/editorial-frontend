/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import { schema, renderBlock } from './schema';
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
      'summary',
    ],
    defaultType: opts.defaultType || 'paragraph',
  };

  function onKeyDown(e, editor, next) {
    // Build arguments list
    const { value } = editor;
    const args = [e, value, options, editor, next];
    switch (e.key) {
      case KEY_ENTER:
        return onEnter(...args);
      default:
        return next();
    }
  }

  function onKeyUp(e, editor, next) {
    const { value } = editor;
    const args = [e, value, options, editor, next];
    switch (e.key) {
      case KEY_BACKSPACE:
        return onBackspace(...args);
      default:
        return next();
    }
  }

  return {
    schema,
    onKeyDown,
    onKeyUp,
    renderBlock,
  };
}
