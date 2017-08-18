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
  fetchWithAccessToken,
} from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/image-api/v2/images');

export const postImage = formData =>
  fetchWithAccessToken(`${baseUrl}`, {
    method: 'POST',
    body: formData,
  }).then(resolveJsonOrRejectWithError);

export const fetchImage = (id, locale) =>
  fetchWithAccessToken(`${baseUrl}/${id}?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );

export const updateImage = (id, formData) =>
  fetchWithAccessToken(`${baseUrl}/${id}`, {
    method: 'POST',
    body: formData,
  }).then(resolveJsonOrRejectWithError);
