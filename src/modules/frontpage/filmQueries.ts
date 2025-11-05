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
import { FilmFrontPageDTO } from "@ndla/types-backend/frontpage-api";
import { fetchFilmFrontpage } from "./frontpageApi";
import { sortMoviesByIdList } from "../../containers/NdlaFilm/filmUtil";
import { searchResources } from "../search/searchApi";
import { MultiSummarySearchResults, NoNodeSearchParams } from "../search/searchApiInterfaces";
import { filmQueryKeys } from "./filmQueryKeys";
import { UseMovies } from "./filmTypes";

export const useFilmFrontpageQuery = (options?: Partial<UseQueryOptions<FilmFrontPageDTO>>) => {
  return useQuery<FilmFrontPageDTO>({
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

export const useMoviesQuery = (
  params: UseMovies,
  options: Partial<UseQueryOptions<MultiSummarySearchResults>> = {},
) => {
  const { i18n } = useTranslation();
  const movieIds = params.movieUrns
    .map((urn) => Number(parseInt(urn.replace("urn:article:", ""))))
    .filter((id) => !isNaN(id));
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
