/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  GrepSearchInputDTO,
  GrepSearchResultsDTO,
  MultiSearchResultDTO,
  SubjectAggregationsDTO,
  SubjectAggsInputDTO,
  openapi,
} from "@ndla/types-backend/search-api";
import { createAuthClient } from "../../util/apiHelpers";
import { transformSearchBody } from "../../util/searchHelpers";
import { MultiSummarySearchResults, NoNodeDraftSearchParams, NoNodeSearchParams } from "./searchApiInterfaces";
import { resolveJsonOATS } from "../../util/resolveJsonOrRejectWithError";

const client = createAuthClient<openapi.paths>();

export const postSearch = async (body: NoNodeDraftSearchParams): Promise<MultiSummarySearchResults> => {
  const response = await client
    .POST("/search-api/v1/search/editorial", { body: transformSearchBody(body) })
    .then(resolveJsonOATS);
  return convertSearchTypeOrThrowError(response);
};

export const convertSearchTypeOrThrowError = (result: MultiSearchResultDTO): MultiSummarySearchResults => {
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

export const searchSubjectStats = async (body: SubjectAggsInputDTO): Promise<SubjectAggregationsDTO> =>
  client
    .POST("/search-api/v1/search/subjects", {
      body: transformSearchBody(body),
    })
    .then(resolveJsonOATS);

export const searchGrepCodes = async (body: GrepSearchInputDTO): Promise<GrepSearchResultsDTO> =>
  client.POST("/search-api/v1/search/grep", { body }).then(resolveJsonOATS);
