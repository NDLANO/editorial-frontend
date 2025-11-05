/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { FrontPageDTO } from "@ndla/types-backend/frontpage-api";
import { fetchFrontpage } from "./frontpageApi";
import { FRONTPAGE } from "../../queryKeys";

export const frontpageQueryKeys = {
  frontpage: [FRONTPAGE] as const,
};

export const useFrontpage = (options?: Partial<UseQueryOptions<FrontPageDTO>>) => {
  return useQuery<FrontPageDTO>({
    queryKey: frontpageQueryKeys.frontpage,
    queryFn: () => fetchFrontpage(),
    ...options,
  });
};
