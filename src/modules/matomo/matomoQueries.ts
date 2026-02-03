/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { MATOMO_STATS } from "../../queryKeys";
import { fetchMatomoStats, MatomoResponse, MatomoStatsBody } from "./matomoApi";

const matomoQueryKeys = {
  matomoStats: (params?: Partial<MatomoStatsBody>) => [MATOMO_STATS, params] as const,
};

export const useMatomoStats = (
  body: MatomoStatsBody,
  options?: Partial<UseQueryOptions<PromiseSettledResult<MatomoResponse>[]>>,
) => {
  return useQuery<PromiseSettledResult<MatomoResponse>[]>({
    queryKey: matomoQueryKeys.matomoStats(body),
    queryFn: ({ signal }) => fetchMatomoStats({ urls: body.urls, signal }),
    ...options,
  });
};
