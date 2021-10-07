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
