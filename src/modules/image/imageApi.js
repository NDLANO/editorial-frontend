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

const baseUrl = apiResourceUrl('/image-api/v2/images');

export const postImage = formData =>
  fetchAuthorized(`${baseUrl}`, {
    method: 'POST',
    body: formData,
  }).then(resolveJsonOrRejectWithError);

export const fetchImage = (id, language) =>
  fetchAuthorized(`${baseUrl}/${id}?language=${language}`).then(
    resolveJsonOrRejectWithError,
  );

export const updateImage = imageMetadata =>
  fetchAuthorized(`${baseUrl}/${imageMetadata.id}`, {
    method: 'PATCH',
    body: JSON.stringify(imageMetadata),
  }).then(resolveJsonOrRejectWithError);
