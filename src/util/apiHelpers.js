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


const apiBaseUrl = window.config.ndlaApiUrl;

export { apiBaseUrl };

export function headerWithAccessToken(token) {
  return { Authorization: `Bearer ${token}` };
}

export function apiResourceUrl(path) { return apiBaseUrl + path; }

export function createErrorPayload(status, message, json) {
  return Object.assign(new Error(message), { status, json });
}

export function resolveJsonOrRejectWithError(res) {
  return new Promise((resolve, reject) => {
    if (res.ok) {
      return res.status === 204 ? resolve() : resolve(res.json());
    }
    return res.json()
      .then(json => createErrorPayload(res.status, defined(json.message, res.statusText), json))
      .catch(reject);
  });
}

export const fetchAccessToken = () => fetch('/get_token').then(resolveJsonOrRejectWithError);

export const fetchWithAccessToken = (url, config = {}) => {
  let accessToken = localStorage.getItem('access_token');
  const expiresAt = JSON.parse(localStorage.getItem('access_token_expires_at'));

  if (new Date().getTime() > expiresAt) {
    return fetchAccessToken().then((res) => {
      accessToken = res.access_token;
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('access_token_expires_at', (expiresIn(accessToken) * 1000) + new Date().getTime());
      return fetch(url, { ...config, headers: { Authorization: `Bearer ${accessToken}` } });
    });
  }
  return fetch(url, { ...config, headers: { Authorization: `Bearer ${accessToken}` } });
};
