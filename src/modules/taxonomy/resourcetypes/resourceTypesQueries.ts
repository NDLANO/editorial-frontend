/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ResourceType } from '@ndla/types-taxonomy';
import { fetchAllResourceTypes, fetchResourceType } from '.';
import { WithTaxonomyVersion } from '../../../interfaces';
import { RESOURCE_TYPE, RESOURCE_TYPES } from '../../../queryKeys';

export const resourceTypeQueryKeys = {
  resourceType: (params?: Partial<UseResourceTypeParams>) => [RESOURCE_TYPE, params] as const,
  resourceTypes: (params?: Partial<UseAllResourceTypesParams>) => [RESOURCE_TYPES, params] as const,
};

interface UseResourceTypeParams extends WithTaxonomyVersion {
  id: string;
  language: string;
}
export const useResourceType = (
  params: UseResourceTypeParams,
  options?: UseQueryOptions<ResourceType>,
) =>
  useQuery<ResourceType>(
    resourceTypeQueryKeys.resourceType(params),
    () => fetchResourceType(params),
    options,
  );

interface UseAllResourceTypesParams extends WithTaxonomyVersion {
  language: string;
}
export const useAllResourceTypes = <ReturnType>(
  params: UseAllResourceTypesParams,
  options?: UseQueryOptions<ResourceType[], unknown, ReturnType>,
) =>
  useQuery<ResourceType[], unknown, ReturnType>(
    resourceTypeQueryKeys.resourceTypes(params),
    () => fetchAllResourceTypes(params),
    options,
  );
