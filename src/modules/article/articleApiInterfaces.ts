/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ArticleType, Author, AvailabilityType, SearchResultBase } from '../../interfaces';

export type ArticleSearchResult = SearchResultBase<ArticleSearchSummaryApiType>;
export interface ArticleSearchSummaryApiType {
  id: number;
  title: {
    title: string;
    language: string;
  };
  visualElement?: {
    visualElement: string;
    language: string;
  };
  introduction?: {
    introduction: string;
    language: string;
  };
  metaDescription?: {
    metaDescription: string;
    language: string;
  };
  metaImage?: {
    url: string;
    alt: string;
    language: string;
  };
  url: string;
  license: string;
  articleType: string;
  lastUpdated: string;
  supportedLanguages: string[];
  grepCodes: string[];
}

export interface ArticleConverterApiType extends ArticleType {
  availability: AvailabilityType;
  metaData: {
    images: {
      title: string;
      altText: string;
      copyright: Copyright;
      src: string;
      copyText: string;
    }[];
    copyText: string;
  };
}

export interface ArticleApiType {
  id: number;
  oldNdlaUrl?: string;
  revision: number;
  status: {
    status: string;
    other: string[];
  };
  title: {
    title: string;
    language: string;
  };
  content: {
    content: string;
    language: string;
  };
  copyright: Copyright;
  tags: {
    tags: string[];
    language: string;
  };
  requiredLibraries: [
    {
      mediaType: string;
      name: string;
      url: string;
    },
  ];
  visualElement?: {
    visualElement: string;
    language: string;
  };
  metaImage?: {
    url: string;
    alt: string;
    language: string;
  };
  introduction?: {
    introduction: string;
    language: string;
  };
  metaDescription: {
    metaDescription: string;
    language: string;
  };
  created: string;
  updated: string;
  updatedBy: string;
  published: string;
  articleType: string;
  supportedLanguages: string[];
  grepCodes: string[];
  conceptIds: number[];
  availability: string;
}

interface Copyright {
  license: {
    license: string;
    description?: string;
    url?: string;
  };
  origin: string;
  creators: Author[];
  processors: Author[];
  rightsholders: Author[];
  agreementId?: string;
  validFrom?: string;
  validTo?: string;
}
