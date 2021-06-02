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
import { resolveTaxonomyJsonOrRejectWithError } from '../helpers';
import { fetchTopic } from '../topics';
import { taxonomyApi } from '../../../config';

const baseUrl = apiResourceUrl(taxonomyApi);

export function fetchResource(id, language) {
  const lang = language ? `?language=${language}` : '';
  return fetchAuthorized(`${baseUrl}/resources/${id}${lang}`).then(resolveJsonOrRejectWithError);
}

export function fetchFullResource(id, language) {
  const lang = language ? `?language=${language}` : '';
  return fetchAuthorized(`${baseUrl}/resources/${id}/full${lang}`).then(
    resolveJsonOrRejectWithError,
  );
}

export function createResource(resource) {
  return fetchAuthorized(`${baseUrl}/resources`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(resource),
  }).then(resolveTaxonomyJsonOrRejectWithError);
}

export function fetchResourceResourceType(id, language) {
  const lang = language ? `?language=${language}` : '';
  return fetchAuthorized(`${baseUrl}/resources/${id}/resource-types/${lang}`).then(
    resolveJsonOrRejectWithError,
  );
}

export function fetchResourceFilter(id, language) {
  const lang = language ? `?language=${language}` : '';
  return fetchAuthorized(`${baseUrl}/resources/${id}/filters${lang}`).then(
    resolveJsonOrRejectWithError,
  );
}

export function fetchResourceMetadata(id) {
  return fetchAuthorized(`${baseUrl}/resources/${id}/metadata`).then(resolveJsonOrRejectWithError);
}

export function addFilterToResource({ filterId, relevanceId = 'urn:relevance:core', resourceId }) {
  return fetchAuthorized(`${baseUrl}/resource-filters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ filterId, relevanceId, resourceId }),
  }).then(resolveTaxonomyJsonOrRejectWithError);
}

export function updateResourceRelevance(resourceFilterId, relevance) {
  return fetchAuthorized(`${baseUrl}/resource-filters/${resourceFilterId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify({ relevanceId: relevance }),
  }).then(resolveTaxonomyJsonOrRejectWithError);
}

export function updateResourceMetadata(resourceId, body) {
  return fetchAuthorized(`${baseUrl}/resources/${resourceId}/metadata`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(resolveJsonOrRejectWithError);
}

// TODO: Rewrite once adjusted/updated taxonomy-API is available
/* function fetchTopicResource(id, locale) {
  return fetchAuthorized(
    `${baseUrl}/resources/${id}/topics?language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
}
 */

export async function getResourceId({ id, language }) {
  let resourceId = '';
  const resource = await queryResources(id, language);
  if (resource.length > 0) {
    if (resource.length > 1)
      throw new Error('More than one resource with this articleId, unable to process taxonomy');
    resourceId = resource[0].id;
  }
  return resourceId;
}

export async function getFullResource(resourceId, language) {
  const { resourceTypes, parentTopics, metadata } = await fetchFullResource(resourceId, language);

  const topics = await Promise.all(
    // Need to fetch each topic seperate because path is not returned in parentTopics
    parentTopics
      .filter(pt => pt.path)
      .map(async item => {
        const topicArticle = await fetchTopic(item.id, language);
        return {
          ...topicArticle,
          primary: item.isPrimary,
          connectionId: item.connectionId,
        };
      }),
  );
  return {
    resourceTypes,
    metadata,
    topics,
  };
}

export function queryResources(contentId, language, contentType = 'article') {
  return fetchAuthorized(
    `${baseUrl}/resources/?contentURI=${encodeURIComponent(
      `urn:${contentType}:${contentId}`,
    )}&language=${language}`,
  ).then(resolveJsonOrRejectWithError);
}

export function queryTopics(contentId, language, contentType = 'article') {
  return fetchAuthorized(
    `${baseUrl}/topics/?contentURI=${encodeURIComponent(
      `urn:${contentType}:${contentId}`,
    )}&language=${language}`,
  ).then(resolveJsonOrRejectWithError);
}

export function queryLearningPathResource(learningpathId) {
  return fetchAuthorized(
    `${baseUrl}/resources/?contentURI=${encodeURIComponent(`urn:learningpath:${learningpathId}`)}`,
  ).then(resolveJsonOrRejectWithError);
}

export async function queryContent(id, language, contentType) {
  const resources = await queryResources(id, language, contentType);

  if (resources[0]) {
    return resources[0];
  }

  const topics = await queryTopics(id, language, contentType);

  if (topics[0]) {
    // Add resourceType so that content type is correct
    return { ...topics[0], resourceTypes: [{ id: 'subject' }] };
  }
  return undefined;
}

export const fetchResourceTranslations = id => {
  return fetchAuthorized(`${baseUrl}/resources/${id}/translations`).then(
    resolveTaxonomyJsonOrRejectWithError,
  );
};

export const setResourceTranslation = (id, language, body) => {
  const url = `${baseUrl}/resources/${id}/translations/${language}`;
  return fetchAuthorized(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(body),
  }).then(resolveTaxonomyJsonOrRejectWithError);
};
