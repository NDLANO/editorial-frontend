/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { OpenGraphData } from "./opengraphTypes";
import { fetchOpenGraphData } from "./openGraphApi";

export const openGraphQueryKeys = {
  openGraph: (url: string) => ["openGraph", url] as const,
};

export const useFetchOpenGraph = (url: string, options?: Partial<UseQueryOptions<OpenGraphData>>) => {
  return useQuery<OpenGraphData>({
    queryKey: openGraphQueryKeys.openGraph(url),
    queryFn: () => fetchOpenGraphData(url),
    ...options,
  });
};
