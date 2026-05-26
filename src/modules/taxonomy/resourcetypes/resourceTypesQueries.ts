/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { queryOptions } from "@tanstack/react-query";
import { fetchAllResourceTypes, ResourceTypesGetParams } from ".";
import { RESOURCE_TYPES } from "../../../queryKeys";

export const resourceTypeQueryKeys = {
  resourceTypes: (params?: Partial<ResourceTypesGetParams>) => [RESOURCE_TYPES, params] as const,
};

export const resourceTypesQueryOptions = (params: ResourceTypesGetParams) => {
  return queryOptions({
    queryKey: resourceTypeQueryKeys.resourceTypes(params),
    queryFn: () => fetchAllResourceTypes(params),
    staleTime: Infinity,
  });
};
