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
} from '../../../util/apiHelpers';

const baseUrl = apiResourceUrl('/taxonomy/v1');

function fetchTopics(locale) {
  return fetchAuthorized(`${baseUrl}/topics/?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
}

function fetchTopicResources(topicId, locale, relevance) {
  return fetchAuthorized(
    `${baseUrl}/topics/${topicId}/resources/?language=${locale}&relevance=${relevance}`,
  ).then(resolveJsonOrRejectWithError);
}

function addTopic(body) {
  return fetchAuthorized(`${baseUrl}/topics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(resolveJsonOrRejectWithError);
}

export { fetchTopics, fetchTopicResources, addTopic };
