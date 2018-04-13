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

function fetchTopicFilters(id) {
  return fetchAuthorized(`${baseUrl}/topics/${id}/filters`).then(
    resolveJsonOrRejectWithError,
  );
}

function addTopic(body) {
  return fetchAuthorized(`${baseUrl}/topics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(resolveJsonOrRejectWithError);
}

function updateTopicName(id, name) {
  return fetchAuthorized(`${baseUrl}/topics/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ name }),
  }).then(res => resolveJsonOrRejectWithError(res, true));
}

function addTopicToTopic(body) {
  return fetchAuthorized(`${baseUrl}/topic-subtopics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(resolveJsonOrRejectWithError);
}

function deleteTopicConnection(id) {
  return fetchAuthorized(`${baseUrl}/subject-topics/${id}`, {
    method: 'DELETE',
  }).then(resolveJsonOrRejectWithError);
}

function deleteSubTopicConnection(id) {
  return fetchAuthorized(`${baseUrl}/topic-subtopics/${id}`, {
    method: 'DELETE',
  }).then(resolveJsonOrRejectWithError);
}

function addFilterToTopic({ filterId, relevanceId, topicId }) {
  return fetchAuthorized(`${baseUrl}/topic-filters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ filterId, relevanceId, topicId }),
  }).then(resolveJsonOrRejectWithError);
}

export {
  fetchTopics,
  addTopic,
  updateTopicName,
  addTopicToTopic,
  deleteTopicConnection,
  deleteSubTopicConnection,
  fetchTopicFilters,
  addFilterToTopic,
};
