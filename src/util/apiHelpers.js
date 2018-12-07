/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import queryString from 'query-string';
import config from '../config';
import {
  apiBaseUrl,
  getAccessToken,
  isAccessTokenValid,
  renewAuth,
} from './authHelpers';
import { resolveJsonOrRejectWithError } from './resolveJsonOrRejectWithError';

export function apiResourceUrl(path) {
  return apiBaseUrl + path;
}

export function brightcoveApiResourceUrl(path) {
  return config.brightcoveApiUrl + path;
}

export function googleSearchApiResourceUrl(path) {
  return config.googleSearchApiUrl + path;
}

export const fetchWithAuthorization = async (url, config = {}, forceAuth) => {
  if (forceAuth || !isAccessTokenValid()) {
    await renewAuth();
  }

  const contentType = config.headers
    ? config.headers['Content-Type']
    : 'text/plain';
  const extraHeaders = contentType ? { 'Content-Type': contentType } : {};
  const cacheControl = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
    config.method,
  )
    ? {}
    : { 'Cache-Control': 'no-cache' };

  return fetch(url, {
    ...config,
    headers: {
      ...extraHeaders,
      ...cacheControl,
      Authorization: `Bearer ${getAccessToken()}`,
    },
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
  const brightcoveAccessToken = localStorage.getItem('brightcove_access_token');
  const expiresAt = brightcoveAccessToken
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
    headers: { Authorization: `Bearer ${brightcoveAccessToken}` },
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

export { resolveJsonOrRejectWithError };
