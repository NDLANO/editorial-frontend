/*
 * Copyright (c) 2021-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useQuery, UseQueryOptions } from 'react-query';
import { fetchAllResourceTypes, fetchResourceType } from '.';
import { RESOURCE_TYPE, RESOURCE_TYPES } from '../../../queryKeys';
import { ResourceType } from '../taxonomyApiInterfaces';

export const useResourceType = (
  id: string,
  locale: string,
  options?: UseQueryOptions<ResourceType>,
) =>
  useQuery<ResourceType>([RESOURCE_TYPE, id, locale], () => fetchResourceType(id, locale), options);

export const useAllResourceTypes = <ReturnType>(
  locale: string,
  options?: UseQueryOptions<ResourceType[], unknown, ReturnType>,
) =>
  useQuery<ResourceType[], unknown, ReturnType>(
    [RESOURCE_TYPES, locale],
    () => fetchAllResourceTypes(locale),
    options,
  );
