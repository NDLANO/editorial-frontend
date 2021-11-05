/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import { useQuery, UseQueryOptions } from 'react-query';
import { SEARCH } from '../../queryKeys';
import { search } from './searchApi';
import { MultiSearchApiQuery, MultiSearchResult } from './searchApiInterfaces';

export const useSearch = (
  query: MultiSearchApiQuery,
  options?: UseQueryOptions<MultiSearchResult>,
) =>
  useQuery<MultiSearchResult>([SEARCH, queryString.stringify(query)], () => search(query), options);
