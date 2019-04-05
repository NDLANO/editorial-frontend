/**
 * Copyright (c) 2017-present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import defined from 'defined';
import config from '../../config';
import {
  createErrorPayload,
  apiResourceUrl,
  brightcoveApiResourceUrl,
  googleSearchApiResourceUrl,
  fetchAuthorized,
  fetchWithBrightCoveToken,
  resolveJsonOrRejectWithError,
} from '../../util/apiHelpers';

const baseImageNdlaUrl = apiResourceUrl('/image-api/v2/images');
const baseAudioNdlaUrl = apiResourceUrl('/audio-api/v1/audio');
const baseBrightCoveUrlV3 = brightcoveApiResourceUrl(
  `/v1/accounts/${config.brightCoveAccountId}/videos`,
);
const baseGoogleSearchUrl = googleSearchApiResourceUrl('/customsearch/v1/');

export const searchImages = (query, page) =>
  fetchAuthorized(
    `${baseImageNdlaUrl}/?${queryString.stringify({
      query,
      page,
    })}&page-size=16`,
  ).then(resolveJsonOrRejectWithError);
export const searchAudios = query =>
  fetchAuthorized(
    `${baseAudioNdlaUrl}/?${queryString.stringify({
      query: query.query,
      page: query.page,
    })}&page-size=16`,
  ).then(resolveJsonOrRejectWithError);

export const fetchAudio = audioId =>
  fetchAuthorized(`${baseAudioNdlaUrl}/${audioId}`).then(
    resolveJsonOrRejectWithError,
  );

export const fetchImage = imageId =>
  fetchAuthorized(`${baseImageNdlaUrl}/${imageId}`).then(
    resolveJsonOrRejectWithError,
  );

export const searchBrightcoveVideos = query =>
  fetchWithBrightCoveToken(
    `${baseBrightCoveUrlV3}/?${queryString.stringify({
      q: query.query || '',
      offset: query.offset,
      limit: query.limit,
    })}`,
  ).then(resolveJsonOrRejectWithError);

export async function fetchVideoSources(videoId, accountId) {
  const url = `https://cms.api.brightcove.com/v1/accounts/${accountId}/videos/${videoId}/sources`;
  const response = await fetchWithBrightCoveToken(url, {});
  return resolveJsonOrRejectWithError(response);
}

export const searchGoogleCustomSearch = (query, filter) => {
  const params = {
    key: config.googleSearchApiKey,
    cx: config.googleSearchEngineId,
    q: `${query.query} ${filter}`,
    start: query.start ? query.start : undefined,
  };
  const url = `${baseGoogleSearchUrl}?${queryString.stringify(params)}`;
  return fetch(url).then(resolveJsonOrRejectWithError);
};

export const fetchBrightcoveVideo = videoId =>
  fetchAuthorized(`${baseBrightCoveUrlV3}/${videoId}`).then(
    resolveJsonOrRejectWithError,
  );

export const onError = err => {
  createErrorPayload(err.status, defined(err.message, err.statusText), err);
};

export const searchVideos = (query, type) => {
  if (type === 'youtube') {
    return searchGoogleCustomSearch(query, 'more:youtube');
  }
  return searchBrightcoveVideos(query);
};

export const fetchVisualElement = embedTag => {
  switch (embedTag.resource) {
    case 'image':
      return fetchImage(embedTag.resource_id);
    case 'brightcove':
      return fetchBrightcoveVideo(embedTag.videoid);
    default:
      return new Promise((resolve, reject) => {
        reject(
          new Error(
            `No embedtag with resource type ${embedTag.resource} exists`,
          ),
        );
      });
  }
};
