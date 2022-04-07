/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import { apiResourceUrl, httpFunctions } from '../../../util/apiHelpers';
import { taxonomyApi } from '../../../config';
import {
  Resource,
  ResourceResourceType,
  ResourceTranslation,
  ResourceWithParentTopics,
  TaxonomyMetadata,
  Topic,
} from '../taxonomyApiInterfaces';
import {
  resolveLocation,
  resolveVoidOrRejectWithError,
} from '../../../util/resolveJsonOrRejectWithError';
import { WithTaxonomyVersion } from '../../../interfaces';
import { ResourcePostBody, ResourceTranslationPostBody } from './resourceApiInterfaces';

const baseUrl = apiResourceUrl(taxonomyApi);
const resourcesUrl = apiResourceUrl(`${taxonomyApi}/resources`);

const { fetchAndResolve, postAndResolve, putAndResolve } = httpFunctions;

const stringifyQuery = (object: Record<string, any> = {}) => {
  const stringified = `?${queryString.stringify(object)}`;
  return stringified === '?' ? '' : stringified;
};

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
    url: `${resourcesUrl}/${id}${stringifyQuery({ language })}`,
    taxonomyVersion,
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
    url: `${resourcesUrl}/${id}/full${stringifyQuery({ language })}`,
    taxonomyVersion,
  });
};

interface ResourcePostParams extends WithTaxonomyVersion {
  body: ResourcePostBody;
}

export const createResource = ({ body, taxonomyVersion }: ResourcePostParams): Promise<string> => {
  return postAndResolve({
    url: resourcesUrl,
    body,
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
    url: `${resourcesUrl}/${id}/resource-types${stringifyQuery({ language })}`,
    taxonomyVersion,
  });
};

interface ResourceMetadataPutParams extends WithTaxonomyVersion {
  resourceId: string;
  body: Partial<TaxonomyMetadata>;
}

export const updateResourceMetadata = ({
  resourceId,
  body,
  taxonomyVersion,
}: ResourceMetadataPutParams): Promise<TaxonomyMetadata> => {
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
    url: `${resourcesUrl}${stringifyQuery({
      language,
      contentURI: encodeURIComponent(`urn:${contentType}:${contentId}`),
    })}`,
    taxonomyVersion,
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
    url: `${baseUrl}/topics${stringifyQuery({
      language,
      contentURI: encodeURIComponent(`urn:${contentType}:${contentId}`),
    })}`,
    taxonomyVersion,
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
    url: `${resourcesUrl}${encodeURIComponent(`urn:learningpath:${learningpathId}`)}`,
    taxonomyVersion,
  });
};

interface QueryContentParams extends WithTaxonomyVersion {
  contentId: number;
  language: string;
  contentType?: string;
}

export async function queryContent({
  contentId,
  language,
  contentType,
  taxonomyVersion,
}: QueryContentParams) {
  const resources = await queryResources({ contentId, language, contentType, taxonomyVersion });

  if (resources[0]) {
    return resources[0];
  }

  const topics = await queryTopics({ contentId, language, contentType, taxonomyVersion });

  if (topics[0]) {
    // Add resourceType so that content type is correct
    return { ...topics[0], resourceTypes: [{ id: 'subject' }] };
  }
  return undefined;
}

interface ResourceTranslationsGetParams extends WithTaxonomyVersion {
  id: string;
}

export const fetchResourceTranslations = ({
  id,
  taxonomyVersion,
}: ResourceTranslationsGetParams): Promise<ResourceTranslation[]> => {
  return fetchAndResolve({ url: `${resourcesUrl}/${id}/translations`, taxonomyVersion });
};

interface ResourceTranslationPutParams extends WithTaxonomyVersion {
  id: string;
  language: string;
  body: ResourceTranslationPostBody;
}

export const setResourceTranslation = ({
  id,
  language,
  body,
  taxonomyVersion,
}: ResourceTranslationPutParams): Promise<void> => {
  return putAndResolve({
    url: `${resourcesUrl}/${id}/translations/${language}`,
    taxonomyVersion,
    body: JSON.stringify(body),
    alternateResolve: resolveVoidOrRejectWithError,
  });
};
