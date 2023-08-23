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

export const deleteResourceResourceType = ({
  id,
  taxonomyVersion,
}: ResourceResourceTypeDeleteParams): Promise<void> => {
  return deleteAndResolve({
    url: `${resourceResourceTypesUrl}/${id}`,
    taxonomyVersion,
    alternateResolve: resolveVoidOrRejectWithError,
  });
};
