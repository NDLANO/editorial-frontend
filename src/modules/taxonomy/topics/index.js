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
import { taxonomyApi } from '../../../config';

const baseUrl = apiResourceUrl(taxonomyApi);

const resolveTaxonomyResponse = res => resolveJsonOrRejectWithError(res, { taxonomy: true });

function fetchTopics(language) {
  const lang = language ? `?language=${language}` : '';
  return fetchAuthorized(`${baseUrl}/topics${lang}`).then(resolveJsonOrRejectWithError);
}

function fetchTopic(id, language) {
  const lang = language ? `?language=${language}` : '';
  return fetchAuthorized(`${baseUrl}/topics/${id}${lang}`).then(resolveJsonOrRejectWithError);
}

function fetchTopicResourceTypes(language) {
  const lang = language ? `?language=${language}` : '';
  return fetchAuthorized(`${baseUrl}/topic-resourcetypes/${lang}`).then(
    resolveJsonOrRejectWithError,
  );
}

function fetchTopicResources(topicId, language, relevance) {
  const query = [];
  if (language) query.push(`language=${language}`);
  if (relevance) query.push(`relevance=${relevance}`);
  return fetchAuthorized(
    `${baseUrl}/topics/${topicId}/resources/${query.length ? `?${query.join('&')}` : ''}`,
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

function fetchTopicConnections(id) {
  return fetchAuthorized(`${baseUrl}/topics/${id}/connections`).then(resolveJsonOrRejectWithError);
}

function updateTopicMetadata(subjectId, body) {
  return fetchAuthorized(`${baseUrl}/topics/${subjectId}/metadata`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(res => resolveJsonOrRejectWithError(res, { taxonomy: true }));
}

function updateTopicMetadataRecursive(subjectId, body) {
  return fetchAuthorized(
    `${baseUrl}/topics/${subjectId}/metadata-recursive?applyToResources=true`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    },
  ).then(res => resolveJsonOrRejectWithError(res, { taxonomy: true }));
}

export {
  fetchTopics,
  fetchTopic,
  addTopic,
  updateTopic,
  deleteTopic,
  addTopicToTopic,
  deleteTopicConnection,
  deleteSubTopicConnection,
  fetchTopicResources,
  fetchTopicConnections,
  updateTopicSubtopic,
  fetchTopicResourceTypes,
  updateTopicMetadata,
  updateTopicMetadataRecursive,
};
