/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { IMultiSearchResult } from '@ndla/types-backend/search-api';
import { useTranslation } from 'react-i18next';
import { SEARCH } from '../../queryKeys';
import { search } from './searchApi';
import { MultiSearchApiQuery } from './searchApiInterfaces';
import { useUserData } from '../draft/draftQueries';
import { getAccessToken, getAccessTokenPersonal } from '../../util/authHelpers';
import { isValid } from '../../util/jwtHelper';
import {
  FAVOURITES_SUBJECT_ID,
  LMA_SUBJECT_ID,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA,
} from '../../constants';
import { useNodes } from '../nodes/nodeQueries';
import { useTaxonomyVersion } from '../../containers/StructureVersion/TaxonomyVersionProvider';

export const searchQueryKeys = {
  search: (params?: Partial<MultiSearchApiQuery>) => [SEARCH, params] as const,
};

export interface UseSearch extends MultiSearchApiQuery {
  favoriteSubjects?: string[];
}

export const useSearch = (
  query: UseSearch,
  options?: Partial<UseQueryOptions<IMultiSearchResult>>,
) => {
  const { i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const isFavourite = query.subjects === FAVOURITES_SUBJECT_ID;
  const isLMASubjects = query.subjects === LMA_SUBJECT_ID;

  const { data, isLoading } = useUserData({
    enabled: !!isFavourite && isValid(getAccessToken()) && getAccessTokenPersonal(),
  });

  const { data: nodeData, isLoading: nodeDataIsLoading } = useNodes(
    {
      language: i18n.language,
      taxonomyVersion,
      nodeType: 'SUBJECT',
      key: TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA,
      value: data?.userId,
    },
    { enabled: !!data?.userId },
  );

  const actualQuery = {
    ...query,
    subjects: isFavourite
      ? data?.favoriteSubjects?.join(',')
      : isLMASubjects
      ? nodeData?.map((s) => s.id).join(',')
      : query.subjects,
  };

  return useQuery<IMultiSearchResult>({
    queryKey: searchQueryKeys.search(actualQuery),
    queryFn: () => search(actualQuery),
    ...options,
    enabled: options?.enabled && !isLoading && !nodeDataIsLoading,
  });
};
