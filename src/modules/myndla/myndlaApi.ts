/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from "query-string";
import { IResourceDTO, ISingleResourceStatsDTO, ResourceType } from "@ndla/types-backend/myndla-api";
import { resolveJsonOrRejectWithError, apiResourceUrl, fetchAuthorized } from "../../util/apiHelpers";

const statsUrl = apiResourceUrl("/myndla-api/v1/stats");
const foldersUrl = apiResourceUrl("/myndla-api/v1/folders");

export const fetchResourceStats = async (
  resourceTypes: string,
  resourceIds: string,
): Promise<ISingleResourceStatsDTO[]> => {
  const response = await fetchAuthorized(`${statsUrl}/favorites/${resourceTypes}/${resourceIds}`);
  return resolveJsonOrRejectWithError(response);
};

interface ResourceWithFilteredResourceType<T extends ResourceType> extends Omit<IResourceDTO, "resourceType"> {
  resourceType: Exclude<ResourceType, T>;
}

interface RecentFavoritedParams<T extends ResourceType> {
  size?: number;
  exclude: T[];
}

export const fetchRecentFavorited = async <T extends ResourceType>({
  exclude,
  ...params
}: RecentFavoritedParams<T>): Promise<ResourceWithFilteredResourceType<(typeof exclude)[number]>[]> => {
  const stringifiedParams = queryString.stringify({
    ...params,
    ...(exclude.length ? { exclude: exclude.join(",") } : {}),
  });

  const query = params ? `?${stringifiedParams}` : "";
  const response = await fetchAuthorized(`${foldersUrl}/resources/recent${query}`);
  return resolveJsonOrRejectWithError(response);
};
