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

export interface GroupSearchResult {
  totalCount: number;
  page?: number;
  pageSize: number;
  language: string;
  results: GroupSearchSummary[];
  resourceType: string;
}

export interface GroupSearchSummary {
  id: number;
  url: string;
  title: {
    title: string;
    language: string;
  };
  paths: string[];
  summaryType: 'groupsearch';
}

export interface MultiSearchApiQuery {
  page?: number;
  'page-size'?: number;
  'context-types'?: CommaSeparatedList;
  language?: string;
  ids?: CommaSeparatedList;
  'resource-types'?: CommaSeparatedList;
  levels?: CommaSeparatedList;
  license?: string;
  query?: string;
  sort?: string;
  fallback?: boolean;
  subjects?: CommaSeparatedList;
  'language-filter'?: CommaSeparatedList;
  'context-filters'?: CommaSeparatedList;
  'search-context'?: string;
  'grep-codes'?: CommaSeparatedList;
}

export interface ConceptSearchQuery {
  query?: string;
  page?: number;
  sort?: string;
  'page-size'?: number;
  language?: string;
}
