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
  return fetchAuthorized(`${baseUrl}/resources/${id}?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
}

function createResource(resource) {
  return fetchAuthorized(`${baseUrl}/resources`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(resource),
  }).then(resolveJsonOrRejectWithError);
}

function updateResource(id, resource) {
  return fetchAuthorized(`${baseUrl}/resource-resourcetypes/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(resource),
  }).then(resolveJsonOrRejectWithError);
}

function fetchResourceResourceType(id, locale) {
  return fetchAuthorized(
    `${baseUrl}/resources/${id}/resource-types?language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
}

function createResourceResourceType(resourceType) {
  return fetchAuthorized(`${baseUrl}/resource-resourcetypes`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(resourceType),
  }).then(resolveJsonOrRejectWithError);
}

function updateResourceResourceType(id, resourceType) {
  return fetchAuthorized(`${baseUrl}/resource-resourcetypes/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(resourceType),
  }).then(resolveJsonOrRejectWithError);
}

function fetchResourceFilter(id, locale) {
  return fetchAuthorized(
    `${baseUrl}/resources/${id}/filters?language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
}

function createResourceFilter(resourceType) {
  return fetchAuthorized(`${baseUrl}/resource-filters`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(resourceType),
  }).then(resolveJsonOrRejectWithError);
}

function updateResourceFilter(id, resourceType) {
  return fetchAuthorized(`${baseUrl}/resource-filters/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(resourceType),
  }).then(resolveJsonOrRejectWithError);
}

function fetchTopicResource(id, locale) {
  return fetchAuthorized(
    `${baseUrl}/topic-resources/${id}?language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
}

function createTopicResource(resourceType) {
  return fetchAuthorized(`${baseUrl}/topic-resources`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(resourceType),
  }).then(resolveJsonOrRejectWithError);
}

function updateTopicResource(id, resourceType) {
  return fetchAuthorized(`${baseUrl}/topic-resources/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
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

function fetchRelevances(locale) {
  return fetchAuthorized(`${baseUrl}/relevances/?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
}

function queryResources(articleId, language) {
  return fetchAuthorized(
    `${baseUrl}/queries/resources/?contentURI=${encodeURIComponent(
      `urn:article:${articleId}`,
    )}&?language=${language}`,
  ).then(resolveJsonOrRejectWithError);
}

/* Taxonomy actions */

async function updateTaxonomy(taxonomy) {
  try {
    let resource = await queryResources(taxonomy.articleId, taxonomy.language);

    if (resource.length === 0) {
      const resourceId = await createResource({
        contentUri: `urn:article:${taxonomy.articleId}`,
        name: taxonomy.articleName,
      });
      resource = [{ id: resourceId }]; // Temporary until API changes to return representation
    }

    if (taxonomy.resourceTypes) {
      taxonomy.resourceTypes.forEach(async item => {
        const resourceTypesId = await createResourceResourceType({
          resourceTypeId: item.id,
          resourceId: resource[0].id,
        });
        console.log(resourceTypesId);
      });
    }

    if (taxonomy.filter) {
      taxonomy.filter.forEach(async item => {
        const resourceFilterId = await createResourceFilter({
          filterId: item.id,
          resourceId: resource[0].id,
          relevanceId: item.relevanceId,
        });
        console.log(resourceFilterId);
      });
    }

    if (taxonomy.topics) {
      taxonomy.topics.forEach(async item => {
        const resourceTopicsId = await createTopicResource({
          topicid: item.id,
          primary: item.primary,
          resourceid: resource[0].id,
        });
        console.log(resourceTopicsId);
      });
    }
  } catch (e) {
    throw new Error(e);
  }
}

export {
  fetchResourceTypes,
  fetchResource,
  createResource,
  updateResource,
  fetchResourceResourceType,
  createResourceResourceType,
  updateResourceResourceType,
  fetchResourceFilter,
  createResourceFilter,
  updateResourceFilter,
  fetchFilters,
  fetchTopics,
  fetchTopicArticle,
  fetchTopicResource,
  createTopicResource,
  updateTopicResource,
  fetchRelevances,
  queryResources,
  updateTaxonomy,
};
