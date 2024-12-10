/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  IDraftSearchParams,
  IGrepSearchInput,
  IGrepSearchResults,
  IMultiSearchResult,
  ISearchParams,
  ISubjectAggregations,
  ISubjectAggsInput,
} from "@ndla/types-backend/search-api";
import { StringSort } from "../../containers/SearchPage/components/form/SearchForm";
import { resolveJsonOrRejectWithError, apiResourceUrl, fetchAuthorized } from "../../util/apiHelpers";
import { transformSearchBody } from "../../util/searchHelpers";

const baseUrl = apiResourceUrl("/search-api/v1/search");

export const postSearch = async (body: StringSort<IDraftSearchParams>): Promise<IMultiSearchResult> => {
  const response = await fetchAuthorized(`${baseUrl}/editorial/`, {
    method: "POST",
    body: JSON.stringify(transformSearchBody(body)),
  });
  return resolveJsonOrRejectWithError(response);
};

export const searchResources = async (body: ISearchParams): Promise<IMultiSearchResult> => {
  const response = await fetchAuthorized(`${baseUrl}/`, {
    method: "POST",
    body: JSON.stringify(transformSearchBody(body)),
  });
  return resolveJsonOrRejectWithError(response);
};

export const searchSubjectStats = async (body: ISubjectAggsInput): Promise<ISubjectAggregations> => {
  const response = await fetchAuthorized(`${baseUrl}/subjects`, {
    method: "POST",
    body: JSON.stringify(transformSearchBody(body)),
  });
  return resolveJsonOrRejectWithError(response);
};

export const searchGrepCodes = async (body: IGrepSearchInput): Promise<IGrepSearchResults> => {
  const response = await fetchAuthorized(`${baseUrl}/grep`, { method: "POST", body: JSON.stringify(body) });
  return resolveJsonOrRejectWithError(response);
};
