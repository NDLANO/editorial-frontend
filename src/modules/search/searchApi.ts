/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
} from '../../util/apiHelpers';
import { transformQuery } from '../../util/searchHelpers';
import {
  ConceptSearchQuery,
  DraftSearchQuery,
  GroupSearchResult,
  MultiSearchApiQuery,
} from './searchApiInterfaces';
import { SearchConceptApiType, ConceptSearchResult } from '../concept/conceptApiInterfaces';

const baseUrl = apiResourceUrl('/search-api/v1/search');
const groupUrl = apiResourceUrl('/search-api/v1/search/group/');

// Temporary solution, search-api should be used instead
const conceptBaseUrl = apiResourceUrl('/concept-api/v1/drafts');

export const searchConcepts = async (query: ConceptSearchQuery): Promise<ConceptSearchResult> => {
  const response = await fetchAuthorized(
    `${conceptBaseUrl}?${queryString.stringify(transformQuery(query))}`,
  );
  return resolveJsonOrRejectWithError(response).then((resolved: SearchConceptApiType) => {
    return resolved;
  });
};

export const search = async (query: MultiSearchApiQuery) => {
  const response = await fetchAuthorized(
    `${baseUrl}/editorial/?${queryString.stringify(transformQuery(query))}`,
  );
  return resolveJsonOrRejectWithError(response);
};

export const searchResources = async (query: MultiSearchApiQuery) => {
  const response = await fetchAuthorized(
    `${baseUrl}/?${queryString.stringify(transformQuery(query))}`,
  );
  return resolveJsonOrRejectWithError(response);
};

export const groupSearch = (query: string, type: string): Promise<GroupSearchResult[]> =>
  fetchAuthorized(`${groupUrl}?query=${query}&resource-types=${type}`).then(
    resolveJsonOrRejectWithError,
  );
