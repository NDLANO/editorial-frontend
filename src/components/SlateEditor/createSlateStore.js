/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createStore } from 'redux';

export default () =>
  createStore(
    (state, action) => {
      if (action.type === 'SET_SUBMITTED') {
        return { ...state, submitted: action.payload };
      }
      if (action.type === 'SET_FOOTNOTE') {
        return { ...state, selectedFootnote: action.payload };
      }
      return state;
    },
    {
      submitted: false,
      selectedFootnote: undefined,
    },
  );
