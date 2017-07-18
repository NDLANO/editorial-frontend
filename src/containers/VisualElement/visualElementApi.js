/**
 * Copyright (c) 2017-present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import defined from 'defined';
import {
  createErrorPayload,
  apiResourceUrl,
  fetchWithAccessToken,
  resolveJsonOrRejectWithError,
} from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/image-api/v1/images');

export const searchImages = (query, page, locale) =>
  fetchWithAccessToken(
    `${baseUrl}/?${queryString.stringify({
      query,
      page,
    })}&page-size=16&language=${locale}`,
  ).then(resolveJsonOrRejectWithError);

// export const search = (queryString, locale) =>
//   fetchWithAccessToken(`${baseUrl}/${queryString}&language=${locale}`, { headers: headerWithAccessToken(token) }).then(resolveJsonOrRejectWithError);

export const fetchImage = imageId =>
  fetchWithAccessToken(`${baseUrl}/${imageId}`).then(
    resolveJsonOrRejectWithError,
  );

export const onError = err => {
  createErrorPayload(err.status, defined(err.message, err.statusText), err);
};

export const fetchVisualElement = embedTag => {
  if (embedTag.resource === 'image') {
    return fetchWithAccessToken(`${baseUrl}/${embedTag.id}`).then(
      resolveJsonOrRejectWithError,
    );
  }

  return new Promise((resolve, reject) => {
    reject(`No embedtag with resource type ${embedTag.resource} exists`);
  });
};
