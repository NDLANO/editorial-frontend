/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { queryOptions } from "@tanstack/react-query";
import { MATOMO_STATS } from "../../queryKeys";
import { fetchMatomoStats, MatomoStatsBody } from "./matomoApi";

const matomoQueryKeys = {
  matomoStats: (params?: Partial<MatomoStatsBody>) => [MATOMO_STATS, params] as const,
};

export const matomoStatusQueryOptions = (body: MatomoStatsBody) => {
  return queryOptions({
    queryKey: matomoQueryKeys.matomoStats(body),
    queryFn: ({ signal }) => fetchMatomoStats({ urls: body.urls, signal }),
  });
};
