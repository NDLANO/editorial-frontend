/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useQuery, UseQueryOptions } from 'react-query';
import { IFilmFrontPageData } from '@ndla/types-frontpage-api';
import { IMultiSearchResult } from '@ndla/types-search-api';
import { fetchFilmFrontpage } from './frontpageApi';
import { searchResources } from '../search/searchApi';
import { FILM_FRONTPAGE_QUERY, FILM_SLIDESHOW } from '../../queryKeys';
import { getIdFromUrn } from '../../util/ndlaFilmHelpers';
import { sortMoviesByIdList } from '../../containers/NdlaFilm/filmUtil';

export const filmFrontpageQueryKey = () => [FILM_FRONTPAGE_QUERY];

export const useFilmFrontpageQuery = (options?: UseQueryOptions<IFilmFrontPageData>) => {
  return useQuery<IFilmFrontPageData>(filmFrontpageQueryKey(), () => fetchFilmFrontpage(), options);
};

const slideshowArticlesQueryObject = {
  page: 1,
  'context-types': 'standard',
  sort: '-relevance',
  'page-size': 10,
};

export interface UseMovies {
  movieUrns: string[];
}

export const moviesQueryKey = (params?: Partial<UseMovies>) => [FILM_SLIDESHOW, params];

export const useMoviesQuery = (
  params: UseMovies,
  options: UseQueryOptions<IMultiSearchResult> = {},
) => {
  const { i18n } = useTranslation();
  const movieIds = params.movieUrns.map(urn => Number(getIdFromUrn(urn))).filter(id => !isNaN(id));
  const ids = sortBy(movieIds).join(',');

  return useQuery<IMultiSearchResult>(
    [FILM_SLIDESHOW, params],
    () => searchResources({ ...slideshowArticlesQueryObject, ids: ids }),
    {
      select: res => ({ ...res, results: sortMoviesByIdList(movieIds, res.results, i18n) }),
      ...options,
    },
  );
};
