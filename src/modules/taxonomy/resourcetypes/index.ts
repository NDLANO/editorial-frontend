/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { apiResourceUrl, httpFunctions } from '../../../util/apiHelpers';
import { sortIntoCreateDeleteUpdate } from '../../../util/taxonomyHelpers';
import { taxonomyApi } from '../../../config';
import { ResourceResourceType, ResourceType } from '../taxonomyApiInterfaces';
import {
  resolveLocation,
  resolveVoidOrRejectWithError,
} from '../../../util/resolveJsonOrRejectWithError';
import { useResourceType } from './resourceTypesQueries';
import { WithTaxonomyVersion } from '../../../interfaces';
import { ResourceResourceTypePostBody } from './resourceTypesApiInterfaces';

const resourceTypesUrl = apiResourceUrl(`${taxonomyApi}/resource-types`);
const resourceResourceTypesUrl = apiResourceUrl(`${taxonomyApi}/resource-resourcetypes`);

const { fetchAndResolve, postAndResolve, deleteAndResolve } = httpFunctions;

interface ResourceTypesGetParams extends WithTaxonomyVersion {
  language: string;
}

const fetchAllResourceTypes = ({
  language,
  taxonomyVersion,
}: ResourceTypesGetParams): Promise<ResourceType[]> => {
  return fetchAndResolve({ url: resourceTypesUrl, taxonomyVersion, queryParams: { language } });
};

interface ResourceTypeGetParams extends WithTaxonomyVersion {
  id: string;
  language: string;
}

const fetchResourceType = ({
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

interface ResourceResourceTypePostParams extends WithTaxonomyVersion {
  body: ResourceResourceTypePostBody;
}

const createResourceResourceType = ({
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

const createDeleteResourceTypes = async ({
  resourceId,
  resourceTypes,
  originalResourceTypes,
  taxonomyVersion,
}: CreateDeleteResourceTypesParams): Promise<void> => {
  try {
    const [createItems, deleteItems]: ResourceResourceType[][] = sortIntoCreateDeleteUpdate({
      changedItems: resourceTypes,
      originalItems: originalResourceTypes,
    });

    await Promise.all(
      createItems.map(item =>
        createResourceResourceType({
          body: {
            resourceTypeId: item.id,
            resourceId,
          },
          taxonomyVersion,
        }),
      ),
    );

    deleteItems.forEach(item => {
      deleteResourceResourceType({ id: item.connectionId, taxonomyVersion });
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
