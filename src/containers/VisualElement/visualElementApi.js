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
  brightcoveApiResourceUrl,
  fetchWithAccessToken,
  fetchWithBrightCoveToken,
  resolveJsonOrRejectWithError,
} from '../../util/apiHelpers';

const baseNdlaUrl = apiResourceUrl('/image-api/v1/images');
const baseBrightCoveUrlV3 = brightcoveApiResourceUrl(
  `/v1/accounts/${window.config.brightCoveAccountId}/videos`,
);

export const searchImages = (query, page, locale) =>
  fetchWithAccessToken(
    `${baseNdlaUrl}/?${queryString.stringify({
      query,
      page,
    })}&page-size=16&language=${locale}`,
  ).then(resolveJsonOrRejectWithError);

// export const search = (queryString, locale) =>
//   fetchWithAccessToken(`${baseUrl}/${queryString}&language=${locale}`, { headers: headerWithAccessToken(token) }).then(resolveJsonOrRejectWithError);

export const fetchImage = imageId =>
  fetchWithAccessToken(`${baseNdlaUrl}/${imageId}`).then(
    resolveJsonOrRejectWithError,
  );

export const searchBrightcoveVideos = (query, offset, limit) =>
  fetchWithBrightCoveToken(
    `${baseBrightCoveUrlV3}/?${queryString.stringify({
      q: query || '',
      offset,
      limit,
    })}`,
  ).then(resolveJsonOrRejectWithError);

export const fetchBrightcoveVideo = videoId =>
  fetchWithAccessToken(`${baseBrightCoveUrlV3}/${videoId}`).then(
    resolveJsonOrRejectWithError,
  );

export const onError = err => {
  createErrorPayload(err.status, defined(err.message, err.statusText), err);
};

export const fetchVisualElement = embedTag => {
  switch (embedTag.resource) {
    case 'image':
      return fetchImage(embedTag.id);
    case 'video':
      return fetchBrightcoveVideo(embedTag.id);
    default:
      return new Promise((resolve, reject) => {
        reject(`No embedtag with resource type ${embedTag.resource} exists`);
      });
  }
};
