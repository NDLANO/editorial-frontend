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
import { resolveTaxonomyJsonOrRejectWithError } from '../helpers';
import { taxonomyApi } from '../../../config';
import {
  ParentTopic,
  Resource,
  ResourceResourceType,
  ResourceTranslation,
  ResourceWithParentTopics,
  TaxonomyMetadata,
  Topic,
} from '../taxonomyApiInterfaces';

const baseUrl = apiResourceUrl(taxonomyApi);

export const fetchResource = async (id: string, language?: string): Promise<Resource> => {
  const lang = language ? `?language=${language}` : '';
  return await fetchAuthorized(`${baseUrl}/resources/${id}${lang}`).then(
    resolveJsonOrRejectWithError,
  );
};

export const fetchFullResource = async (
  id: string,
  language?: string,
): Promise<ResourceWithParentTopics> => {
  const lang = language ? `?language=${language}` : '';
  return await fetchAuthorized(`${baseUrl}/resources/${id}/full${lang}`).then(
    resolveJsonOrRejectWithError,
  );
};

export const createResource = async (resource: {
  id?: string;
  contentUri?: string;
  name: string;
}): Promise<string> => {
  return await fetchAuthorized(`${baseUrl}/resources`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(resource),
  }).then(resolveTaxonomyJsonOrRejectWithError);
};

export const fetchResourceResourceType = async (
  id: string,
  language?: string,
): Promise<ResourceResourceType[]> => {
  const lang = language ? `?language=${language}` : '';
  return await fetchAuthorized(`${baseUrl}/resources/${id}/resource-types/${lang}`).then(
    resolveJsonOrRejectWithError,
  );
};

export const fetchResourceMetadata = async (id: string): Promise<TaxonomyMetadata> => {
  return await fetchAuthorized(`${baseUrl}/resources/${id}/metadata`).then(
    resolveJsonOrRejectWithError,
  );
};

export const updateResourceMetadata = async (
  resourceId: string,
  body: Partial<TaxonomyMetadata>,
): Promise<TaxonomyMetadata> => {
  return await fetchAuthorized(`${baseUrl}/resources/${resourceId}/metadata`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(resolveJsonOrRejectWithError);
};

// TODO: Rewrite once adjusted/updated taxonomy-API is available
/* function fetchTopicResource(id, locale) {
  return fetchAuthorized(
    `${baseUrl}/resources/${id}/topics?language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
}
 */

export async function getResourceId({
  id,
  language,
}: {
  id: string;
  language: string;
}): Promise<string> {
  let resourceId = '';
  const resource = await queryResources(id, language);
  if (resource.length > 0) {
    if (resource.length > 1)
      throw new Error('More than one resource with this articleId, unable to process taxonomy');
    resourceId = resource[0].id;
  }
  return resourceId;
}

export async function getFullResource(
  resourceId: string,
  language?: string,
): Promise<{
  resourceTypes: ResourceResourceType[];
  metadata: TaxonomyMetadata;
  topics: ParentTopic[];
}> {
  const { resourceTypes, parentTopics: topics, metadata } = await fetchFullResource(
    resourceId,
    language,
  );
  return {
    resourceTypes,
    metadata,
    topics,
  };
}

export const queryResources = async (
  contentId: string,
  language: string,
  contentType = 'article',
): Promise<Resource[]> => {
  return await fetchAuthorized(
    `${baseUrl}/resources/?contentURI=${encodeURIComponent(
      `urn:${contentType}:${contentId}`,
    )}&language=${language}`,
  ).then(resolveJsonOrRejectWithError);
};

export const queryTopics = async (
  contentId: string,
  language: string,
  contentType = 'article',
): Promise<Topic[]> => {
  return await fetchAuthorized(
    `${baseUrl}/topics/?contentURI=${encodeURIComponent(
      `urn:${contentType}:${contentId}`,
    )}&language=${language}`,
  ).then(resolveJsonOrRejectWithError);
};

export const queryLearningPathResource = async (learningpathId: number): Promise<Resource[]> => {
  return await fetchAuthorized(
    `${baseUrl}/resources/?contentURI=${encodeURIComponent(`urn:learningpath:${learningpathId}`)}`,
  ).then(resolveJsonOrRejectWithError);
};

export async function queryContent(id: string, language: string, contentType?: string) {
  const resources = await queryResources(id, language, contentType);

  if (resources[0]) {
    return resources[0];
  }

  const topics = await queryTopics(id, language, contentType);

  if (topics[0]) {
    // Add resourceType so that content type is correct
    return { ...topics[0], resourceTypes: [{ id: 'subject' }] };
  }
  return undefined;
}

export const fetchResourceTranslations = async (id: string): Promise<ResourceTranslation[]> => {
  return await fetchAuthorized(`${baseUrl}/resources/${id}/translations`).then(
    resolveTaxonomyJsonOrRejectWithError,
  );
};

export const setResourceTranslation = async (
  id: string,
  language: string,
  body: {
    name: string;
  },
): Promise<boolean> => {
  const url = `${baseUrl}/resources/${id}/translations/${language}`;
  return await fetchAuthorized(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(body),
  }).then(resolveTaxonomyJsonOrRejectWithError);
};
