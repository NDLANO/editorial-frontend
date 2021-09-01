/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export interface LearningPathSearchResult {
  totalCount: number;
  page?: number;
  pageSize: number;
  results: LearningPathSearchSummary[];
}

export interface LearningPathCopyright {
  license: {
    license: string;
    description?: string;
    url?: string;
  };
  contributors: [
    {
      type: string;
      name: string;
    },
  ];
}

export interface LearningPathSearchSummary {
  id: number;
  revision?: number;
  title: {
    title: string;
    language: string;
  };
  description: {
    description: string;
    language: string;
  };
  introduction: {
    introduction: string;
    language: string;
  };
  metaUrl: string;
  coverPhotoUrl?: string;
  duration?: number;
  status: string;
  lastUpdated: string;
  tags: {
    tags: string[];
    language: string;
  };
  copyright: LearningPathCopyright;
  supportedLanguages: string[];
  isBasedOn?: number;
  message?: string;
  summaryType: 'learningpath';
}

export interface SearchBody {
  query?: string;
  page?: number;
  pageSize?: number;
  language?: string;
  fallback?: boolean;
  verificationStatus?: string;
}

export interface CopyLearningPathBody {
  title: string;
  description?: string;
  language: string;
  coverPhotoMetaUrl?: string;
  duration?: number;
  tags?: string[];
  copyright?: LearningPathCopyright;
}
