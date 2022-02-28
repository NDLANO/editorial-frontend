/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IArticleV2 as ArticleApiType } from '@ndla/types-article-api';

type TransformedFields = 'title' | 'content' | 'tags' | 'introduction' | 'metaDescription';
export interface ArticleConverterApiType extends Omit<ArticleApiType, TransformedFields> {
  title: string;
  content: string;
  metaData: { copyText: string };
  tags: string[];
  introduction?: string;
  metaDescription: string;
  headerData: Record<string, string>;
  language: string;
}
