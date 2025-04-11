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
  openapi,
} from "@ndla/types-backend/search-api";
import { StringSort } from "../../containers/SearchPage/components/form/SearchForm";
import { createAuthClient } from "../../util/apiHelpers";
import { transformSearchBody } from "../../util/searchHelpers";
import { MultiSummarySearchResults, NoNodeDraftSearchParams, NoNodeSearchParams } from "./searchApiInterfaces";
import { resolveJsonOATS } from "../../util/resolveJsonOrRejectWithError";

const client = createAuthClient<openapi.paths>();

export const postSearch = async (body: StringSort<NoNodeDraftSearchParams>): Promise<MultiSummarySearchResults> => {
  const response = await client
    .POST("/search-api/v1/search/editorial", {
      body: {
        ...transformSearchBody(body, true),
        // @ts-expect-error TODO: API's use different sorting types and we share them in the frontend
        sort: body.sort,
      },
    })
    .then(resolveJsonOATS);
  return convertSearchTypeOrThrowError(response);
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
  const response = await client
    .POST("/search-api/v1/search", {
      body: {
        ...transformSearchBody(body),
        sort: body.sort,
        resultTypes: body.resultTypes,
      },
    })
    .then(resolveJsonOATS);
  return convertSearchTypeOrThrowError(response);
};

export const searchSubjectStats = async (body: ISubjectAggsInputDTO): Promise<ISubjectAggregationsDTO> =>
  client
    .POST("/search-api/v1/search/subjects", {
      body: transformSearchBody(body),
    })
    .then(resolveJsonOATS);

export const searchGrepCodes = async (body: IGrepSearchInputDTO): Promise<IGrepSearchResultsDTO> =>
  client.POST("/search-api/v1/search/grep", { body }).then(resolveJsonOATS);
