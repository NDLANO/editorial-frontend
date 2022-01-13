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

const baseUrl = apiResourceUrl(taxonomyApi);

export const fetchResource = (id: string, language?: string): Promise<Resource> => {
  const lang = language ? `?language=${language}` : '';
  return fetchAuthorized(`${baseUrl}/resources/${id}${lang}`).then(r =>
    resolveJsonOrRejectWithError<Resource>(r),
  );
};

export const fetchFullResource = (
  id: string,
  language?: string,
): Promise<ResourceWithParentTopics> => {
  const lang = language ? `?language=${language}` : '';
  return fetchAuthorized(`${baseUrl}/resources/${id}/full${lang}`).then(r =>
    resolveJsonOrRejectWithError<ResourceWithParentTopics>(r),
  );
};

export const createResource = (resource: {
  id?: string;
  contentUri?: string;
  name: string;
}): Promise<string> => {
  return fetchAuthorized(`${baseUrl}/resources`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(resource),
  }).then(resolveLocation);
};

export const fetchResourceResourceType = (
  id: string,
  language?: string,
): Promise<ResourceResourceType[]> => {
  const lang = language ? `?language=${language}` : '';
  return fetchAuthorized(`${baseUrl}/resources/${id}/resource-types/${lang}`).then(r =>
    resolveJsonOrRejectWithError<ResourceResourceType[]>(r),
  );
};

export const updateResourceMetadata = (
  resourceId: string,
  body: Partial<TaxonomyMetadata>,
): Promise<TaxonomyMetadata> => {
  return fetchAuthorized(`${baseUrl}/resources/${resourceId}/metadata`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(r => resolveJsonOrRejectWithError<TaxonomyMetadata>(r));
};

export async function getResourceId({
  id,
  language,
}: {
  id: string | number;
  language: string;
}): Promise<string> {
  let resourceId = '';
  const strId = typeof id === 'number' ? id.toString() : id;
  const resource = await queryResources(strId, language);
  if (resource.length > 0) {
    if (resource.length > 1)
      throw new Error('More than one resource with this articleId, unable to process taxonomy');
    resourceId = resource[0].id;
  }
  return resourceId;
}

export const queryResources = (
  contentId: string | number,
  language: string,
  contentType = 'article',
): Promise<Resource[]> => {
  return fetchAuthorized(
    `${baseUrl}/resources/?contentURI=${encodeURIComponent(
      `urn:${contentType}:${contentId}`,
    )}&language=${language}`,
  ).then(r => resolveJsonOrRejectWithError<Resource[]>(r));
};

export const queryTopics = (
  contentId: string | number,
  language: string,
  contentType = 'article',
): Promise<Topic[]> => {
  return fetchAuthorized(
    `${baseUrl}/topics/?contentURI=${encodeURIComponent(
      `urn:${contentType}:${contentId}`,
    )}&language=${language}`,
  ).then(r => resolveJsonOrRejectWithError<Topic[]>(r));
};

export const queryLearningPathResource = (learningpathId: number): Promise<Resource[]> => {
  return fetchAuthorized(
    `${baseUrl}/resources/?contentURI=${encodeURIComponent(`urn:learningpath:${learningpathId}`)}`,
  ).then(r => resolveJsonOrRejectWithError<Resource[]>(r));
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

export const fetchResourceTranslations = (id: string): Promise<ResourceTranslation[]> => {
  return fetchAuthorized(`${baseUrl}/resources/${id}/translations`).then(r =>
    resolveJsonOrRejectWithError<ResourceTranslation[]>(r),
  );
};

export const setResourceTranslation = (
  id: string,
  language: string,
  body: {
    name: string;
  },
): Promise<void> => {
  const url = `${baseUrl}/resources/${id}/translations/${language}`;
  return fetchAuthorized(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(body),
  }).then(resolveVoidOrRejectWithError);
};
