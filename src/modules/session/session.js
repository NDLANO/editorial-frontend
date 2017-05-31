/**
 * Copyright (c) 2017-present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { handleActions } from 'redux-actions';
import * as actions from './sessionActions';
import { getIdToken } from '../../util/authHelpers';
import { decodeToken } from '../../util/jwtHelper';


const initialState = {
  user: {},
  authenticated: false,
};

export const getSessionStateFromLocalStorage = () => {
  const token = getIdToken();
  if (token) {
    return {
      user: decodeToken(token),
      authenticated: true,
    };
  }
  return initialState; // Return inital state if token is undefined
};

export default handleActions({
  [actions.setUserData]: {
    next: (state, action) => ({ ...state, user: action.payload }),
    throw: state => state,
  },
  [actions.clearUserData]: {
    next: state => ({ ...state, user: {} }),
    throw: state => state,
  },
  [actions.setAuthenticated]: {
    next: (state, action) => ({ ...state, authenticated: action.payload }),
    throw: state => state,
  },
}, initialState);
