/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createQueryString } from './util/queryHelpers';

export function toSearch(queryString) {
  if (queryString) {
    return `/search?${createQueryString(queryString)}`;
  }
  return '/search';
}

export function toTopicArticle(articleId) {
  return `/topic-article/${articleId}`;
}


