/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import { IGroupSearchResult, IMultiSearchResult } from '@ndla/types-search-api';
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
} from '../../util/apiHelpers';
import { transformQuery } from '../../util/searchHelpers';
import { MultiSearchApiQuery } from './searchApiInterfaces';

const baseUrl = apiResourceUrl('/search-api/v1/search');
const groupUrl = apiResourceUrl('/search-api/v1/search/group/');

export const search = async (query: MultiSearchApiQuery): Promise<IMultiSearchResult> => {
  const response = await fetchAuthorized(
    `${baseUrl}/editorial/?${queryString.stringify(transformQuery(query))}`,
  );
  return resolveJsonOrRejectWithError(response);
};

export const searchResources = async (query: MultiSearchApiQuery): Promise<IMultiSearchResult> => {
  const response = await fetchAuthorized(
    `${baseUrl}/?${queryString.stringify(transformQuery(query))}`,
  );
  return resolveJsonOrRejectWithError(response);
};

export const groupSearch = (query: MultiSearchApiQuery): Promise<IGroupSearchResult[]> =>
  fetchAuthorized(`${groupUrl}?${queryString.stringify(transformQuery(query))}`).then(r =>
    resolveJsonOrRejectWithError<IGroupSearchResult[]>(r),
  );
