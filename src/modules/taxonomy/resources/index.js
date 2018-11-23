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
import { resolveTaxonomyJsonOrRejectWithError } from '..';

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
export {
  fetchResource,
  createResource,
  fetchResourceResourceType,
  fetchResourceFilter,
  updateResourceRelevance,
  fetchFullResource,
  // fetchTopicResource,
};
