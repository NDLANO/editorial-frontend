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
import { fetchResourceFilter, resolveTaxonomyJsonOrRejectWithError } from '..';

const baseUrl = apiResourceUrl('/taxonomy/v1');

function createResourceFilter(filter) {
  return fetchAuthorized(`${baseUrl}/resource-filters`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(filter),
  }).then(resolveTaxonomyJsonOrRejectWithError);
}

function updateResourceFilter(id, filter) {
  return fetchAuthorized(`${baseUrl}/resource-filters/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(filter),
  }).then(resolveJsonOrRejectWithError);
}

function deleteResourceFilter(id) {
  return fetchAuthorized(`${baseUrl}/resource-filters/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  }).then(resolveJsonOrRejectWithError);
}

async function createDeleteUpdateFilters(resourceId, filter, language) {
  try {
    const remoteFilter = await fetchResourceFilter(resourceId, language);
    const [createItems, deleteItems, updateItems] = sortIntoCreateDeleteUpdate({
      changedItems: filter,
      originalItems: remoteFilter,
      updateProperty: 'relevanceId',
    });

    createItems.forEach(item => {
      createResourceFilter({
        filterId: item.id,
        relevanceId: item.relevanceId,
        resourceId,
      });
    });
    deleteItems.forEach(item => {
      deleteResourceFilter(item.connectionId);
    });
    updateItems.forEach(item => {
      updateResourceFilter(item.connectionId, {
        relevanceId: item.relevanceId,
      });
    });
  } catch (e) {
    throw new Error(e);
  }
}

function createSubjectFilter(id, name) {
  return fetchAuthorized(`${baseUrl}/filters`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ subjectId: id, name }),
  }).then(resolveTaxonomyJsonOrRejectWithError);
}

function editSubjectFilter(filterId, subjectId, name) {
  return fetchAuthorized(`${baseUrl}/filters/${filterId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify({ subjectId, name }),
  }).then(resolveTaxonomyJsonOrRejectWithError);
}

function deleteFilter(id) {
  return fetchAuthorized(`${baseUrl}/filters/${id}`, {
    method: 'DELETE',
  }).then(resolveJsonOrRejectWithError);
}

export {
  createResourceFilter,
  updateResourceFilter,
  deleteResourceFilter,
  createDeleteUpdateFilters,
  createSubjectFilter,
  editSubjectFilter,
  deleteFilter,
};
