/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  IGrepSearchInputDTO,
  IGrepSearchResultsDTO,
  IMultiSearchResultDTO,
  ISubjectAggregationsDTO,
  ISubjectAggsInputDTO,
} from "@ndla/types-backend/search-api";
import { StringSort } from "../../containers/SearchPage/components/form/SearchForm";
import { apiResourceUrl, fetchAuthorized, resolveJsonOrRejectWithError } from "../../util/apiHelpers";
import { transformSearchBody } from "../../util/searchHelpers";
import { MultiSummarySearchResults, NoNodeDraftSearchParams, NoNodeSearchParams } from "./searchApiInterfaces";

const baseUrl = apiResourceUrl("/search-api/v1/search");

export const postSearch = async (body: StringSort<NoNodeDraftSearchParams>): Promise<MultiSummarySearchResults> => {
  const response = await fetchAuthorized(`${baseUrl}/editorial/`, {
    method: "POST",
    body: JSON.stringify(transformSearchBody(body, true)),
  });
  const jsonResolved = await resolveJsonOrRejectWithError<IMultiSearchResultDTO>(response);
  return convertSearchTypeOrThrowError(jsonResolved);
};

export const convertSearchTypeOrThrowError = (result: IMultiSearchResultDTO): MultiSummarySearchResults => {
  const wrongType = result.results.find((result) => {
    return result.typename !== "MultiSearchSummaryDTO";
  });

  if (wrongType !== undefined) {
    throw new Error("Got unexpected typename from search-api. This is a bug");
  }

  return {
    ...result,
    results: result.results.filter((result) => {
      return result.typename === "MultiSearchSummaryDTO";
    }),
  };
};

export const searchResources = async (body: NoNodeSearchParams): Promise<MultiSummarySearchResults> => {
  const response = await fetchAuthorized(`${baseUrl}/`, {
    method: "POST",
    body: JSON.stringify(transformSearchBody(body)),
  });

  const jsonResolved = await resolveJsonOrRejectWithError<IMultiSearchResultDTO>(response);
  return convertSearchTypeOrThrowError(jsonResolved);
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
