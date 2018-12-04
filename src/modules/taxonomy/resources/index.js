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
import {
  resolveTaxonomyJsonOrRejectWithError,
  fetchTopicArticle,
  queryResources,
} from '..';

const baseUrl = apiResourceUrl('/taxonomy/v1');

function fetchResource(id, locale) {
  return fetchAuthorized(`${baseUrl}/resources/${id}?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
}

function fetchFullResource(id, locale) {
  return fetchAuthorized(
    `${baseUrl}/resources/${id}/full?language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
}

function createResource(resource) {
  return fetchAuthorized(`${baseUrl}/resources`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(resource),
  }).then(resolveTaxonomyJsonOrRejectWithError);
}

function fetchResourceResourceType(id, locale) {
  return fetchAuthorized(
    `${baseUrl}/resources/${id}/resource-types?language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
}

function fetchResourceFilter(id, locale) {
  return fetchAuthorized(
    `${baseUrl}/resources/${id}/filters?language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
}

function updateResourceRelevance(resourceFilterId, relevance) {
  return fetchAuthorized(`${baseUrl}/resource-filters/${resourceFilterId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify({ relevanceId: relevance }),
  }).then(resolveTaxonomyJsonOrRejectWithError);
}

// TODO: Rewrite once adjusted/updated taxonomy-API is available
/* function fetchTopicResource(id, locale) {
  return fetchAuthorized(
    `${baseUrl}/resources/${id}/topics?language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
}
 */

async function getResourceId({ articleId, language }) {
  let resourceId = '';
  const resource = await queryResources(articleId, language);
  if (resource.length > 0) {
    if (resource.length > 1)
      throw new Error(
        'More than one resource with this articleId, unable to process taxonomy',
      );
    resourceId = resource[0].id;
  }
  return resourceId;
}

async function getFullResource(resourceId, language) {
  const { resourceTypes, filters, parentTopics } = await fetchFullResource(
    resourceId,
    language,
  );

  const topics = await Promise.all(
    // Need to fetch each topic seperate because path is not returned in parentTopics
    parentTopics.map(async item => {
      const topicArticle = await fetchTopicArticle(item.id, language);
      return {
        ...topicArticle,
        primary: item.isPrimary,
        connectionId: item.connectionId,
      };
    }),
  );
  return {
    resourceTypes,
    filters,
    topics,
  };
}

export {
  fetchResource,
  createResource,
  fetchResourceResourceType,
  fetchResourceFilter,
  updateResourceRelevance,
  fetchFullResource,
  getFullResource,
  getResourceId,
  // fetchTopicResource,
};
