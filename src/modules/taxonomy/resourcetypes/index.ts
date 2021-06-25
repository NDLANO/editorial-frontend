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
import { taxonomyApi } from '../../../config';
import { ResourceResourceType, ResourceType } from '../taxonomyApiInterfaces';

const baseUrl = apiResourceUrl(taxonomyApi);

const fetchAllResourceTypes = async (language: string): Promise<ResourceType[]> => {
  return await fetchAuthorized(`${baseUrl}/resource-types/?language=${language}`).then(
    resolveJsonOrRejectWithError,
  );
};

const fetchResourceType = async (id: string, locale: string): Promise<ResourceType> => {
  return await fetchAuthorized(`${baseUrl}/resource-types/${id}?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
};

const createResourceResourceType = async (resourceType: {
  resourceId: string;
  resourceTypeId: string;
}): Promise<string> => {
  return await fetchAuthorized(`${baseUrl}/resource-resourcetypes`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(resourceType),
  }).then(resolveTaxonomyJsonOrRejectWithError);
};

const deleteResourceResourceType = async (id: string): Promise<void> => {
  return await fetchAuthorized(`${baseUrl}/resource-resourcetypes/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  }).then(resolveJsonOrRejectWithError);
};

const createDeleteResourceTypes = async (
  resourceId: string,
  resourceTypes: ResourceResourceType[],
  originalResourceTypes: ResourceResourceType[],
): Promise<void> => {
  try {
    const [createItems, deleteItems]: ResourceResourceType[][] = sortIntoCreateDeleteUpdate({
      changedItems: resourceTypes,
      originalItems: originalResourceTypes,
    });

    await Promise.all(
      createItems.map(item =>
        createResourceResourceType({
          resourceTypeId: item.id,
          resourceId,
        }),
      ),
    );

    deleteItems.forEach(item => {
      deleteResourceResourceType(item.connectionId);
    });
  } catch (e) {
    throw new Error(e);
  }
};

export {
  fetchAllResourceTypes,
  fetchResourceType,
  createResourceResourceType,
  createDeleteResourceTypes,
};
