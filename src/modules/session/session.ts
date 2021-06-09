/**
 * Copyright (c) 2017-present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { handleActions, createAction, Action } from 'redux-actions';
import { getAccessToken, getAccessTokenPersonal } from '../../util/authHelpers';
import { decodeToken, isValid } from '../../util/jwtHelper';

export const setAuthenticated = createAction<boolean>('SET_AUTHENTICATED');
export const setUserData = createAction('SET_USER_DATA');
export const setUserNotRegistered = createAction<boolean>('SET_USER_NOT_REGISTERED');
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

export interface ReduxSessionState {
  user: {
    name?: string;
    scope?: string;
  };
  authenticated: boolean;
  userNotRegistered: boolean;
}

const initialState: ReduxSessionState = {
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
        name: decodedToken?.['https://ndla.no/user_name'],
        scope: decodedToken?.scope,
      },
      authenticated: true,
      userNotRegistered: false,
    };
  }
  return initialState; // Return initial state if token is undefined
};

export default handleActions(
  {
    SET_USER_DATA: {
      next: (state: ReduxSessionState, action: Action<any>) => ({ ...state, user: action.payload }),
      throw: state => state,
    },
    CLEAR_USER_DATA: {
      next: (state: ReduxSessionState) => ({ ...state, user: {} }),
      throw: state => state,
    },
    SET_AUTHENTICATED: {
      next: (state: ReduxSessionState, action: Action<boolean>) => ({
        ...state,
        authenticated: action.payload,
      }),
      throw: state => state,
    },
    SET_USER_NOT_REGISTERED: {
      next: (state, action) => ({
        ...state,
        userNotRegistered: action.payload,
      }),
      throw: state => state,
    },
  },
  initialState,
);
