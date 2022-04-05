/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import { taxonomyApi } from '../../../config';
import { apiResourceUrl, httpFunctions } from '../../../util/apiHelpers';
import {
  resolveLocation, resolveVoidOrRejectWithError,
} from '../../../util/resolveJsonOrRejectWithError';
import type { GetVersionsParams, VersionType, VersionPostBody, VersionPutBody } from './versionApiTypes';

const baseUrl = apiResourceUrl(`${taxonomyApi}/versions`);

const { fetchAndResolve, postAndResolve, putAndResolve, deleteAndResolve } = httpFunctions;

const stringifyQuery = (object: Record<string, any> = {}) => `?${queryString.stringify(object)}`;

export const fetchVersions = (params?: GetVersionsParams): Promise<VersionType[]> => {
  return fetchAndResolve({ url: `${baseUrl}${stringifyQuery({ type: params?.type })}` });
};

export const fetchVersion = (id: string): Promise<VersionType> => {
  return fetchAndResolve({ url: `${baseUrl}/${id}` });
};

export const postVersion = (body: VersionPostBody, sourceId?: string): Promise<string> => {
  return postAndResolve({
    url: `${baseUrl}${stringifyQuery({ sourceId })}`,
    body: JSON.stringify(body),
    alternateResolve: resolveLocation,
  });
};

export const putVersion = (id: string, body: VersionPutBody): Promise<void> => {
  return putAndResolve({ url: `${baseUrl}/${id}`, body: JSON.stringify(body), alternateResolve: resolveVoidOrRejectWithError });
};

export const deleteVersion = (id: string): Promise<void> => {
  return deleteAndResolve({
    url: `${baseUrl}/${id}`,
    alternateResolve: resolveVoidOrRejectWithError,
  });
};

export const publishVersion = (id: string): Promise<void> => {
  return putAndResolve({url: `${baseUrl}/${id}/publish`, alternateResolve: resolveVoidOrRejectWithError});
}
