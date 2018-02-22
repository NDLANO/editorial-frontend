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
import { spliceChangedItems } from '../../../util/taxonomyHelpers';
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
    const newFilter = spliceChangedItems(
      filter,
      remoteFilter,
      'id',
      'id',
      'relevanceId',
    );

    newFilter[0].forEach(item => {
      createResourceFilter({
        filterId: item.id,
        relevanceId: item.relevanceId,
        resourceId,
      });
    });
    newFilter[1].forEach(item => {
      deleteResourceFilter(item.connectionId);
    });
    newFilter[2].forEach(item => {
      updateResourceFilter(item.connectionId, {
        relevanceId: item.relevanceId,
      });
    });
  } catch (e) {
    throw new Error(e);
  }
}

export {
  createResourceFilter,
  updateResourceFilter,
  deleteResourceFilter,
  createDeleteUpdateFilters,
};
