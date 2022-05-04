/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from 'react-query';
import { IMultiSearchResult } from '@ndla/types-search-api';
import { SEARCH } from '../../queryKeys';
import { search } from './searchApi';
import { MultiSearchApiQuery } from './searchApiInterfaces';

export const searchQueryKey = (params?: Partial<MultiSearchApiQuery>) => [SEARCH, params];

export const useSearch = (
  query: MultiSearchApiQuery,
  options?: UseQueryOptions<IMultiSearchResult>,
) => useQuery<IMultiSearchResult>(searchQueryKey(query), () => search(query), options);
