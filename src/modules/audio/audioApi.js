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

const baseUrl = apiResourceUrl('/audio-api/v1/audio');

export const postAudio = formData =>
  fetchWithAccessToken(`${baseUrl}`, {
    method: 'POST',
    body: formData,
  }).then(resolveJsonOrRejectWithError);

export const fetchAudio = (id, locale) =>
  fetchWithAccessToken(`${baseUrl}/${id}?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );

export const updateAudio = (id, formData) =>
  fetchWithAccessToken(`${baseUrl}/${id}`, {
    method: 'PUT',
    body: formData,
  }).then(resolveJsonOrRejectWithError);
