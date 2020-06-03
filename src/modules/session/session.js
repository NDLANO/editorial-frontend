/**
 * Copyright (c) 2017-present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { handleActions, createAction } from 'redux-actions';
import { getAccessToken, getAccessTokenPersonal } from '../../util/authHelpers';
import { decodeToken, isValid } from '../../util/jwtHelper';

export const setAuthenticated = createAction('SET_AUTHENTICATED');
export const setUserData = createAction('SET_USER_DATA');
export const setUserNotRegistered = createAction('SET_USER_NOT_REGISTERED');
export const clearUserData = createAction('CLEAR_USER_DATA');
export const loginSuccess = createAction('LOGIN_SUCCESS');
export const logout = createAction('LOGOUT');

export const actions = {
  setAuthenticated,
  setUserData,
  setUserNotRegistered,
  clearUserData,
  loginSuccess,
  logout,
};

const initialState = {
  user: {},
  authenticated: false,
  userNotRegistered: true,
};

export const getSessionStateFromLocalStorage = () => {
  const token = getAccessToken();
  const isAccessTokenPersonal = getAccessTokenPersonal();
  if (isValid(token) && isAccessTokenPersonal) {
    const decodedToken = decodeToken(token);
    return {
      user: {
        name: decodedToken['https://ndla.no/user_name'],
        scope: decodedToken.scope,
      },
      authenticated: true,
      userNotRegistered: false,
    };
  }
  return initialState; // Return inital state if token is undefined
};

export default handleActions(
  {
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
    [actions.setUserNotRegistered]: {
      next: (state, action) => ({
        ...state,
        userNotRegistered: action.payload,
      }),
      throw: state => state,
    },
  },
  initialState,
);
