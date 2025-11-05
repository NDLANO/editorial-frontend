/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { SingleResourceStatsDTO } from "@ndla/types-backend/myndla-api";
import { fetchResourceStats } from "./myndlaApi";
import { MYNDLA_RESOURCE_STATS } from "../../queryKeys";

interface UseResourceStats {
  resourceTypes: string[];
  resourceIds: string[];
}

export const myndlaQueryKeys = {
  resourceStats: (params?: Partial<UseResourceStats>) => [MYNDLA_RESOURCE_STATS, params] as const,
};

export const useResourceStats = (
  params: UseResourceStats,
  options?: Partial<UseQueryOptions<SingleResourceStatsDTO[]>>,
) =>
  useQuery<SingleResourceStatsDTO[]>({
    queryKey: myndlaQueryKeys.resourceStats(params),
    queryFn: () => fetchResourceStats(params.resourceTypes, params.resourceIds),
    ...options,
  });
