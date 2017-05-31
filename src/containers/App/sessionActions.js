/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createAction } from 'redux-actions';
import auth0 from 'auth0-js';
import createHistory from 'history/createBrowserHistory';
import { getTimeToUpdateInMs } from '../../util/jwtHelper';
import { locationOrigin, auth0ClientId, auth0Domain, getToken, setIdTokenInLocalStorage } from '../../util/authHelpers';

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
  };

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

export function checkValidSession(token = undefined) {
  return (dispatch, getState) => setTimeout(
    () => {
      dispatch(refreshToken(getState)); // eslint-disable-line
    },
    token ? getTimeToUpdateInMs(token) : getTimeToUpdateInMs(getToken(getState)),
  );
}

export const renewAuth = () => new Promise((resolve, reject) => {
  console.log('renew');
  auth.renewAuth({
    redirectUri: `${locationOrigin}/login/silent-callback`,
    usePostMessage: true,
  }, (err, authResult) => {
    console.log(authResult);
    if (process.env.NODE_ENV === 'development' && authResult && (authResult.source === '@devtools-page' || authResult.source === '@devtools-extension' || authResult.source === 'react-devtools-detector')) { // Temporarily fix for bug in auth0
    //   isTokenValid(decodeIdToken(getState().idToken).exp).then((valid) => {
    //     if (valid.isTokenExpired) {
    //       dispatch(logout());
    //       resolve();
    //     }
    //   });
      return;
    }
    if (authResult && authResult.idToken) {
      setIdTokenInLocalStorage(authResult.idToken);
      resolve(authResult.idToken);
    } else {
      createHistory().push('/logoutSession'); // Push to
      reject();
    }
  });
});
