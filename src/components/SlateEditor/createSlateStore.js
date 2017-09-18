/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createStore } from 'redux';
import { createAction } from 'redux-actions';

export const setFootnote = createAction('SET_FOOTNOTE');
export const setSubmitted = createAction('SET_SUBMITTED');

export default () =>
  createStore(
    (state, action) => {
      if (action.type === setSubmitted.toString()) {
        return { ...state, submitted: action.payload };
      }
      if (action.type === setFootnote.toString()) {
        return { ...state, selectedFootnote: action.payload };
      }
      return state;
    },
    {
      submitted: false,
      selectedFootnote: undefined,
    },
  );
