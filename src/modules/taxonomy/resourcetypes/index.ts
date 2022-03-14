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
import { taxonomyApi } from '../../../config';
import { ResourceResourceType, ResourceType } from '../taxonomyApiInterfaces';
import {
  resolveLocation,
  resolveVoidOrRejectWithError,
} from '../../../util/resolveJsonOrRejectWithError';
import { useResourceType } from './resourceTypesQueries';

const baseUrl = apiResourceUrl(taxonomyApi);

const fetchAllResourceTypes = (language: string): Promise<ResourceType[]> => {
  return fetchAuthorized(`${baseUrl}/resource-types/?language=${language}`, {
    headers: { VersionHash: 'default' },
  }).then(r => resolveJsonOrRejectWithError<ResourceType[]>(r));
};

const fetchResourceType = (id: string, locale: string): Promise<ResourceType> => {
  return fetchAuthorized(`${baseUrl}/resource-types/${id}?language=${locale}`, {
    headers: { VersionHash: 'default' },
  }).then(r => resolveJsonOrRejectWithError<ResourceType>(r));
};

const createResourceResourceType = (resourceType: {
  resourceId: string;
  resourceTypeId: string;
}): Promise<string> => {
  return fetchAuthorized(`${baseUrl}/resource-resourcetypes`, {
    headers: {
      'Content-Type': 'application/json',
      VersionHash: 'default',
    },
    method: 'POST',
    body: JSON.stringify(resourceType),
  }).then(resolveLocation);
};

const deleteResourceResourceType = (id: string): Promise<void> => {
  return fetchAuthorized(`${baseUrl}/resource-resourcetypes/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      VersionHash: 'default',
    },
    method: 'DELETE',
  }).then(resolveVoidOrRejectWithError);
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
  useResourceType,
};
