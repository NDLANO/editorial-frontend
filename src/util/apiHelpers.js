/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import fetch from 'isomorphic-fetch';
import queryString from 'query-string';
import { getAccessToken, isAccessTokenValid, renewAuth } from './authHelpers';

export function apiResourceUrl(path) {
  return window.config.ndlaApiUrl + path;
}

export function brightcoveApiResourceUrl(path) {
  return window.config.brightcoveApiUrl + path;
}

export function googleSearchApiResourceUrl(path) {
  return window.config.googleSearchApiUrl + path;
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
        reject(
          createErrorPayload(
            res.status,
            defined(json.message, res.statusText),
            json,
          ),
        ),
      )
      .catch(reject);
  });
}

export const fetchWithAuthorization = async (url, config = {}, forceAuth) => {
  if (forceAuth || !isAccessTokenValid()) {
    await renewAuth();
  }
  return fetch(url, {
    ...config,
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
};

export const fetchAuthorized = (url, config = {}) =>
  fetchWithAuthorization(url, config, false);

export const fetchReAuthorized = async (url, config = {}) =>
  fetchWithAuthorization(url, config, true);

export const fetchBrightcoveAccessToken = () =>
  fetch('/get_brightcove_token').then(resolveJsonOrRejectWithError);

export const setBrightcoveAccessTokenInLocalStorage = brightcoveAccessToken => {
  localStorage.setItem(
    'brightcove_access_token',
    brightcoveAccessToken.access_token,
  );
  localStorage.setItem(
    'brightcove_access_token_expires_at',
    brightcoveAccessToken.expires_in * 1000 + new Date().getTime(),
  );
};

export const fetchWithBrightCoveToken = (url, config = {}) => {
  const birghtcoveAccessToken = localStorage.getItem('brightcove_access_token');
  const expiresAt = birghtcoveAccessToken
    ? JSON.parse(localStorage.getItem('brightcove_access_token_expires_at'))
    : 0;
  if (new Date().getTime() > expiresAt || !expiresAt) {
    return fetchBrightcoveAccessToken().then(res => {
      setBrightcoveAccessTokenInLocalStorage(res);
      return fetch(url, {
        ...config,
        headers: { Authorization: `Bearer ${res.access_token}` },
      });
    });
  }
  return fetch(url, {
    ...config,
    headers: { Authorization: `Bearer ${birghtcoveAccessToken}` },
  });
};

export const fetchOembed = async (url, options) => {
  const data = await fetchAuthorized(url, options);
  return resolveJsonOrRejectWithError(data);
};

export const setOembedUrl = query =>
  `${apiResourceUrl('/oembed-proxy/v1/oembed')}?${queryString.stringify(
    query,
  )}`;

export const fetchExternalOembed = (url, options) =>
  fetchOembed(setOembedUrl({ url }), options);
