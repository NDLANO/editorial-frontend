/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from "query-string";
import { IDraftSearchParams, IMultiSearchResult } from "@ndla/types-backend/search-api";
import { MultiSearchApiQuery } from "./searchApiInterfaces";
import { resolveJsonOrRejectWithError, apiResourceUrl, fetchAuthorized } from "../../util/apiHelpers";
import { transformQuery, transformSearchBody } from "../../util/searchHelpers";

const baseUrl = apiResourceUrl("/search-api/v1/search");

export const postSearch = async (body: IDraftSearchParams): Promise<IMultiSearchResult> => {
  const response = await fetchAuthorized(`${baseUrl}/editorial/`, {
    method: "POST",
    body: JSON.stringify(transformSearchBody(body)),
  });
  return resolveJsonOrRejectWithError(response);
};

export const searchResources = async (query: MultiSearchApiQuery): Promise<IMultiSearchResult> => {
  const response = await fetchAuthorized(`${baseUrl}/?${queryString.stringify(transformQuery(query))}`);
  return resolveJsonOrRejectWithError(response);
};
