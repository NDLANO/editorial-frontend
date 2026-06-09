/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { queryOptions } from "@tanstack/react-query";
import { VERSION, VERSIONS } from "../../../queryKeys";
import { fetchVersion, fetchVersions, VersionGetParam, VersionGetParams } from "./versionApi";

export const versionQueryKeys = {
  version: (params?: Partial<VersionGetParam>) => [VERSION, params] as const,
  versions: (params?: Partial<VersionGetParams>) => [VERSIONS, params] as const,
};

export const versionsQueryOptions = (params: VersionGetParams = {}) => {
  return queryOptions({
    queryKey: versionQueryKeys.versions(params),
    queryFn: () => fetchVersions(params),
  });
};

export const versionQueryOptions = (params: VersionGetParam) => {
  return queryOptions({
    queryKey: versionQueryKeys.version(params),
    queryFn: () => fetchVersion(params),
  });
};
