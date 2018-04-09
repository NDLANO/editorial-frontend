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
import { expiresIn } from './jwtHelper';
import { resolveJsonOrRejectWithError } from './apiHelpers';

export const { auth0Domain, ndlaPersonalClientId } = window.config;

const locationOrigin = (() => {
  if (process.env.NODE_ENV === 'unittest') {
    return 'http://ndla-frontend';
  }

  if (typeof window.location.origin === 'undefined') {
    window.location.origin = [
      window.location.protocol,
      '//',
      window.location.host,
      ':',
      window.location.port,
    ].join('');
  }

  return window.location.origin;
})();

export { locationOrigin };

const auth = new auth0.WebAuth({
  clientID: ndlaPersonalClientId || '',
  domain: auth0Domain || '',
  responseType: 'token',
  redirectUri: `${locationOrigin}/login/success`,
  audience: 'ndla_system',
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

export function setAccessTokenInLocalStorage(accessToken, personal) {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem(
    'access_token_expires_at',
    expiresIn(accessToken) * 1000 + new Date().getTime(),
  );
  localStorage.setItem('access_token_personal', personal);
}

export const clearAccessTokenFromLocalStorage = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('access_token_expires_at');
  localStorage.removeItem('access_token_personal');
};

export const getAccessTokenExpiresAt = () =>
  localStorage.getItem('access_token_expires_at')
    ? JSON.parse(localStorage.getItem('access_token_expires_at'))
    : 0;

export const getAccessToken = () => localStorage.getItem('access_token');

export const isAccessTokenValid = () => new Date().getTime() < getAccessTokenExpiresAt() - 10000 // 10000ms is 10 seconds

export const fetchSystemAccessToken = () =>
  fetch(`${locationOrigin}/get_token`).then(resolveJsonOrRejectWithError);

export const renewSystemAuth = () =>
  fetchSystemAccessToken().then(res => {
    setAccessTokenInLocalStorage(res.access_token, false);
  });

export function loginPersonalAccessToken(type) {
  auth.authorize({
    connection: type,
    clientID: ndlaPersonalClientId,
  });
}

export const renewPersonalAuth = () =>
  new Promise((resolve, reject) => {
    auth.renewAuth(
      {
        redirectUri: `${locationOrigin}/login/silent-callback`,
        usePostMessage: true,
      },
      (err, authResult) => {
        if (authResult && authResult.accessToken) {
          setAccessTokenInLocalStorage(authResult.accessToken, true);
          resolve(authResult.accessToken);
        } else {
          createHistory().push('/logout/session'); // Push to logoutPath
          window.location.reload(); // Need to reload to logout
          reject();
        }
      },
    );
  });

export const renewAuth = () => {
  if (localStorage.getItem('access_token_personal') === 'true') {
    renewPersonalAuth();
  } else {
    renewSystemAuth();
  }
};

export const personalAuthLogout = federated => {
  const options = {
    returnTo: `${locationOrigin}`,
    clientID: ndlaPersonalClientId,
  };

  if (federated) {
    return auth.logout({
      ...options,
      federated, // N.B. federated is parsed  as a flag by auth0. So you are logged out federated even if it is false
    });
  }

  return auth.logout(options);
};
