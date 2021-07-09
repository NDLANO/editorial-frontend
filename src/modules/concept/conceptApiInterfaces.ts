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
  VisualElement,
  ArticleType,
  StrippedConceptType,
} from '../../interfaces';

export type LanguageFieldType<T> = T & {
  language: string;
};

export interface ConceptSubmitType extends StrippedConceptType {
  agreementId?: number;
  articles: ArticleType[];
  supportedLanguages: string[];
  metaImageId: string;
  created?: string;
  parsedVisualElement: VisualElement;
}

export interface ConceptTagsSearchResult {
  totalCount: number;
  page: number;
  pageSize: number;
  language: string;
  results: string[];
}

export interface ConceptStatusStateMachineType {
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
  ids?: string;
  sort?: string;
  fallback?: boolean;
  scrollId?: string;
  subjects?: string;
  tags?: string;
  status?: string;
  users?: string;
  'embed-id'?: number;
  'embed-resource'?: string;
}

interface UpdateConceptType {
  language: string;
  title?: string;
  articleIds?: number[];
  content?: string;
  copyright?: Copyright;
  metaImage?: { id: string; alt: string } | null;
  source?: string;
  subjectIds?: string[];
  tags?: string[];
  visualElement?: string;
}

export interface PatchConceptType extends UpdateConceptType {
  id: number;
}

export interface NewConceptType extends UpdateConceptType {
  title: string;
}

export interface CoreApiConceptType {
  id: number;
  title: LanguageFieldType<{ title: string }>;
  supportedLanguages: string[];
  status: Status;
  content?: LanguageFieldType<{ content: string }>;
  metaImage?: LanguageFieldType<{
    url: string;
    alt: string;
  }>;
  tags?: LanguageFieldType<{ tags: string[] }>;
  subjectIds?: string[];
}

export interface SearchConceptType extends CoreApiConceptType {
  lastUpdated: string;
  updatedBy: string[];
  license?: string;
}

export interface ApiConceptType extends CoreApiConceptType {
  revision: number;
  articleIds: number[];
  created: string;
  updated: string;
  updatedBy?: string[];
  copyright?: Copyright;
  source?: string;
  visualElement?: LanguageFieldType<{ visualElement: string }>;
}

export interface ConceptSearchResult {
  totalCount: number;
  page?: number;
  pageSize: number;
  language: string;
  results: SearchConceptType[];
}
