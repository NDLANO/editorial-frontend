/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IDraftSearchParams, IMultiSearchResult } from "@ndla/types-backend/search-api";
import { resolveJsonOrRejectWithError, apiResourceUrl, fetchAuthorized } from "../../util/apiHelpers";

const baseUrl = apiResourceUrl("/search-api/v1/search");

export const postSearch = async (body: IDraftSearchParams): Promise<IMultiSearchResult> => {
  const response = await fetchAuthorized(`${baseUrl}/editorial/`, { method: "POST", body: JSON.stringify(body) });
  return resolveJsonOrRejectWithError(response);
};
