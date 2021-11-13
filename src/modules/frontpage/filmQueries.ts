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
import { fetchFilmFrontpage } from './frontpageApi';
import { FilmFrontpageApiType } from './frontpageApiInterfaces';
import { searchResources } from '../search/searchApi';
import { MultiSearchResult } from '../search/searchApiInterfaces';
import { FILM_FRONTPAGE_QUERY, FILM_SLIDESHOW } from '../../queryKeys';
import { getIdFromUrn } from '../../util/ndlaFilmHelpers';
import { sortMoviesByIdList } from '../../containers/NdlaFilm/filmUtil';

export const useFilmFrontpageQuery = (options?: UseQueryOptions<FilmFrontpageApiType>) => {
  return useQuery<FilmFrontpageApiType>(
    [FILM_FRONTPAGE_QUERY],
    () => fetchFilmFrontpage(),
    options,
  );
};

const slideshowArticlesQueryObject = {
  page: 1,
  'context-types': 'standard',
  sort: '-relevance',
  'page-size': 10,
};

export const useMoviesQuery = (
  movieUrns: string[],
  options: UseQueryOptions<MultiSearchResult> = {},
) => {
  const { i18n } = useTranslation();
  const movieIds = movieUrns.map(urn => Number(getIdFromUrn(urn))).filter(id => !isNaN(id));
  const ids = sortBy(movieIds).join(',');

  return useQuery<MultiSearchResult>(
    [FILM_SLIDESHOW, ids],
    () => searchResources({ ...slideshowArticlesQueryObject, ids: ids }),
    {
      select: res => ({ ...res, results: sortMoviesByIdList(movieIds, res.results, i18n) }),
      ...options,
    },
  );
};
