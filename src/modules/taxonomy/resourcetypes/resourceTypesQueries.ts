/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ResourceType } from "@ndla/types-taxonomy";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchAllResourceTypes, fetchResourceType } from ".";
import { WithTaxonomyVersion } from "../../../interfaces";
import { RESOURCE_TYPE, RESOURCE_TYPES } from "../../../queryKeys";

export const resourceTypeQueryKeys = {
  resourceType: (params?: Partial<UseResourceTypeParams>) => [RESOURCE_TYPE, params] as const,
  resourceTypes: (params?: Partial<UseAllResourceTypesParams>) => [RESOURCE_TYPES, params] as const,
};

interface UseResourceTypeParams extends WithTaxonomyVersion {
  id: string;
  language: string;
}
export const useResourceType = (params: UseResourceTypeParams, options?: Partial<UseQueryOptions<ResourceType>>) =>
  useQuery<ResourceType>({
    queryKey: resourceTypeQueryKeys.resourceType(params),
    queryFn: () => fetchResourceType(params),
    ...options,
  });

interface UseAllResourceTypesParams extends WithTaxonomyVersion {
  language: string;
}
export const useAllResourceTypes = <ReturnType>(
  params: UseAllResourceTypesParams,
  options?: Partial<UseQueryOptions<ResourceType[], unknown, ReturnType>>,
) =>
  useQuery<ResourceType[], unknown, ReturnType>({
    queryKey: resourceTypeQueryKeys.resourceTypes(params),
    queryFn: () => fetchAllResourceTypes(params),
    ...options,
  });
