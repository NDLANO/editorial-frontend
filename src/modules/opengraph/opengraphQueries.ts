/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { queryOptions } from "@tanstack/react-query";
import { fetchOpenGraphData } from "./openGraphApi";

export const openGraphQueryKeys = {
  openGraph: (url: string) => ["openGraph", url] as const,
};

export const openGraphQueryOptions = (url: string) => {
  return queryOptions({
    queryKey: openGraphQueryKeys.openGraph(url),
    queryFn: () => fetchOpenGraphData(url),
  });
};
