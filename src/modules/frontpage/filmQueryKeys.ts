/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FILM_FRONTPAGE_QUERY, FILM_SEARCH, FILM_SLIDESHOW } from "../../queryKeys";
import { MultiSearchApiQuery } from "../search/searchApiInterfaces";
import { UseMovies } from "./filmTypes";

export const filmQueryKeys = {
  filmFrontpage: [FILM_FRONTPAGE_QUERY],
  movies: (params: UseMovies) => [FILM_SLIDESHOW, params] as const,
  search: (params: MultiSearchApiQuery) => [FILM_SEARCH, params] as const,
};
