/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ArticleType, Copyright, Status, VisualElement, Author } from '../../interfaces';

export enum ConceptStatusType {
  DRAFT,
  QUALITY_ASSURED,
  PUBLISHED,
  QUEUED_FOR_LANGUAGE,
  ARCHIVED,
  TRANSLATED,
  UNPUBLISHED,
}

export interface ConceptApiType {
  id: number;
  revision: number;
  title?: {
    title: string;
    language: string;
  };
  content?: {
    content: string;
    language: string;
  };
  copyright?: Copyright;
  source?: string;
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
  created: string;
  updated: string;
  updatedBy?: string[];
  supportedLanguages: string[];
  articleIds: number[];
  status: Status;
  visualElement?: {
    visualElement: string;
    language: string;
  };
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
  metaImage: {
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
  title?: string;
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

export interface ConceptFormikType {
  id: number;
  revision: number;
  title?: string;
  content?: string;
  license: {
    license: string;
    description?: string;
    url?: string;
  };
  language: string;
  creators: Author[];
  processors: Author[];
  rightsholders: Author[];
  agreementId?: number;
  source?: string;
  metaImageId?: string;
  metaImageAlt?: string;
  tags?: string[];
  subjectIds?: string[];
  created: string;
  updated: string;
  updatedBy?: string[];
  supportedLanguages: string[];
  articleIds: ArticleType[];
  status: Status;
  visualElement?: VisualElement;
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
