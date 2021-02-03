/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

interface Author {
  type: string;
  name: string;
}

interface Status {
  status: string;
  other: string[];
}

export interface DraftStatusStateMachineType {
  QUALITY_ASSURED: string[];
  PUBLISHED: string[];
  QUEUED_FOR_LANGUAGE: string[];
  AWAITING_UNPUBLISHING: string[];
  QUALITY_ASSURED_DELAYED: string[];
  QUEUED_FOR_PUBLISHING: string[];
  QUEUED_FOR_PUBLISHING_DELAYED: string[];
  IMPORTED: string[];
  DRAFT: string[];
  USER_TEST: string[];
  PROPOSAL: string[];
  TRANSLATED: string[];
  UNPUBLISHED: string[];
  AWAITING_QUALITY_ASSURANCE: string[];
  ARCHIVED: string[];
}

export interface UploadedFileType {
  filename: string;
  mime: string;
  extension: string;
  path: string;
}

export interface LicenseResult {
  license: string;
  description?: string;
  url?: string;
}

export interface TagSearchResult {
  totalCount: number;
  page: number;
  pageSize: number;
  language: string;
  results: string[];
}

export interface TagResult {
  tags: string[];
  language: string;
}

export interface GrepCodesSearchResult {
  totalCount: number;
  page: number;
  pageSize: number;
  results: string[];
}

export interface AgreementSearchResult {
  totalCount: number;
  page?: number;
  pageSize: number;
  language: string;
  results: AgreementSummary[];
}

interface AgreementSummary {
  id: number;
  title: string;
  license: string;
}

export type DraftStatusTypes =
  | 'IMPORTED'
  | 'DRAFT'
  | 'PUBLISHED'
  | 'PROPOSAL'
  | 'QUEUED_FOR_PUBLISHING'
  | 'USER_TEST'
  | 'AWAITING_QUALITY_ASSURANCE'
  | 'QUEUED_FOR_LANGUAGE'
  | 'TRANSLATED'
  | 'QUALITY_ASSURED'
  | 'QUALITY_ASSURED_DELAYED'
  | 'QUEUED_FOR_PUBLISHING_DELAYED'
  | 'AWAITING_UNPUBLISHING'
  | 'UNPUBLISHED'
  | 'ARCHIVED';

export interface DraftSearchQuery {
  query?: string;
  language?: string;
  license?: string;
  page?: number;
  pageSize?: number;
  idList?: number[];
  articleTypes?: string[];
  sort?: string;
  scrollId?: string;
  fallback?: boolean;
  grepCodes?: string[];
}

export interface DraftSearchResult {
  totalCount: number;
  page?: number;
  pageSize: number;
  results: DraftSearchSummary[];
}

export interface DraftSearchSummary {
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
  url: string;
  license: string;
  articleType: string;
  supportedLanguages: string[];
  tags?: {
    tags: string[];
    language: string;
  };
  notes: string[];
  users: string[];
  grepCodes: string[];
}

export interface UserDataApiType {
  userId: string;
  savedSearches?: string[];
  latestEditedArticles?: string[];
  favoriteSubjects?: string[];
}

export interface UpdatedUserDataApiType {
  savedSearches?: string[];
  latestEditedArticles?: string[];
  favoriteSubjects?: string[];
}

export interface AgreementApiType {
  id: number;
  title: string;
  content: string;
  copyright: Copyright;
  created: string;
  updated: string;
  updatedBy: string;
}

export interface UpdatedAgreementApiType {
  id?: number; // Discarded by backend, used only by endpoint
  title?: string;
  content?: string;
  copyright?: Copyright;
}

export interface NewAgreementApiType {
  title: string;
  content: string;
  copyright: Copyright;
}

export interface DraftApiType {
  id: number;
  oldNdlaUrl?: string;
  revision: number;
  status: Status;
  title?: {
    title: string;
    language: string;
  };
  content?: {
    content: string;
    language: string;
  };
  copyright?: Copyright;
  tags?: {
    tags: string[];
    language: string;
  };
  requiredLibraries: {
    mediaType: string;
    name: string;
    url: string;
  }[];
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
  created: string;
  updated: string;
  updatedBy: string;
  published: string;
  articleType: string;
  supportedLanguages: string[];
  notes: {
    note: string;
    user: string;
    status: Status;
    timestamp: string;
  }[];
  editorLabels: string[];
  grepCodes: string[];
  conceptIds: number[];
  availability: string;
}

export interface UpdatedDraftApiType {
  id?: number; // Discarded by backend, used only by endpoint
  revision: number;
  language?: string;
  title?: string;
  status?: string;
  published?: string;
  content?: string;
  tags?: string[];
  introduction?: string;
  metaDescription?: string;
  // null indicates delete, undefined from optional indicates no change.
  // if we want to delete given metaImage, send null as a value.
  metaImage?: {
    id: string;
    alt: string;
  } | null;
  visualElement?: string;
  copyright?: Copyright;
  requiredLibraries?: {
    mediaType: string;
    name: string;
    url: string;
  }[];
  articleType?: string;
  notes?: string[];
  editorLabels?: string[];
  grepCodes?: string[];
  conceptIds?: number[];
  createNewVersion?: boolean;
  availability?: string;
}

export interface NewDraftApiType {
  language: string;
  title: string;
  published?: string;
  content?: string;
  tags: string[];
  introduction?: string;
  metaDescription?: string;
  metaImage?: {
    url: string;
    alt: string;
  };
  visualElement?: string;
  copyright?: Copyright;
  requiredLibraries: {
    mediaType: string;
    name: string;
    url: string;
  }[];
  articleType: string;
  notes: string[];
  editorLabels: string[];
  grepCodes: string[];
  conceptIds: number[];
  availability?: string;
}

interface Copyright {
  license?: {
    license: string;
    description?: string;
    url?: string;
  };
  origin?: string;
  creators: Author[];
  processors: Author[];
  rightsholders: Author[];
  agreementId?: number;
  validFrom?: string;
  validTo?: string;
}
