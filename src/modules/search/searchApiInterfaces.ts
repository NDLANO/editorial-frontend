/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  DraftSearchParamsDTO,
  MultiSearchResultDTO,
  MultiSearchSummaryDTO,
  SearchParamsDTO,
} from "@ndla/types-backend/search-api";

/** Type used to indicate that the api takes a string with comma separated values to
 *  simulate an array: ie 'item1,item2,item3' */
type CommaSeparatedList = string;

export interface MultiSearchApiQuery {
  page?: number;
  "page-size"?: number;
  "context-types"?: CommaSeparatedList;
  language?: string;
  ids?: CommaSeparatedList;
  "resource-types"?: CommaSeparatedList;
  levels?: CommaSeparatedList;
  license?: string;
  query?: string;
  sort?: string;
  fallback?: boolean;
  subjects?: CommaSeparatedList;
  "language-filter"?: CommaSeparatedList;
  "context-filters"?: CommaSeparatedList;
  "article-types"?: CommaSeparatedList;
  "search-context"?: string;
  "grep-codes"?: CommaSeparatedList;
  "embed-id"?: number;
  "embed-resource"?: string;
  "responsible-ids"?: CommaSeparatedList;
  "aggregate-paths"?: CommaSeparatedList;
  "revision-date-from"?: string;
  "revision-date-to"?: string;
  priority?: string;
  "draft-status"?: string;
  "include-other-statuses"?: boolean;
  "filter-inactive"?: boolean;
  "published-date-to"?: string;
  "published-date-from"?: string;
}

/** NOTE: To avoid accidental use of the "node" result type,
 * we exclude it from the search params since this parameter will allow other nodes in the search result we need to
 * handle that specifically with [[IMultiSearchResultDTO]] rather than [[MultiSummarySearchResults]].
 */
export type NoNodeResultTypes = Exclude<Required<SearchParamsDTO>["resultTypes"][number], "node">;
export type NoNodeSearchParams = Omit<SearchParamsDTO, "resultTypes"> & { resultTypes?: NoNodeResultTypes[] };
export type NoNodeDraftResultTypes = Exclude<Required<DraftSearchParamsDTO>["resultTypes"][number], "node">;
export type NoNodeDraftSearchParams = Omit<DraftSearchParamsDTO, "resultTypes"> & { resultTypes?: NoNodeResultTypes[] };
export type MultiSummarySearchResults = Omit<MultiSearchResultDTO, "results"> & { results: MultiSearchSummaryDTO[] };
