/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { sortBy } from "lodash-es";
import { useTranslation } from "react-i18next";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IFilmFrontPageDTO } from "@ndla/types-backend/frontpage-api";
import { fetchFilmFrontpage } from "./frontpageApi";
import { sortMoviesByIdList } from "../../containers/NdlaFilm/filmUtil";
import { FILM_FRONTPAGE_QUERY, FILM_SEARCH, FILM_SLIDESHOW } from "../../queryKeys";
import { getIdFromUrn } from "../../util/ndlaFilmHelpers";
import { searchResources } from "../search/searchApi";
import { MultiSearchApiQuery, MultiSummarySearchResults, NoNodeSearchParams } from "../search/searchApiInterfaces";

export const filmQueryKeys = {
  filmFrontpage: [FILM_FRONTPAGE_QUERY],
  movies: (params: UseMovies) => [FILM_SLIDESHOW, params] as const,
  search: (params: MultiSearchApiQuery) => [FILM_SEARCH, params] as const,
};

export const useFilmFrontpageQuery = (options?: Partial<UseQueryOptions<IFilmFrontPageDTO>>) => {
  return useQuery<IFilmFrontPageDTO>({
    queryKey: filmQueryKeys.filmFrontpage,
    queryFn: () => fetchFilmFrontpage(),
    ...options,
  });
};

const slideshowArticlesQueryObject: NoNodeSearchParams = {
  page: 1,
  contextTypes: ["standard"],
  sort: "-relevance",
  pageSize: 10,
};

export interface UseMovies {
  movieUrns: string[];
}

export const useMoviesQuery = (
  params: UseMovies,
  options: Partial<UseQueryOptions<MultiSummarySearchResults>> = {},
) => {
  const { i18n } = useTranslation();
  const movieIds = params.movieUrns.map((urn) => Number(getIdFromUrn(urn))).filter((id) => !isNaN(id));
  const ids = sortBy(movieIds);

  return useQuery<MultiSummarySearchResults>({
    queryKey: filmQueryKeys.movies(params),
    queryFn: () => searchResources({ ...slideshowArticlesQueryObject, ids: ids }),
    select: (res) => ({
      ...res,
      results: sortMoviesByIdList(movieIds, res.results, i18n),
    }),
    ...options,
  });
};
