/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  Copyright,
  Status,
  ArticleType,
  VisualElement,
} from '../../interfaces';

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
  results: ConceptSearchSummaryApiType[];
}

export interface StrippedConceptType {
  id: number;
  title?: string;
  content?: string;
  visualElement?: string;
  language: string;
  copyright?: Copyright;
  source?: string;
  metaImage?: {
    id?: string;
    url: string;
    alt: string;
    language: string;
  };
  tags: string[];
  subjectIds?: string[];
  articleIds?: number[];
}

export interface ConceptType extends StrippedConceptType {
  title: string;
  content: string;
  visualElement: string;
  subjectIds: string[];
  articleIds: number[];
  lastUpdated?: string;
  updatedBy: string[];
  supportedLanguages: string[];
  status: Status;
  created: string;
  updated: string;
}

export interface ConceptPreviewType extends ConceptType {
  visualElementResources: VisualElement;
}

export interface ConceptFormType extends ConceptType {
  articles: ArticleType[];
}

interface ConceptSearchSummaryApiType {
  id: number;
  title: {
    title: string;
    language: string;
  };
  content: {
    content: string;
    language: string;
  };
  metaImage?: {
    url: string;
    alt: string;
    language: string;
  };
  tags?: {
    tags: string[];
    language: string;
  };
  subjectIds?: string[];
  supportedLanguages: string[];
  lastUpdated: string;
  status: Status;
  updatedBy: string[];
  license?: string;
}

export interface NewConceptType {
  language: string;
  title: string;
  content?: string;
  copyright?: Copyright;
  source?: string;
  metaImage?: {
    id: string;
    alt: string;
  };
  tags?: string[];
  subjectIds?: string[];
  articleIds?: number[];
  visualElement?: string;
}

export interface UpdatedConceptType {
  id?: number; // Used only as id in endpoint-url. Discarded by backend. Should be removed from this interface in the future.
  language: string;
  title: string;
  content?: string;
  metaImage?: {
    id: string;
    alt: string;
  };
  copyright?: Copyright;
  source?: string;
  tags?: string[];
  subjectIds?: string[];
  articleIds?: number[];
  status?: string;
  visualElement?: string;
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

export interface PreviewMetaImage {
  id: number;
  alt: string;
}
