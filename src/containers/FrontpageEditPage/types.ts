/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IMultiSearchSummary } from '@ndla/types-backend/search-api';

export interface MenuWithArticle {
  articleId: number;
  article?: IMultiSearchSummary;
  menu: MenuWithArticle[];
}
