/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import { onEnter } from './actions';

const KEY_ENTER = 'Enter';

export default function paragraphPlugin() {
  function onKeyDown(e, editor, next) {
    switch (e.key) {
      case KEY_ENTER:
        return onEnter(e, editor, next);
      default:
        return next();
    }
  }

  return {
    schema: {},
    onKeyDown,
  };
}
