/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Author } from '../../interfaces';

export interface ImageApiLicense {
  license: string;
  description: string;
  url?: string;
}

interface Copyright {
  license: ImageApiLicense;
  origin: string;
  processors: Author[];
  rightsholders: Author[];
  creators: Author[];
  agreementId?: number;
  validFrom?: string;
  validTo?: string;
}

export interface EditorNote {
  timestamp: string;
  updatedBy: string;
  note: string;
}

export interface ImageApiType {
  id: string;
  metaUrl: string;
  title: {
    title: string;
    language: string;
  };
  alttext: {
    alttext: string;
    language: string;
  };
  imageUrl: string;
  size: number;
  contentType: string;
  copyright: Copyright;
  tags: {
    tags: string[];
    language: string;
  };
  caption: {
    caption: string;
    language: string;
  };
  supportedLanguages: string[];
  modelRelease: string;
  editorNotes?: EditorNote[];
}

interface SearchResultBase<T> {
  totalCount: number;
  page: number;
  pageSize: number;
  language: string;
  results: T[];
}

export type ImageSearchResult = SearchResultBase<ImageSearchSummaryApiType>;

export type TagSearchResult = SearchResultBase<string>;

export interface ImageSearchSummaryApiType {
  id: string;
  title: {
    title: string;
    language: string;
  };
  contributors: string[];
  altText: {
    alttext: string;
    language: string;
  };
  previewUrl: string;
  metaUrl: string;
  license: string;
  supportedLanguages: string[];
}

export interface ImageSearchQuery {
  query?: string;
  page?: number;
  'page-size'?: number;
  language?: string;
  sort?: string;
}
