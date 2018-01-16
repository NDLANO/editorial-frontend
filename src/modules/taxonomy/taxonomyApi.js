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

const baseUrl = apiResourceUrl('/taxonomy/v1');

function fetchResourceTypes(locale) {
  return fetchAuthorized(`${baseUrl}/resource-types/?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
}

function fetchResource(id, locale) {
  return fetchAuthorized(`${baseUrl}/resource/${id}?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
}

function createResource(resource) {
  return fetchAuthorized(`${baseUrl}/resource`, {
    method: 'POST',
    body: JSON.stringify(resource),
  }).then(resolveJsonOrRejectWithError);
}

function updateResource(id, resource) {
  return fetchAuthorized(`${baseUrl}/resource-resourcetypes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(resource),
  }).then(resolveJsonOrRejectWithError);
}

function fetchResourceResourceType(id, locale) {
  return fetchAuthorized(
    `${baseUrl}/resource-resourcetypes/${id}?language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
}

function createResourceResourceType(resourceType) {
  return fetchAuthorized(`${baseUrl}/resource-resourcetypes`, {
    method: 'POST',
    body: JSON.stringify(resourceType),
  }).then(resolveJsonOrRejectWithError);
}

function updateResourceResourceType(id, resourceType) {
  return fetchAuthorized(`${baseUrl}/resource-resourcetypes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(resourceType),
  }).then(resolveJsonOrRejectWithError);
}

function fetchResourceFilters(id, locale) {
  return fetchAuthorized(
    `${baseUrl}/resource-filters/${id}?language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
}

function createResourceFilters(resourceType) {
  return fetchAuthorized(`${baseUrl}/resource-filters`, {
    method: 'POST',
    body: JSON.stringify(resourceType),
  }).then(resolveJsonOrRejectWithError);
}

function updateResourceFilters(id, resourceType) {
  return fetchAuthorized(`${baseUrl}/resource-filters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(resourceType),
  }).then(resolveJsonOrRejectWithError);
}

function fetchTopicResource(id, locale) {
  return fetchAuthorized(
    `${baseUrl}/topic-resource/${id}?language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
}

function createTopicResource(resourceType) {
  return fetchAuthorized(`${baseUrl}/topic-resource`, {
    method: 'POST',
    body: JSON.stringify(resourceType),
  }).then(resolveJsonOrRejectWithError);
}

function updateTopicResource(id, resourceType) {
  return fetchAuthorized(`${baseUrl}/topic-resource/${id}`, {
    method: 'PUT',
    body: JSON.stringify(resourceType),
  }).then(resolveJsonOrRejectWithError);
}

function fetchFilters(locale) {
  return fetchAuthorized(`${baseUrl}/filters/?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
}

function fetchTopics(locale) {
  return fetchAuthorized(`${baseUrl}/topics/?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
}

function fetchTopicArticle(topicId, locale) {
  return fetchAuthorized(
    `${baseUrl}/topics/${topicId}/?language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
}

function fetchRelevances(topicId, locale) {
  return fetchAuthorized(`${baseUrl}/relevances/?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
}

export {
  fetchResourceTypes,
  fetchResource,
  createResource,
  updateResource,
  fetchResourceResourceType,
  createResourceResourceType,
  updateResourceResourceType,
  fetchResourceFilters,
  createResourceFilters,
  updateResourceFilters,
  fetchFilters,
  fetchTopics,
  fetchTopicArticle,
  fetchTopicResource,
  createTopicResource,
  updateTopicResource,
  fetchRelevances,
};
