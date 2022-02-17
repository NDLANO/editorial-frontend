/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export interface ImageSearchQuery {
  query?: string;
  page?: number;
  'page-size'?: number;
  language?: string;
  sort?: string;
}
