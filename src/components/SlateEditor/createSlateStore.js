/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createStore } from 'redux';

export default () =>
  createStore((state, action) => {
    if (action.type === 'update') {
      return !state;
    }
    return state;
  }, false);
