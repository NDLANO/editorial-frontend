/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import fetch from 'isomorphic-fetch';
import { expiresIn } from './jwtHelper';
import { renewAuth, isIdTokenValid, getIdToken } from './authHelpers';

export function headerWithToken(token) {
  return { Authorization: `Bearer ${token}` };
}

export function apiResourceUrl(path) {
  return window.config.ndlaApiUrl + path;
}

export function createErrorPayload(status, message, json) {
  return Object.assign(new Error(message), { status, json });
}

export function resolveJsonOrRejectWithError(res) {
  return new Promise((resolve, reject) => {
    if (res.ok) {
      return res.status === 204 ? resolve() : resolve(res.json());
    }
    return res
      .json()
      .then(json =>
        createErrorPayload(
          res.status,
          defined(json.message, res.statusText),
          json,
        ),
      )
      .catch(reject);
  });
}

export const fetchAccessToken = () =>
  fetch('/get_token').then(resolveJsonOrRejectWithError);

export const setAccessTokenInLocalStorage = accessToken => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem(
    'access_token_expires_at',
    expiresIn(accessToken) * 1000 + new Date().getTime(),
  );
};

export const fetchWithAccessToken = (url, config = {}) => {
  const accessToken = localStorage.getItem('access_token');
  const expiresAt = accessToken
    ? JSON.parse(localStorage.getItem('access_token_expires_at'))
    : 0;

  if (new Date().getTime() > expiresAt) {
    return fetchAccessToken().then(res => {
      setAccessTokenInLocalStorage(res.access_token);
      return fetch(url, {
        ...config,
        headers: { Authorization: `Bearer ${res.access_token}` },
      });
    });
  }
  return fetch(url, {
    ...config,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export const fetchAuthorized = (url, config = {}) => {
  if (!isIdTokenValid()) {
    return renewAuth().then(idToken =>
      fetch(url, { ...config, headers: headerWithToken(idToken) }),
    );
  }
  const idToken = getIdToken();
  return fetch(url, { ...config, headers: headerWithToken(idToken) });
};
