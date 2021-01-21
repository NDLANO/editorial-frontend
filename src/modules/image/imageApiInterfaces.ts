/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

interface Author {
  name: string;
  type: string;
}

interface Copyright {
  license: {
    license: string;
    description: string;
    url?: string;
  };
  origin: string;
  processors: Author[];
  rightsholders: Author[];
  creators: Author[];
  agreementId?: number;
  validFrom?: string;
  validTo?: string;
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
}

export interface NewImageMetadata {
  id?: number; // Used only to check if image was newly created. This id is discarded by backend.
  title: string;
  alttext: string;
  copyright: Copyright;
  tags: string[];
  caption: string;
  language: string;
}

export interface UpdatedImageMetadata {
  id?: number; // Used only as id in endpoint-url. Discarded by backend.
  language: string;
  title?: string;
  alttext?: string;
  copyright?: Copyright;
  tags?: string[];
  caption?: string;
}

interface SearchResultBase<T> {
  totalCount: number;
  page?: number;
  pageSize: number;
  language: string;
  results: T[];
}

export interface ImageSearchResult
  extends SearchResultBase<ImageSearchSummaryApiType> {}

export interface TagSearchResult extends SearchResultBase<string> {}

export interface ImageSearchSummaryApiType {
  id: string;
  title: {
    title: string;
    language: string;
  };
  contributors: string[];
  alttext: {
    alttext: string;
    language: string;
  };
  previewUrl: string;
  metaUrl: string;
  license: string;
  supportedLanguages: string[];
}
