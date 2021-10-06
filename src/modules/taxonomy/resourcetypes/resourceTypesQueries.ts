import { useQuery, UseQueryOptions } from 'react-query';
import { fetchResourceType } from '.';
import { RESOURCE_TYPE } from '../../../queryKeys';
import { ResourceType } from '../taxonomyApiInterfaces';

export const useResourceType = (
  id: string,
  locale: string,
  options?: UseQueryOptions<ResourceType>,
) =>
  useQuery<ResourceType>([RESOURCE_TYPE, id, locale], () => fetchResourceType(id, locale), options);
