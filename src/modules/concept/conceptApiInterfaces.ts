/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Copyright, Status } from '../../interfaces';

export type ConceptStatusType =
  | 'DRAFT'
  | 'QUALITY_ASSURED'
  | 'PUBLISHED'
  | 'QUEUED_FOR_LANGUAGE'
  | 'ARCHIVED'
  | 'TRANSLATED'
  | 'UNPUBLISHED';

export type LanguageFieldType<T> = T & {
  language: string;
};

interface CoreConceptApiType {
  id: number;
  status: Status;
  supportedLanguages: string[];
  title: LanguageFieldType<{ title: string }>;
  content?: LanguageFieldType<{ content: string }>;
  tags?: LanguageFieldType<{ tags: string[] }>;
  subjectIds?: string[];
  metaImage?: {
    url: string;
    alt: string;
    language: string;
  };
  updatedBy?: string[];
}

export interface SearchConceptApiType extends CoreConceptApiType {
  lastUpdated: string;
  license: string;
}

export interface ConceptApiType extends CoreConceptApiType {
  revision: number;
  copyright?: Copyright;
  source?: string;
  created: string;
  updated: string;
  articleIds: number[];
  visualElement?: LanguageFieldType<{ visualElement: string }>;
}

export interface ConceptTagsSearchResult {
  totalCount: number;
  page: number;
  pageSize: number;
  language: string;
  results: string[];
}

export interface ConceptSearchResult {
  totalCount: number;
  page?: number;
  pageSize: number;
  language: string;
  results: SearchConceptApiType[];
}

export interface ConceptStatusStateMashineType {
  DRAFT: string[];
  QUALITY_ASSURED: string[];
  PUBLISHED: string[];
  QUEUED_FOR_LANGUAGE: string[];
  ARCHIVED: string[];
  TRANSLATED: string[];
  UNPUBLISHED: string[];
}

export interface ConceptQuery {
  query?: string;
  language?: string;
  page?: number;
  pageSize?: number;
  idList: number[];
  sort?: string;
  fallback?: boolean;
  scrollId?: string;
  subjects: string[];
  tags: string[];
  status: string[];
  users: string[];
}
