/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from 'react-query';
import { fetchAllResourceTypes, fetchResourceType } from '.';
import { WithTaxonomyVersion } from '../../../interfaces';
import { RESOURCE_TYPE, RESOURCE_TYPES } from '../../../queryKeys';
import { ResourceType } from '../taxonomyApiInterfaces';

interface UseResourceTypeParams extends WithTaxonomyVersion {
  id: string;
  language: string;
}
export const resourceTypeQueryKey = (params?: Partial<UseResourceTypeParams>) => [
  RESOURCE_TYPE,
  params,
];
export const useResourceType = (
  params: UseResourceTypeParams,
  options?: UseQueryOptions<ResourceType>,
) => useQuery<ResourceType>(resourceTypeQueryKey(params), () => fetchResourceType(params), options);

interface UseAllResourceTypesParams extends WithTaxonomyVersion {
  language: string;
}
export const resourceTypesQueryKey = (params?: Partial<UseAllResourceTypesParams>) => [
  RESOURCE_TYPES,
  params,
];
export const useAllResourceTypes = <ReturnType>(
  params: UseAllResourceTypesParams,
  options?: UseQueryOptions<ResourceType[], unknown, ReturnType>,
) =>
  useQuery<ResourceType[], unknown, ReturnType>(
    resourceTypesQueryKey(params),
    () => fetchAllResourceTypes(params),
    options,
  );
