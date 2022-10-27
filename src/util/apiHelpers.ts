/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import fetch from 'cross-fetch';
import queryString from 'query-string';
import { BrightcoveAccessToken, H5POembed } from '../interfaces';
import config from '../config';
import { apiBaseUrl, getAccessToken, isAccessTokenValid, renewAuth } from './authHelpers';
import { resolveJsonOrRejectWithError, throwErrorPayload } from './resolveJsonOrRejectWithError';

export interface HttpHeadersType {
  'Content-Type': string;
  Authorization: string;
  VersionHash: string;
}

export interface FetchConfigType {
  method?: 'POST' | 'PUT' | 'DELETE' | 'GET' | 'PATCH';
  headers?: Partial<HttpHeadersType>;
  body?: any;
}

export function apiResourceUrl(path: string) {
  return apiBaseUrl + path;
}

export function grepUrl(path = '') {
  return `${apiResourceUrl('/grep/kl06/v201906')}${path}`;
}

export function brightcoveApiResourceUrl(path: string) {
  return config.brightcoveApiUrl + path;
}

export function googleSearchApiResourceUrl(path: string) {
  return config.googleSearchApiUrl + path;
}

export const fetchWithAuthorization = async (
  url: string,
  config: FetchConfigType = {},
  forceAuth: boolean,
) => {
  if (forceAuth || !isAccessTokenValid()) {
    await renewAuth();
  }

  const contentType = config.headers ? config.headers['Content-Type'] : 'text/plain';
  const extraHeaders = contentType ? { 'Content-Type': contentType } : null;
  const cacheControl = { 'Cache-Control': 'no-cache' };
  const headers: HeadersInit = {
    ...extraHeaders,
    ...cacheControl,
    VersionHash: config.headers?.VersionHash ?? 'default',
    Authorization: `Bearer ${getAccessToken()}`,
  };

  return fetch(url, {
    ...config,
    headers,
  });
};

const defaultHeaders = { 'Content-Type': 'application/json' };

interface DoAndResolveType<Type> extends FetchConfigType {
  url: string;
  alternateResolve?: (res: Response) => Promise<Type>;
  taxonomyVersion?: string;
}

interface HttpConfig<T> extends Omit<DoAndResolveType<T>, 'method'> {}

interface FetchConfig<T> extends HttpConfig<T> {
  queryParams?: Record<string, any>;
}

const httpResolve = <Type>({
  url,
  headers,
  alternateResolve,
  taxonomyVersion,
  ...config
}: DoAndResolveType<Type>): Promise<Type> => {
  return fetchAuthorized(url, {
    ...config,
    headers: { ...defaultHeaders, VersionHash: taxonomyVersion, ...headers },
  }).then(r => {
    return alternateResolve?.(r) ?? resolveJsonOrRejectWithError(r);
  });
};

export const stringifyQuery = (object: Record<string, any> = {}) => {
  const stringified = `?${queryString.stringify(object)}`;
  return stringified === '?' ? '' : stringified;
};

export const httpFunctions = {
  postAndResolve: <T>(conf: HttpConfig<T>) => httpResolve<T>({ ...conf, method: 'POST' }),
  putAndResolve: <T>(conf: HttpConfig<T>) => httpResolve<T>({ ...conf, method: 'PUT' }),
  patchAndResolve: <T>(conf: HttpConfig<T>) => httpResolve<T>({ ...conf, method: 'PATCH' }),
  deleteAndResolve: <T>(conf: HttpConfig<T>) => httpResolve<T>({ ...conf, method: 'DELETE' }),
  fetchAndResolve: <T>(conf: FetchConfig<T>) =>
    httpResolve<T>({
      ...conf,
      method: 'GET',
      url: `${conf.url}${stringifyQuery(conf.queryParams)}`,
    }),
};

export const fetchAuthorized = (url: string, config: FetchConfigType = {}) =>
  fetchWithAuthorization(url, config, false);

export const fetchReAuthorized = async (url: string, config: FetchConfigType = {}) =>
  fetchWithAuthorization(url, config, true);

export const fetchBrightcoveAccessToken = () =>
  fetch('/get_brightcove_token').then(r => resolveJsonOrRejectWithError<BrightcoveAccessToken>(r));

export const setBrightcoveAccessTokenInLocalStorage = (
  brightcoveAccessToken: BrightcoveAccessToken,
) => {
  localStorage.setItem('brightcove_access_token', brightcoveAccessToken.access_token);
  localStorage.setItem(
    'brightcove_access_token_expires_at',
    (brightcoveAccessToken.expires_in * 1000 + new Date().getTime()).toString(),
  );
};

export const fetchWithBrightCoveToken = (url: string) => {
  const brightcoveAccessToken = localStorage.getItem('brightcove_access_token');
  const expiresAt = brightcoveAccessToken
    ? JSON.parse(localStorage.getItem('brightcove_access_token_expires_at')!)
    : 0;
  if (new Date().getTime() > expiresAt || !expiresAt) {
    return fetchBrightcoveAccessToken().then(res => {
      setBrightcoveAccessTokenInLocalStorage(res);
      return fetch(url, {
        headers: { Authorization: `Bearer ${res.access_token}` },
      });
    });
  }
  return fetch(url, {
    headers: { Authorization: `Bearer ${brightcoveAccessToken}` },
  });
};

export const fetchOembed = async (url: string, options?: FetchConfigType): Promise<H5POembed> => {
  const data = await fetchAuthorized(url, options);
  return resolveJsonOrRejectWithError(data);
};

const setH5pOembedUrl = (query: { url: string }) =>
  `${config.h5pApiUrl}/oembed/preview?${queryString.stringify(query)}`;

const setOembedUrl = (query: { url: string }) =>
  `${apiResourceUrl('/oembed-proxy/v1/oembed')}?${queryString.stringify(query)}`;

export const fetchExternalOembed = (url: string, options?: FetchConfigType) => {
  let setOembed = setOembedUrl({ url });
  if (config.h5pApiUrl && url.includes(config.h5pApiUrl)) {
    setOembed = setH5pOembedUrl({ url });
  }
  return fetchOembed(setOembed, options);
};

export { resolveJsonOrRejectWithError, throwErrorPayload };
