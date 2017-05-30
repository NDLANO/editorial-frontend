/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createAction } from 'redux-actions';
import auth0 from 'auth0-js';
import { applicationError } from '../../containers/Messages/messagesActions';
import { fetchNewToken, isTokenValid } from '../../util/tokens';
import { decodeIdToken, getTimeToUpdateInMs } from '../../util/jwtHelper';
import { locationOrigin, auth0ClientId, auth0Domain, getToken } from '../../util/authHelpers';

export const setAuthenticated = createAction('SET_AUTHENTICATED');
export const setUserData = createAction('SET_USER_DATA');
export const clearUserData = createAction('CLEAR_USER_DATA');
export const loginSuccess = createAction('LOGIN_SUCCESS');
export const logout = createAction('LOGOUT');


export const auth = new auth0.WebAuth({
  clientID: auth0ClientId || '',
  domain: auth0Domain || '',
  responseType: 'token id_token',
  redirectUri: `${locationOrigin}/login/success`,
  scope: 'openid app_metadata name',
});

export const authLogout = (federated) => {
  const config = {
    returnTo: `${locationOrigin}/`,
    client_id: auth0ClientId,
  }
  if (federated) {
    return auth.logout({
      ...config,
      federated,
    });
  }
  return auth.logout({ config });
};


export function loginSocialMedia(type) {
  auth.authorize({
    connection: type,
    client_id: auth0ClientId,
  });
}


export function logoutFederated() {
  return doLogout(true);
}


export function checkValidSession(token = undefined) {
  return (dispatch, getState) => setTimeout(
    () => {
      dispatch(refreshToken(getState)); // eslint-disable-line
    },
    token ? getTimeToUpdateInMs(token) : getTimeToUpdateInMs(getToken(getState)),
  );
}

export function renewAuth0Token() {
  return (dispatch, getState) => new Promise((resolve) => {
    auth.renewAuth({
      redirectUri: `${locationOrigin}/login/silent-callback`,
      usePostMessage: true,
    }, (err, authResult) => {
      if (process.env.NODE_ENV === 'development' && authResult && (authResult.source === '@devtools-page' || authResult.source === '@devtools-extension')) { // Temporarily fix for bug in auth0
        isTokenValid(decodeIdToken(getState().idToken).exp).then((valid) => {
          if (valid.isTokenExpired) {
            dispatch(logout());
            resolve();
          }
        });
        return;
      }
      if (authResult && authResult.idToken) {
        dispatch(setIdToken(authResult.idToken));
        dispatch(setAuthenticated(true));
        dispatch(setUserData(decodeIdToken(authResult.idToken)));
        resolve();
      } else {
        dispatch(logout());
        resolve();
      }
    });
  });
}


export function refreshToken() {
  return (dispatch, getState) => new Promise((resolve) => {
    if (getState().authenticated) {
      dispatch(renewAuth0Token()).then(() => resolve());
    }
  });
}
