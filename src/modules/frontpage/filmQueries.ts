/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { queryOptions } from "@tanstack/react-query";
import { filmQueryKeys } from "./filmQueryKeys";
import { fetchFilmFrontpage } from "./frontpageApi";

export const filmFrontpageQueryOptions = () => {
  return queryOptions({
    queryKey: filmQueryKeys.filmFrontpage,
    queryFn: () => fetchFilmFrontpage(),
  });
};
