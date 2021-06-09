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
  'embed-id'?: number;
  'embed-resource'?: string;
}

interface SearchResultBase<T> {
  totalCount: number;
  page?: number;
  pageSize: number;
  language: string;
  suggestions: {
    name: string;
    suggestions: {
      text: string;
      offset: number;
      length: number;
      options: {
        text: string;
        score: number;
      }[];
    }[];
  }[];
  aggregations: {
    field: string;
    sumOtherDocCount: number;
    docCountErrorUpperBound: number;
    values: { value: string; count: number }[];
  }[];
  results: T[];
}

export interface MultiSearchSummary {
  id: number;
  title: {
    title: string;
    language: string;
  };
  metaDescription: {
    metaDescription: string;
    language: string;
  };
  metaImage?: {
    url: string;
    alt: string;
    language: string;
  };
  url: string;
  contexts: {
    id: string;
    subject: string;
    subjectId: string;
    path: string;
    breadcrumbs: string[];
    filters: {
      id: string;
      name: string;
      relevance: string;
    }[];
    learningResourceType: string;
    resourceTypes: {
      id: string;
      name: string;
      language: string;
    }[];
    language: string;
  }[];
  supportedLanguages: string[];
  learningResourceType: string;
  status?: {
    current: string;
    other: string[];
  };
  traits: string[];
  score: number;
  highlights: {
    field: string;
    matches: string[];
  }[];
  paths: string[];
}

export type MultiSearchResult = SearchResultBase<MultiSearchSummary>;
