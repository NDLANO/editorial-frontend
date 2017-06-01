/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { resolveJsonOrRejectWithError, apiResourceUrl, fetchAuthorized } from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/article-api/v1/articles');

export const search = (queryString, locale) =>
  fetchAuthorized(`${baseUrl}/${queryString}&language=${locale}`).then(resolveJsonOrRejectWithError);
