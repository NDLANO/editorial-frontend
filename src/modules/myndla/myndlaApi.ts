/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ISingleResourceStats } from "@ndla/types-backend/myndla-api";
import { resolveJsonOrRejectWithError, apiResourceUrl, fetchAuthorized } from "../../util/apiHelpers";

const statsUrl = apiResourceUrl("/myndla-api/v1/stats");

export const fetchResourceStats = async (resourceType: string, resourceId: string): Promise<ISingleResourceStats> => {
  const response = await fetchAuthorized(`${statsUrl}/favorites/${resourceType}/${resourceId}`);
  return resolveJsonOrRejectWithError(response);
};
