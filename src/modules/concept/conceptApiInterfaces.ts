/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Copyright, SearchResultBase, Embed, MetaImage } from '../../interfaces';

export type LanguageFieldType<T> = T & {
  language: string;
};

export type ConceptStatusStateMachineType = Record<ConceptStatusType, string[]>;

export type ConceptStatusType =
  | 'DRAFT'
  | 'QUALITY_ASSURED'
  | 'PUBLISHED'
  | 'QUEUED_FOR_LANGUAGE'
  | 'ARCHIVED'
  | 'TRANSLATED'
  | 'UNPUBLISHED'
  | string;

export interface ConceptStatus {
  current: ConceptStatusType;
  other: ConceptStatusType[];
}

export type ConceptTagsSearchResult = SearchResultBase<string>;

export interface ConceptQuery {
  query?: string;
  language?: string;
  page?: number;
  'page-size'?: number;
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

export interface ConceptPatchType extends UpdateConceptType {
  id: number;
}

export interface ConceptPostType extends UpdateConceptType {
  title: string;
}
export interface SearchConceptType {
  id: number;
  title: LanguageFieldType<{ title: string }>;
  content?: LanguageFieldType<{ content: string }>;
  metaImage?: MetaImage;
  tags?: LanguageFieldType<{ tags: string[] }>;
  subjectIds?: string[];
  supportedLanguages: string[];
  lastUpdated: string;
  status: ConceptStatus;
  updatedBy: string[];
  license?: string;
}

export interface ConceptApiType {
  id: number;
  revision: number;
  title: LanguageFieldType<{ title: string }>;
  content: LanguageFieldType<{ content: string }>;
  copyright?: Copyright;
  source?: string;
  metaImage?: MetaImage;
  tags?: LanguageFieldType<{ tags: string[] }>;
  subjectIds: string[];
  created: string;
  updated: string;
  updatedBy?: string[];
  supportedLanguages: string[];
  articleIds: number[];
  status: ConceptStatus;
  parsedVisualElement?: Embed;
  visualElement?: {
    visualElement: string;
    language: string;
  };
}

export type ConceptSearchResult = SearchResultBase<SearchConceptType>;
