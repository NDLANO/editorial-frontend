/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from 'react-query';
import type { GetVersionsParams, VersionType } from './versionApiTypes';
import { VERSION, VERSIONS } from '../../../queryKeys';
import { fetchVersion, fetchVersions } from './versionApi';

export const useVersions = (params?: GetVersionsParams, options?: UseQueryOptions<VersionType[]>) => {
  return useQuery<VersionType[]>([VERSIONS, params], () => fetchVersions(params), options);
};

export const useVersion = (id: string, options?: UseQueryOptions<VersionType>) => {
  return useQuery<VersionType>([VERSION, id], () => fetchVersion(id), options);
};
