/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { taxonomyApi } from '../../../config';
import { apiResourceUrl, httpFunctions, stringifyQuery } from '../../../util/apiHelpers';
import {
  resolveLocation,
  resolveVoidOrRejectWithError,
} from '../../../util/resolveJsonOrRejectWithError';
import { GetVersionsParams, VersionPostBody, VersionPutBody, VersionType } from './versionApiTypes';

const baseUrl = apiResourceUrl(`${taxonomyApi}/versions`);

const { fetchAndResolve, postAndResolve, putAndResolve, deleteAndResolve } = httpFunctions;

interface VersionGetParams extends GetVersionsParams {}

export const fetchVersions = ({ type, hash }: VersionGetParams): Promise<VersionType[]> => {
  return fetchAndResolve({ url: baseUrl, queryParams: { type, hash } });
};

interface VersionGetParam {
  id: string;
}

export const fetchVersion = ({ id }: VersionGetParam): Promise<VersionType> => {
  return fetchAndResolve({ url: `${baseUrl}/${id}` });
};

interface VersionPostParams {
  body: VersionPostBody;
  sourceId?: string;
}

export const postVersion = ({ body, sourceId }: VersionPostParams): Promise<string> => {
  return postAndResolve({
    url: `${baseUrl}${stringifyQuery({ sourceId })}`,
    body: JSON.stringify(body),
    alternateResolve: resolveLocation,
  });
};

interface VersionPutParams {
  id: string;
  body: VersionPutBody;
}

export const putVersion = ({ id, body }: VersionPutParams): Promise<void> => {
  return putAndResolve({
    url: `${baseUrl}/${id}`,
    body: JSON.stringify(body),
    alternateResolve: resolveVoidOrRejectWithError,
  });
};

interface VersionDeleteParams {
  id: string;
}

export const deleteVersion = ({ id }: VersionDeleteParams): Promise<void> => {
  return deleteAndResolve({
    url: `${baseUrl}/${id}`,
    alternateResolve: resolveVoidOrRejectWithError,
  });
};

interface PublishVersionParams {
  id: string;
}

export const publishVersion = ({ id }: PublishVersionParams): Promise<void> => {
  return putAndResolve({
    url: `${baseUrl}/${id}/publish`,
    alternateResolve: resolveVoidOrRejectWithError,
  });
};
