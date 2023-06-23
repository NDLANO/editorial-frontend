/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Version } from '@ndla/types-taxonomy';
import { VERSION, VERSIONS } from '../../../queryKeys';
import { fetchVersion, fetchVersions } from './versionApi';
import { GetVersionsParams } from './versionApiTypes';

interface UseVersionsParams extends GetVersionsParams {}
export const versionsQueryKey = (params?: Partial<UseVersionsParams>) => [VERSIONS, params];
export const useVersions = (params?: UseVersionsParams, options?: UseQueryOptions<Version[]>) => {
  return useQuery<Version[]>(versionsQueryKey(params), () => fetchVersions({ ...params }), options);
};

interface UseVersionParams {
  id: string;
}
export const versionQueryKey = (params?: Partial<UseVersionParams>) => [VERSION, params];
export const useVersion = ({ id }: UseVersionParams, options?: UseQueryOptions<Version>) => {
  return useQuery<Version>([VERSION, id], () => fetchVersion({ id }), options);
};
