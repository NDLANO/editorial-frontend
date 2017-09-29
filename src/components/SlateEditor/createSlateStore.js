/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createStore } from 'redux';
import { createAction } from 'redux-actions';

export const setActiveNode = createAction('SET_ACTIVE_NODE');
export const setSubmitted = createAction('SET_SUBMITTED');

export default () =>
  createStore(
    (state, action) => {
      if (action.type === setSubmitted.toString()) {
        return { ...state, submitted: action.payload };
      }
      if (action.type === setActiveNode.toString()) {
        return { ...state, activeNode: action.payload };
      }
      return state;
    },
    {
      submitted: false,
      activeNode: undefined,
    },
  );
