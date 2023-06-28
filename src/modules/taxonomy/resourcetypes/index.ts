/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ResourceType } from '@ndla/types-taxonomy';
import { apiResourceUrl, httpFunctions } from '../../../util/apiHelpers';
import { taxonomyApi } from '../../../config';
import { ResourceResourceType } from '../taxonomyApiInterfaces';
import {
  resolveLocation,
  resolveVoidOrRejectWithError,
} from '../../../util/resolveJsonOrRejectWithError';
import { WithTaxonomyVersion } from '../../../interfaces';
import { ResourceResourceTypePostBody } from './resourceTypesApiInterfaces';

const resourceTypesUrl = apiResourceUrl(`${taxonomyApi}/resource-types`);
const resourceResourceTypesUrl = apiResourceUrl(`${taxonomyApi}/resource-resourcetypes`);

const { fetchAndResolve, postAndResolve, deleteAndResolve } = httpFunctions;

interface ResourceTypesGetParams extends WithTaxonomyVersion {
  language: string;
}

export const fetchAllResourceTypes = ({
  language,
  taxonomyVersion,
}: ResourceTypesGetParams): Promise<ResourceType[]> => {
  return fetchAndResolve({ url: resourceTypesUrl, taxonomyVersion, queryParams: { language } });
};

interface ResourceTypeGetParams extends WithTaxonomyVersion {
  id: string;
  language: string;
}

export const fetchResourceType = ({
  id,
  language,
  taxonomyVersion,
}: ResourceTypeGetParams): Promise<ResourceType> => {
  return fetchAndResolve({
    url: `${resourceTypesUrl}/${id}`,
    queryParams: { language },
    taxonomyVersion,
  });
};

export interface ResourceResourceTypePostParams extends WithTaxonomyVersion {
  body: ResourceResourceTypePostBody;
}

export const createResourceResourceType = ({
  body,
  taxonomyVersion,
}: ResourceResourceTypePostParams): Promise<string> => {
  return postAndResolve({
    url: resourceResourceTypesUrl,
    body: JSON.stringify(body),
    taxonomyVersion,
    alternateResolve: resolveLocation,
  });
};

interface ResourceResourceTypeDeleteParams extends WithTaxonomyVersion {
  id: string;
}

const deleteResourceResourceType = ({
  id,
  taxonomyVersion,
}: ResourceResourceTypeDeleteParams): Promise<void> => {
  return deleteAndResolve({
    url: `${resourceResourceTypesUrl}/${id}`,
    taxonomyVersion,
    alternateResolve: resolveVoidOrRejectWithError,
  });
};

interface CreateDeleteResourceTypesParams extends WithTaxonomyVersion {
  resourceId: string;
  resourceTypes: ResourceResourceType[];
  originalResourceTypes: ResourceResourceType[];
}

export const sortIntoCreateDeleteUpdate = <T extends { id: string }>({
  changedItems,
  originalItems,
  updateProperties = [],
}: {
  changedItems: T[];
  originalItems: T[];
  updateProperties?: Array<keyof T>;
}) => {
  const updateItems: T[] = [];
  const createItems: T[] = [];
  const deleteItems = originalItems.filter((item) => {
    const originalItemInChangedItem = changedItems.find(
      (changedItem) => changedItem.id === item.id,
    );
    return !originalItemInChangedItem;
  });
  changedItems.forEach((changedItem) => {
    const foundItem = originalItems.find((item) => item.id === changedItem.id);
    if (foundItem) {
      updateProperties.forEach((updateProperty) => {
        if (foundItem[updateProperty] !== changedItem[updateProperty]) {
          updateItems.push({
            ...foundItem,
            [updateProperty]: changedItem[updateProperty],
          });
        }
      });
    } else {
      createItems.push(changedItem);
    }
  });

  return [createItems, deleteItems, updateItems];
};

export const createDeleteResourceTypes = async ({
  resourceId,
  resourceTypes,
  originalResourceTypes,
  taxonomyVersion,
}: CreateDeleteResourceTypesParams): Promise<void> => {
  const [createItems, deleteItems]: ResourceResourceType[][] = sortIntoCreateDeleteUpdate({
    changedItems: resourceTypes,
    originalItems: originalResourceTypes,
  });
  await Promise.all(
    createItems.map((item) =>
      createResourceResourceType({
        body: {
          resourceTypeId: item.id,
          resourceId,
        },
        taxonomyVersion,
      }),
    ),
  );
  deleteItems.forEach((item) => {
    deleteResourceResourceType({ id: item.connectionId, taxonomyVersion });
  });
};
