/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IArticleSummaryV2 } from '@ndla/types-backend/build/article-api';

export interface MenuWithArticle {
  articleId: number;
  article?: IArticleSummaryV2;
  menu: MenuWithArticle[];
}
