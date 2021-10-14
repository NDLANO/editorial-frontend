/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Copyright, Embed, ArticleType, SearchResultBase } from '../../interfaces';

export type LanguageFieldType<T> = T & {
  language: string;
};

export interface ConceptSubmitType extends StrippedConceptType {
  agreementId?: number;
  articles: ArticleType[];
  supportedLanguages: string[];
  metaImageId: string;
  created?: string;
}

export type ConceptStatusType =
  | 'DRAFT'
  | 'QUALITY_ASSURED'
  | 'PUBLISHED'
  | 'QUEUED_FOR_LANGUAGE'
  | 'ARCHIVED'
  | 'TRANSLATED'
  | 'UNPUBLISHED';

export interface ConceptStatus {
  current: ConceptStatusType;
  other: ConceptStatusType[];
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
  status: ConceptStatus;
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

export type ConceptSearchResult = SearchResultBase<SearchConceptType>;

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
    url?: string;
    alt: string;
    language?: string;
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
  status: ConceptStatus;
  created?: string;
  updated: string;
  metaImageId: string;
  parsedVisualElement: Embed;
}

export type FormValues = {
  id: number;
  language: string;
  revision?: number;
  status: ConceptStatus;
};

export interface ConceptFormType extends ConceptType {
  articles: ArticleType[];
}
