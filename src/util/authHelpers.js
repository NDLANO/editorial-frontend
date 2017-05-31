/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'isomorphic-fetch';
import auth0 from 'auth0-js';
import createHistory from 'history/createBrowserHistory';
import { toLogoutSession } from '../routes';
import { expiresIn } from './jwtHelper';

export const auth0Domain = window.config.auth0Domain;
export const auth0ClientId = window.config.auth0ClientID;


const locationOrigin = (() => {
  if (process.env.NODE_ENV === 'unittest') {
    return 'http://ndla-frontend';
  }

  if (typeof location.origin === 'undefined') {
    location.origin = [location.protocol, '//', location.host, ':', location.port].join('');
  }

  return location.origin;
})();

export { locationOrigin };

export const setIdTokenInLocalStorage = (idToken) => {
  localStorage.setItem('id_token', idToken);
  localStorage.setItem('id_token_expires_at', (expiresIn(idToken) * 1000) + new Date().getTime());
};

export const clearIdTokenFromLocalStorage = () => {
  localStorage.removeItem('id_token');
  localStorage.removeItem('id_token_expires_at');
};

export const getExpiresAt = () => JSON.parse(localStorage.getItem('id_token_expires_at'));

export const getIdToken = () => localStorage.getItem('id_token');

export const isIdTokenValid = () => new Date().getTime() < getExpiresAt();

const auth = new auth0.WebAuth({
  clientID: auth0ClientId || '',
  domain: auth0Domain || '',
  responseType: 'token id_token',
  redirectUri: `${locationOrigin}/login/success`,
  scope: 'openid app_metadata name',
});

export function parseHash(hash) {
  return new Promise((resolve, reject) => {
    auth.parseHash({ hash, _idTokenVerification: false }, (err, authResult) => {
      if (!err) {
        resolve(authResult);
      } else {
        reject(err);
      }
    });
  });
}

export const authLogout = (federated) => {
  const config = {
    returnTo: `${locationOrigin}/`,
    client_id: auth0ClientId,
  };

  if (federated) {
    return auth.logout({
      ...config,
      federated, // N.B. federated is parsed  as a flag by auth0. So you are logged out federated even if it is false
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

export const renewAuth = () => new Promise((resolve, reject) => {
  auth.renewAuth({
    redirectUri: `${locationOrigin}/login/silent-callback`,
    usePostMessage: true,
  }, (err, authResult) => {
    if (authResult && (authResult.source === '@devtools-page' || authResult.source === '@devtools-extension' || authResult.source === 'react-devtools-detector')) { // Temporarily fix for bug in auth0
      if (!isIdTokenValid()) {
        createHistory().push(toLogoutSession()); // Push to logoutPath
        return;
      }
    }

    if (authResult && authResult.idToken) {
      setIdTokenInLocalStorage(authResult.idToken);
      resolve(authResult.idToken);
    } else {
      createHistory().push(toLogoutSession()); // Push to logoutPath
      reject();
    }
  });
});
