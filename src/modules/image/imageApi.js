/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import defined from 'defined';
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
  createErrorPayload,
} from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/image-api/v2/images');

export const postImage = formData =>
  fetchAuthorized(`${baseUrl}`, {
    method: 'POST',
    headers: { 'Content-Type': undefined },
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

export const searchImages = (query, page) =>
  fetchAuthorized(
    `${baseUrl}/?${queryString.stringify({
      query,
      page,
    })}&page-size=16`,
  ).then(resolveJsonOrRejectWithError);

export const onError = err => {
  createErrorPayload(err.status, defined(err.message, err.statusText), err);
};

export const deleteLanguageVersionImage = (imageId, locale) =>
  fetchAuthorized(`${baseUrl}/${imageId}/language/${locale}`, {
    method: 'DELETE',
  }).then(resolveJsonOrRejectWithError);
