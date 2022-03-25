/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
