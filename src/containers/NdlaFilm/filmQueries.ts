import { sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useQuery, UseQueryOptions } from 'react-query';
import { fetchFilmFrontpage } from '../../modules/frontpage/frontpageApi';
import { FilmFrontpageApiType } from '../../modules/frontpage/frontpageApiInterfaces';
import { searchResources } from '../../modules/search/searchApi';
import { MultiSearchResult } from '../../modules/search/searchApiInterfaces';
import { FILM_FRONTPAGE_QUERY, FILM_SLIDESHOW } from '../../queryKeys';
import { getIdFromUrn } from '../../util/ndlaFilmHelpers';
import { sortMoviesByIdList } from './filmUtil';

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
