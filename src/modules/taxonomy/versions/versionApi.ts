/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { taxonomyApi } from '../../../config';
import { WithTaxonomyVersion } from '../../../interfaces';
import { apiResourceUrl, httpFunctions, stringifyQuery } from '../../../util/apiHelpers';
import {
  resolveLocation,
  resolveVoidOrRejectWithError,
} from '../../../util/resolveJsonOrRejectWithError';
import { GetVersionsParams, VersionPostBody, VersionPutBody, VersionType } from './versionApiTypes';

const baseUrl = apiResourceUrl(`${taxonomyApi}/versions`);

const { fetchAndResolve, postAndResolve, putAndResolve, deleteAndResolve } = httpFunctions;

interface VersionGetParams extends WithTaxonomyVersion, GetVersionsParams {}

export const fetchVersions = ({
  taxonomyVersion,
  type,
}: VersionGetParams): Promise<VersionType[]> => {
  return fetchAndResolve({ url: baseUrl, taxonomyVersion, queryParams: { type } });
};

interface VersionGetParam extends WithTaxonomyVersion {
  id: string;
}

export const fetchVersion = ({ id, taxonomyVersion }: VersionGetParam): Promise<VersionType> => {
  return fetchAndResolve({ url: `${baseUrl}/${id}`, taxonomyVersion });
};

interface VersionPostParams extends WithTaxonomyVersion {
  body: VersionPostBody;
  sourceId?: string;
}

export const postVersion = ({
  body,
  sourceId,
  taxonomyVersion,
}: VersionPostParams): Promise<string> => {
  return postAndResolve({
    url: `${baseUrl}${stringifyQuery({ sourceId })}`,
    body: JSON.stringify(body),
    alternateResolve: resolveLocation,
    taxonomyVersion,
  });
};

interface VersionPutParams extends WithTaxonomyVersion {
  id: string;
  body: VersionPutBody;
}

export const putVersion = ({ id, body, taxonomyVersion }: VersionPutParams): Promise<void> => {
  return putAndResolve({
    url: `${baseUrl}/${id}`,
    body: JSON.stringify(body),
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });
};

interface VersionDeleteParams extends WithTaxonomyVersion {
  id: string;
}

export const deleteVersion = ({ id, taxonomyVersion }: VersionDeleteParams): Promise<void> => {
  return deleteAndResolve({
    url: `${baseUrl}/${id}`,
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });
};

interface PublishVersionParams extends WithTaxonomyVersion {
  id: string;
}

export const publishVersion = ({ id, taxonomyVersion }: PublishVersionParams): Promise<void> => {
  return putAndResolve({
    url: `${baseUrl}/${id}/publish`,
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });
};
