/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ILicense as DraftApiLicense } from '@ndla/types-draft-api';
import { Author, SearchResultBase } from '../../interfaces';

export type LearningPathSearchResult = SearchResultBase<LearningPathSearchSummary>;

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

interface LearningStep {
  id: number;
  revision: number;
  seqNo: number;
  title: {
    title: string;
    language: string;
  };
  description?: {
    description: string;
    language: string;
  };
  embedUrl?: {
    url: string;
    embedType: 'oembed' | 'iframe' | 'lti';
  };
  showTitle: boolean;
  type: 'INTRODUCTION' | 'TEXT' | 'QUIZ' | 'TASK' | 'MULTIMEDIA' | 'SUMMARY' | 'TEST';
  license?: DraftApiLicense;
  metaUrl: string;
  canEdit: boolean;
  status: string;
  supportedLanguages: string[];
}

export interface Learningpath {
  copyright: {
    license: DraftApiLicense;
    contributors: Author[];
  };
  duration?: number;
  canEdit: boolean;
  verificationStatus: 'CREATED_BY_NDLA' | 'VERIFIED_BY_NDLA' | 'EXTERNAL';
  lastUpdated: string;
  description: {
    description: string;
    language: string;
  };
  tags: {
    tags: string[];
    language: string;
  };
  isBasedOn?: number;
  learningsteps: LearningStep[];
  metaUrl: string;
  revision: number;
  learningstepUrl: string;
  id: number;
  status: 'PUBLISHED' | 'PRIVATE' | 'UNLISTED' | 'SUBMITTED';
  ownerId?: string;
  supportedLanguages: string[];
  message?: {
    message: string;
    date: string;
  };
  coverPhoto?: {
    url: string;
    metaUrl: string;
  };
  title: {
    title: string;
    language: string;
  };
}
