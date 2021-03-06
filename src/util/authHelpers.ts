/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import auth0 from 'auth0-js';
import config from '../config';
import { expiresIn, ndlaId, ndlaUserName, ndlaUserEmail } from './jwtHelper';
import * as messageActions from '../containers/Messages/messagesActions';

const client =
  process.env.NODE_ENV !== 'unittest'
    ? require('../client.tsx')
    : {
        store: {
          dispatch: () => {},
        },
      };

const NDLA_API_URL = config.ndlaApiUrl;
const AUTH0_DOMAIN = config.auth0Domain;
const NDLA_PERSONAL_CLIENT_ID = config.ndlaPersonalClientId;

const locationOrigin = (() => {
  if (process.env.NODE_ENV === 'unittest') {
    return 'http://ndla-frontend';
  }

  if (process.env.BUILD_TARGET === 'server') {
    return '';
  }
  if (typeof window === 'undefined') {
    return '';
  }
  if (typeof window.location.origin === 'undefined') {
    const oldLoc = window.location;
    window.location = {
      ...oldLoc,
      origin: [
        window.location.protocol,
        '//',
        window.location.host,
        ':',
        window.location.port,
      ].join(''),
    };
  }

  return window.location.origin;
})();

export const auth0Domain = (() => {
  if (process.env.NODE_ENV === 'unittest') {
    return 'http://auth-ndla';
  }
  return AUTH0_DOMAIN;
})();

export const ndlaPersonalClientId = (() => {
  if (process.env.NODE_ENV === 'unittest') {
    return '123456789';
  }
  return NDLA_PERSONAL_CLIENT_ID;
})();

const apiBaseUrl = (() => {
  if (process.env.NODE_ENV === 'unittest') {
    return 'http://ndla-api';
  }

  return defined(NDLA_API_URL, locationOrigin);
})();

export { locationOrigin, apiBaseUrl };

const auth = new auth0.WebAuth({
  clientID: ndlaPersonalClientId ?? '',
  domain: auth0Domain || '',
  responseType: 'token',
  redirectUri: `${locationOrigin}/login/success`,
  audience: 'ndla_system',
});

export function parseHash(hash: string): Promise<any> {
  return new Promise((resolve, reject) => {
    auth.parseHash(
      {
        hash,
        _idTokenVerification: false,
      },
      (err: any, authResult: any) => {
        if (!err) {
          resolve(authResult);
        } else {
          reject(err);
        }
      },
    );
  });
}

export function setAccessTokenInLocalStorage(accessToken: string, personal: boolean) {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem(
    'access_token_expires_at',
    (expiresIn(accessToken) * 1000 + new Date().getTime()).toString(),
  );
  localStorage.setItem('access_token_personal', personal.toString());
}

export const clearAccessTokenFromLocalStorage = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('access_token_expires_at');
  localStorage.removeItem('access_token_personal');
};

export const getAccessTokenPersonal = () =>
  localStorage.getItem('access_token_personal') === 'true';

export const getAccessTokenExpiresAt = () => {
  const expiresAt = localStorage.getItem('access_token_expires_at');
  return expiresAt ? JSON.parse(expiresAt) : 0;
};

export const getAccessToken = () => localStorage.getItem('access_token');

export const getNdlaId = () => ndlaId(getAccessToken());
export const getNdlaUserName = () => ndlaUserName(getAccessToken());
export const getNdlaUserEmail = () => ndlaUserEmail(getAccessToken());

export const isAccessTokenValid = () => new Date().getTime() < getAccessTokenExpiresAt() - 10000; // 10000ms is 10 seconds

export const renewPersonalAuth = () =>
  new Promise((resolve, reject) => {
    auth.checkSession(
      {
        scope: 'openid profile email',
      },
      (err, authResult) => {
        if (authResult && authResult.accessToken) {
          setAccessTokenInLocalStorage(authResult.accessToken, true);
          resolve(authResult.accessToken);
        } else {
          client.store.dispatch(
            messageActions.addAuth0Message({
              translationKey: 'errorMessage.auth0',
              translationObject: {
                message: err?.errorDescription || err?.error_description,
              },
              timeToLive: 0,
            }),
          );
          reject();
        }
      },
    );
  });

export const renewAuth = async () => {
  if (localStorage.getItem('access_token_personal') === 'true') {
    return renewPersonalAuth();
  }
};

let tokenRenewalTimeout: ReturnType<typeof setTimeout>;

const scheduleRenewal = async () => {
  if (localStorage.getItem('access_token_personal') !== 'true') {
    return null;
  }
  const expiresAt = getAccessTokenExpiresAt();

  const timeout = expiresAt - Date.now();

  if (timeout > 0) {
    tokenRenewalTimeout = setTimeout(async () => {
      await renewAuth();
      scheduleRenewal();
    }, timeout);
  } else {
    await renewAuth();
    scheduleRenewal();
  }
};

scheduleRenewal();

export function loginPersonalAccessToken(type: string) {
  const connection = config.usernamePasswordEnabled ? undefined : type;
  auth.authorize({
    connection,
    state: localStorage.getItem('lastPath') ?? undefined,
    prompt: 'login', // Tells auth0 to always show account selection screen on authorize.
  });
}

export const personalAuthLogout = (federated: boolean, returnToLogin: boolean) => {
  clearTimeout(tokenRenewalTimeout);

  const options = {
    returnTo: returnToLogin ? `${locationOrigin}/login` : `${locationOrigin}`,
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
