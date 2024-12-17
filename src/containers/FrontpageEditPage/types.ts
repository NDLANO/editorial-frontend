/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IArticleSummaryV2DTO } from "@ndla/types-backend/article-api";

export interface MenuWithArticle {
  articleId: number;
  article?: IArticleSummaryV2DTO;
  menu: MenuWithArticle[];
  hideLevel?: boolean;
}
