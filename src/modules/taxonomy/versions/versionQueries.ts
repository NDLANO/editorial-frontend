/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from 'react-query';
import { WithTaxonomyVersion } from '../../../interfaces';
import { VERSION, VERSIONS } from '../../../queryKeys';
import { fetchVersion, fetchVersions } from './versionApi';
import { GetVersionsParams, VersionType } from './versionApiTypes';

interface UseVersionsParams extends WithTaxonomyVersion, GetVersionsParams {}
export const useVersions = (
  { taxonomyVersion, ...params }: UseVersionsParams,
  options?: UseQueryOptions<VersionType[]>,
) => {
  return useQuery<VersionType[]>(
    [VERSIONS, params],
    () => fetchVersions({ ...params, taxonomyVersion }),
    options,
  );
};

interface UseVersionParams extends WithTaxonomyVersion {
  id: string;
}

export const useVersion = (
  { id, taxonomyVersion }: UseVersionParams,
  options?: UseQueryOptions<VersionType>,
) => {
  return useQuery<VersionType>(
    [VERSION, id, taxonomyVersion],
    () => fetchVersion({ id, taxonomyVersion }),
    options,
  );
};
