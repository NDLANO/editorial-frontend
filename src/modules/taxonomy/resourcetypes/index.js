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
import {
  fetchResourceResourceType,
  resolveTaxonomyJsonOrRejectWithError,
} from '..';

const baseUrl = apiResourceUrl('/taxonomy/v1');

function fetchAllResourceTypes(locale) {
  return fetchAuthorized(`${baseUrl}/resource-types/?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
}

function createResourceResourceType(resourceType) {
  return fetchAuthorized(`${baseUrl}/resource-resourcetypes`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(resourceType),
  }).then(resolveTaxonomyJsonOrRejectWithError);
}

function deleteResourceResourceType(id) {
  return fetchAuthorized(`${baseUrl}/resource-resourcetypes/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  }).then(resolveJsonOrRejectWithError);
}

async function createDeleteResourceTypes(resourceId, resourceTypes, language) {
  try {
    const remoteResourceTypes = await fetchResourceResourceType(
      resourceId,
      language,
    );
    const [createItems, deleteItems] = sortIntoCreateDeleteUpdate({
      changedItems: resourceTypes,
      originalItems: remoteResourceTypes,
    });

    createItems.forEach(item => {
      createResourceResourceType({
        resourceTypeId: item.id,
        resourceId,
      });
    });

    deleteItems.forEach(item => {
      deleteResourceResourceType(item.connectionId);
    });
  } catch (e) {
    throw new Error(e);
  }
}

export {
  fetchAllResourceTypes,
  createResourceResourceType,
  deleteResourceResourceType,
  createDeleteResourceTypes,
};
