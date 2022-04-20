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

export const useResourceType = (
  { id, language, taxonomyVersion }: UseResourceTypeParams,
  options?: UseQueryOptions<ResourceType>,
) =>
  useQuery<ResourceType>(
    [RESOURCE_TYPE, id, language, taxonomyVersion],
    () => fetchResourceType({ id, language, taxonomyVersion }),
    options,
  );

interface UseAllResourceTypesParams extends WithTaxonomyVersion {
  locale: string;
}

export const useAllResourceTypes = <ReturnType>(
  { locale, taxonomyVersion }: UseAllResourceTypesParams,
  options?: UseQueryOptions<ResourceType[], unknown, ReturnType>,
) =>
  useQuery<ResourceType[], unknown, ReturnType>(
    [RESOURCE_TYPES, locale, taxonomyVersion],
    () => fetchAllResourceTypes({ language: locale, taxonomyVersion }),
    options,
  );
