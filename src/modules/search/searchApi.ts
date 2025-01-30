/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  IDraftSearchParamsDTO,
  IGrepSearchInputDTO,
  IGrepSearchResultsDTO,
  IMultiSearchResultDTO,
  ISearchParamsDTO,
  ISubjectAggregationsDTO,
  ISubjectAggsInputDTO,
} from "@ndla/types-backend/search-api";
import { StringSort } from "../../containers/SearchPage/components/form/SearchForm";
import { resolveJsonOrRejectWithError, apiResourceUrl, fetchAuthorized } from "../../util/apiHelpers";
import { transformSearchBody } from "../../util/searchHelpers";

const baseUrl = apiResourceUrl("/search-api/v1/search");

export const postSearch = async (body: StringSort<IDraftSearchParamsDTO>): Promise<IMultiSearchResultDTO> => {
  const response = await fetchAuthorized(`${baseUrl}/editorial/`, {
    method: "POST",
    body: JSON.stringify(transformSearchBody(body)),
  });
  return resolveJsonOrRejectWithError(response);
};

export const searchResources = async (body: ISearchParamsDTO): Promise<IMultiSearchResultDTO> => {
  const response = await fetchAuthorized(`${baseUrl}/`, {
    method: "POST",
    body: JSON.stringify(transformSearchBody(body)),
  });
  return resolveJsonOrRejectWithError(response);
};

export const searchSubjectStats = async (body: ISubjectAggsInputDTO): Promise<ISubjectAggregationsDTO> => {
  const response = await fetchAuthorized(`${baseUrl}/subjects`, {
    method: "POST",
    body: JSON.stringify(transformSearchBody(body)),
  });
  return resolveJsonOrRejectWithError(response);
};

export const searchGrepCodes = async (body: IGrepSearchInputDTO): Promise<IGrepSearchResultsDTO> => {
  const response = await fetchAuthorized(`${baseUrl}/grep`, { method: "POST", body: JSON.stringify(body) });
  return resolveJsonOrRejectWithError(response);
};
