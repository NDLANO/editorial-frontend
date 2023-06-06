/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ResourceResourceType, Metadata } from '@ndla/types-taxonomy';
import { apiResourceUrl, httpFunctions } from '../../../util/apiHelpers';
import { taxonomyApi } from '../../../config';
import { Resource, ResourceWithParentTopics, Topic } from '../taxonomyApiInterfaces';
import { resolveLocation } from '../../../util/resolveJsonOrRejectWithError';
import { WithTaxonomyVersion } from '../../../interfaces';
import { ResourcePostBody } from './resourceApiInterfaces';

const baseUrl = apiResourceUrl(taxonomyApi);
const resourcesUrl = apiResourceUrl(`${taxonomyApi}/resources`);

const { fetchAndResolve, postAndResolve, putAndResolve } = httpFunctions;

interface ResourceGetParams extends WithTaxonomyVersion {
  id: string;
  language?: string;
}
export const fetchResource = ({
  id,
  language,
  taxonomyVersion,
}: ResourceGetParams): Promise<Resource> => {
  return fetchAndResolve({
    url: `${resourcesUrl}/${id}`,
    taxonomyVersion,
    queryParams: { language },
  });
};

interface FullResourceGetParams extends WithTaxonomyVersion {
  id: string;
  language?: string;
}

export const fetchFullResource = ({
  id,
  language,
  taxonomyVersion,
}: FullResourceGetParams): Promise<ResourceWithParentTopics> => {
  return fetchAndResolve({
    url: `${resourcesUrl}/${id}/full`,
    taxonomyVersion,
    queryParams: { language },
  });
};

interface ResourcePostParams extends WithTaxonomyVersion {
  body: ResourcePostBody;
}

export const createResource = ({ body, taxonomyVersion }: ResourcePostParams): Promise<string> => {
  return postAndResolve({
    url: resourcesUrl,
    body: JSON.stringify(body),
    taxonomyVersion,
    alternateResolve: resolveLocation,
  });
};

interface ResourceResourceTypeGetParams extends WithTaxonomyVersion {
  id: string;
  language?: string;
}

export const fetchResourceResourceType = ({
  id,
  language,
  taxonomyVersion,
}: ResourceResourceTypeGetParams): Promise<ResourceResourceType[]> => {
  return fetchAndResolve({
    url: `${resourcesUrl}/${id}/resource-types`,
    taxonomyVersion,
    queryParams: { language },
  });
};

interface ResourceMetadataPutParams extends WithTaxonomyVersion {
  resourceId: string;
  body: Partial<Metadata>;
}

export const updateResourceMetadata = ({
  resourceId,
  body,
  taxonomyVersion,
}: ResourceMetadataPutParams): Promise<Metadata> => {
  return putAndResolve({
    url: `${resourcesUrl}/${resourceId}/metadata`,
    body: JSON.stringify(body),
    taxonomyVersion,
  });
};

interface ResourceIdParams extends WithTaxonomyVersion {
  id: number;
  language: string;
}

export async function getResourceId({
  id,
  language,
  taxonomyVersion,
}: ResourceIdParams): Promise<string> {
  let resourceId = '';
  const resource = await queryResources({ contentId: id, language, taxonomyVersion });
  if (resource.length > 0) {
    if (resource.length > 1)
      throw new Error('More than one resource with this articleId, unable to process taxonomy');
    resourceId = resource[0].id;
  }
  return resourceId;
}

interface ResourcesQueryParams extends WithTaxonomyVersion {
  contentId: number;
  language: string;
  contentType?: string;
}

export const queryResources = ({
  contentId,
  language,
  contentType = 'article',
  taxonomyVersion,
}: ResourcesQueryParams): Promise<Resource[]> => {
  return fetchAndResolve({
    url: resourcesUrl,
    taxonomyVersion,
    queryParams: {
      language,
      contentURI: `urn:${contentType}:${contentId}`,
    },
  });
};

interface TopicsQueryParams extends WithTaxonomyVersion {
  contentId: number;
  language: string;
  contentType?: string;
}

export const queryTopics = ({
  contentId,
  language,
  contentType = 'article',
  taxonomyVersion,
}: TopicsQueryParams): Promise<Topic[]> => {
  return fetchAndResolve({
    url: `${baseUrl}/topics`,
    taxonomyVersion,
    queryParams: {
      language,
      contentURI: `urn:${contentType}:${contentId}`,
    },
  });
};

interface LearningpathResourceQueryParams extends WithTaxonomyVersion {
  learningpathId: number;
}

export const queryLearningPathResource = ({
  learningpathId,
  taxonomyVersion,
}: LearningpathResourceQueryParams): Promise<Resource[]> => {
  return fetchAndResolve({
    url: resourcesUrl,
    taxonomyVersion,
    queryParams: {
      contentURI: `urn:learningpath:${learningpathId}`,
    },
  });
};

interface CloneResourceParams extends WithTaxonomyVersion {
  id: string;
  body: {
    contentUri?: string;
    name: string;
    id?: string;
  };
}

export const cloneResource = ({
  id,
  body,
  taxonomyVersion,
}: CloneResourceParams): Promise<string> => {
  return postAndResolve({
    url: `${resourcesUrl}/${id}/clone`,
    taxonomyVersion,
    body: JSON.stringify(body),
    alternateResolve: resolveLocation,
  });
};
