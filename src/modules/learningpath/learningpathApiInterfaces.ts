/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ICopyrightDTO } from "@ndla/types-backend/learningpath-api";

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
  copyright?: ICopyrightDTO;
}
