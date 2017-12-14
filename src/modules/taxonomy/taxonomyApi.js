/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
} from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/taxonomy/v1');

export const fetchTopicArticle = (topicId, locale) =>
  fetchAuthorized(`${baseUrl}/topics/${topicId}/?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
