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
import { sortIntoCreateDeleteUpdate } from '../../../util/taxonomyHelpers';
import { resolveTaxonomyJsonOrRejectWithError } from '../helpers';

const baseUrl = apiResourceUrl('/taxonomy/v1');

export function createResourceFilter(filter) {
  return fetchAuthorized(`${baseUrl}/resource-filters`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(filter),
  }).then(resolveTaxonomyJsonOrRejectWithError);
}

export function updateResourceFilter(id, filter) {
  return fetchAuthorized(`${baseUrl}/resource-filters/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(filter),
  }).then(resolveJsonOrRejectWithError);
}

export function deleteResourceFilter(id) {
  return fetchAuthorized(`${baseUrl}/resource-filters/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  }).then(resolveJsonOrRejectWithError);
}

export async function createDeleteUpdateFilters(
  resourceId,
  filters,
  originalFilters,
) {
  try {
    const [createItems, deleteItems, updateItems] = sortIntoCreateDeleteUpdate({
      changedItems: filters,
      originalItems: originalFilters,
      updateProperty: 'relevanceId',
    });
    await Promise.all(
      createItems.map(item =>
        createResourceFilter({
          filterId: item.id,
          relevanceId: item.relevanceId,
          resourceId,
        }),
      ),
    );

    await Promise.all(
      deleteItems.map(item => deleteResourceFilter(item.connectionId)),
    );
    updateItems.forEach(item => {
      updateResourceFilter(item.connectionId, {
        relevanceId: item.relevanceId,
      });
    });
  } catch (e) {
    throw new Error(e);
  }
}

export function fetchSubjectFilter(id, language) {
  return fetchAuthorized(
    `${baseUrl}/filters/${id}?includeMetadata=true&language=${language}`,
  ).then(resolveJsonOrRejectWithError);
}

export function createSubjectFilter(id, name) {
  return fetchAuthorized(`${baseUrl}/filters`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ subjectId: id, name }),
  }).then(resolveTaxonomyJsonOrRejectWithError);
}

export function updateSubjectFilter(id, name, contentUri, subjectId) {
  return fetchAuthorized(`${baseUrl}/filters/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ name, contentUri, subjectId }),
  }).then(res => resolveJsonOrRejectWithError(res, true));
}

export function deleteFilter(id) {
  return fetchAuthorized(`${baseUrl}/filters/${id}`, {
    method: 'DELETE',
  }).then(resolveJsonOrRejectWithError);
}

export function updateFilterMetadata(id, body) {
  return fetchAuthorized(`${baseUrl}/filters/${id}/metadata`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(res => resolveJsonOrRejectWithError(res, true));
}
