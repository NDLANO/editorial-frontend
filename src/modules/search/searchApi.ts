/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import searchApi from 'query-string';
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
} from '../../util/apiHelpers';
import { transformQuery } from '../../util/searchHelpers';
import {
  ConceptSearchQuery,
  MediaSearchQuery,
  GroupSearchResult,
  MultiSearchApiQuery,
} from './searchApiInterfaces';

const baseUrl = apiResourceUrl('/search-api/v1/search');
const audioUrl = apiResourceUrl('/audio-api/v1/audio');
const groupUrl = apiResourceUrl('/search-api/v1/search/group/');

// Temporary solution, search-api should be used instead
const conceptBaseUrl = apiResourceUrl('/concept-api/v1/drafts');

export const searchConcepts = async (query: ConceptSearchQuery) => {
  const response = await fetchAuthorized(
    `${conceptBaseUrl}?${searchApi.stringify(transformQuery(query))}`,
  );
  return resolveJsonOrRejectWithError(response);
};

export const search = async (query: MultiSearchApiQuery) => {
  const response = await fetchAuthorized(
    `${baseUrl}/editorial/?${searchApi.stringify(transformQuery(query))}`,
  );
  return resolveJsonOrRejectWithError(response);
};

export const searchResources = async (query: MultiSearchApiQuery) => {
  const response = await fetchAuthorized(
    `${baseUrl}/?${searchApi.stringify(transformQuery(query))}`,
  );
  return resolveJsonOrRejectWithError(response);
};

export const searchAudio = async (query: MediaSearchQuery) => {
  const response = await fetchAuthorized(
    `${audioUrl}/?${searchApi.stringify(query)}`,
  );
  return resolveJsonOrRejectWithError(response);
};

export const groupSearch = (
  query: string,
  type: string,
): Promise<GroupSearchResult[]> =>
  fetchAuthorized(`${groupUrl}?query=${query}&resource-types=${type}`).then(
    resolveJsonOrRejectWithError,
  );
