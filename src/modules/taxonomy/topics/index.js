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
const resolveTaxonomyResponse = res => resolveJsonOrRejectWithError(res, true);

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

function fetchTopicResources(topicId, locale, relevance, filters) {
  const query = [];
  if (locale) query.push(`language=${locale}`);
  if (relevance) query.push(`relevance=${relevance}`);
  if (filters) query.push(`filters=${filters}`);
  return fetchAuthorized(
    `${baseUrl}/topics/${topicId}/resources/${
      query.length ? `?${query.join('&')}` : ''
    }`,
  ).then(resolveJsonOrRejectWithError);
}

function addTopic(body) {
  return fetchAuthorized(`${baseUrl}/topics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  }).then(resolveTaxonomyResponse);
}

function updateTopic({ id, ...params }) {
  return fetchAuthorized(`${baseUrl}/topics/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ ...params }),
  }).then(resolveTaxonomyResponse);
}

function deleteTopic(id) {
  return fetchAuthorized(`${baseUrl}/topics/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  }).then(resolveTaxonomyResponse);
}

function addTopicToTopic(body) {
  return fetchAuthorized(`${baseUrl}/topic-subtopics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(resolveTaxonomyResponse);
}

function updateTopicSubtopic(connectionId, body) {
  return fetchAuthorized(`${baseUrl}/topic-subtopics/${connectionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(resolveTaxonomyResponse);
}

function deleteTopicConnection(id) {
  return fetchAuthorized(`${baseUrl}/subject-topics/${id}`, {
    method: 'DELETE',
  }).then(resolveTaxonomyResponse);
}

function deleteSubTopicConnection(id) {
  return fetchAuthorized(`${baseUrl}/topic-subtopics/${id}`, {
    method: 'DELETE',
  }).then(resolveTaxonomyResponse);
}

function addFilterToTopic({
  filterId,
  relevanceId = 'urn:relevance:core',
  topicId,
}) {
  return fetchAuthorized(`${baseUrl}/topic-filters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ filterId, relevanceId, topicId }),
  }).then(resolveTaxonomyResponse);
}

function updateTopicFilter({ connectionId, relevanceId }) {
  return fetchAuthorized(`${baseUrl}/topic-filters/${connectionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ relevanceId }),
  }).then(resolveTaxonomyResponse);
}

function deleteTopicFilter({ connectionId }) {
  return fetchAuthorized(`${baseUrl}/topic-filters/${connectionId}`, {
    method: 'DELETE',
  }).then(resolveTaxonomyResponse);
}

function fetchTopicConnections(id) {
  return fetchAuthorized(`${baseUrl}/topics/${id}/connections`).then(
    resolveJsonOrRejectWithError,
  );
}

export {
  fetchTopics,
  addTopic,
  updateTopic,
  deleteTopic,
  addTopicToTopic,
  deleteTopicConnection,
  deleteSubTopicConnection,
  fetchTopicFilters,
  addFilterToTopic,
  updateTopicFilter,
  deleteTopicFilter,
  fetchTopicResources,
  fetchTopicConnections,
  updateTopicSubtopic,
};
