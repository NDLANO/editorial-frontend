/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Version } from "@ndla/types-taxonomy";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { VERSION, VERSIONS } from "../../../queryKeys";
import { fetchVersion, fetchVersions } from "./versionApi";
import { GetVersionsParams } from "./versionApiTypes";

export const versionQueryKeys = {
  version: (params?: Partial<UseVersionParams>) => [VERSION, params] as const,
  versions: (params?: Partial<UseVersionsParams>) => [VERSIONS, params] as const,
};

interface UseVersionsParams extends GetVersionsParams {}
export const useVersions = (params?: UseVersionsParams, options?: Partial<UseQueryOptions<Version[]>>) => {
  return useQuery<Version[]>({
    queryKey: versionQueryKeys.versions(params),
    queryFn: () => fetchVersions({ ...params }),
    ...options,
  });
};

interface UseVersionParams {
  id: string;
}
export const useVersion = (params: UseVersionParams, options?: Partial<UseQueryOptions<Version>>) => {
  return useQuery<Version>({
    queryKey: [versionQueryKeys.version(params)],
    queryFn: () => fetchVersion(params),
    ...options,
  });
};
