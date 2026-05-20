/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { queryOptions } from "@tanstack/react-query";
import { MYNDLA_RESOURCE_STATS } from "../../queryKeys";
import { fetchResourceStats } from "./myndlaApi";

interface UseResourceStats {
  resourceTypes: string[];
  resourceIds: string[];
}

export const myndlaQueryKeys = {
  resourceStats: (params?: Partial<UseResourceStats>) => [MYNDLA_RESOURCE_STATS, params] as const,
};

export const resourceStatsQueryOptions = (params: UseResourceStats) => {
  return queryOptions({
    queryKey: myndlaQueryKeys.resourceStats(params),
    queryFn: () => fetchResourceStats(params.resourceTypes, params.resourceIds),
  });
};
