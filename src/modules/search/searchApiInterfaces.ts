/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
