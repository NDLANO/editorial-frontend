/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { IMultiSearchResult } from '@ndla/types-backend/search-api';
import { SEARCH } from '../../queryKeys';
import { search } from './searchApi';
import { MultiSearchApiQuery } from './searchApiInterfaces';
import { useUserData } from '../draft/draftQueries';
import { getAccessToken, getAccessTokenPersonal } from '../../util/authHelpers';
import { isValid } from '../../util/jwtHelper';
import { FAVOURITES_SUBJECT_ID } from '../../constants';

export const searchQueryKey = (params?: Partial<MultiSearchApiQuery>) => [SEARCH, params];

export interface UseSearch extends MultiSearchApiQuery {
  favoriteSubjects?: string[];
}

export const useSearch = (query: UseSearch, options?: UseQueryOptions<IMultiSearchResult>) => {
  const isFav = query.subjects === FAVOURITES_SUBJECT_ID;

  const { data, isInitialLoading } = useUserData({
    enabled: !!isFav && isValid(getAccessToken()) && getAccessTokenPersonal(),
  });

  const actualQuery = {
    ...query,
    subjects: isFav ? data?.favoriteSubjects?.join(',') : query.subjects,
  };

  return useQuery<IMultiSearchResult>(searchQueryKey(actualQuery), () => search(actualQuery), {
    ...options,
    enabled: options?.enabled && !isInitialLoading,
  });
};
