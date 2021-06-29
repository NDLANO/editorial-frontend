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
  ResourceWithTopicConnection,
  TaxonomyMetadata,
  Topic,
  TopicConnections,
  TopicResourceType,
} from '../taxonomyApiInterfaces';
import { resolveTaxonomyJsonOrRejectWithError } from '../helpers';

const baseUrl = apiResourceUrl(taxonomyApi);

const fetchTopics = (language?: string): Promise<Topic[]> => {
  const lang = language ? `?language=${language}` : '';
  return fetchAuthorized(`${baseUrl}/topics${lang}`).then(resolveJsonOrRejectWithError);
};

const fetchTopic = (urn: string, language?: string): Promise<Topic> => {
  const lang = language ? `?language=${language}` : '';
  return fetchAuthorized(`${baseUrl}/topics/${urn}${lang}`).then(resolveJsonOrRejectWithError);
};

const fetchTopicResourceTypes = (language?: string): Promise<TopicResourceType[]> => {
  const lang = language ? `?language=${language}` : '';
  return fetchAuthorized(`${baseUrl}/topic-resourcetypes/${lang}`).then(
    resolveJsonOrRejectWithError,
  );
};

const fetchTopicResources = (
  topicUrn: string,
  language?: string,
  relevance?: string,
): Promise<ResourceWithTopicConnection[]> => {
  const query = [];
  if (language) query.push(`language=${language}`);
  if (relevance) query.push(`relevance=${relevance}`);
  return fetchAuthorized(
    `${baseUrl}/topics/${topicUrn}/resources/${query.length ? `?${query.join('&')}` : ''}`,
  ).then(resolveJsonOrRejectWithError);
};

const addTopic = (body: { contentUri?: string; id?: string; name: string }): Promise<string> => {
  return fetchAuthorized(`${baseUrl}/topics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  }).then(resolveTaxonomyJsonOrRejectWithError);
};

const updateTopic = ({
  id,
  ...params
}: {
  id: string;
  name?: string;
  contentUri?: string;
}): Promise<boolean> => {
  return fetchAuthorized(`${baseUrl}/topics/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ ...params }),
  }).then(resolveTaxonomyJsonOrRejectWithError);
};

const deleteTopic = (id: string): Promise<boolean> => {
  return fetchAuthorized(`${baseUrl}/topics/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  }).then(resolveTaxonomyJsonOrRejectWithError);
};

const addTopicToTopic = (body: {
  subtopicid: string;
  topicid: string;
  relevanceId?: string;
  primary?: boolean;
  rank?: number;
}): Promise<string> => {
  return fetchAuthorized(`${baseUrl}/topic-subtopics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(resolveTaxonomyJsonOrRejectWithError);
};

const updateTopicSubtopic = (
  connectionId: string,
  body: {
    primary?: boolean;
    rank?: number;
    relevanceId?: string;
  },
): Promise<boolean> => {
  return fetchAuthorized(`${baseUrl}/topic-subtopics/${connectionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(resolveTaxonomyJsonOrRejectWithError);
};

const deleteTopicConnection = (id: string): Promise<boolean> => {
  return fetchAuthorized(`${baseUrl}/subject-topics/${id}`, {
    method: 'DELETE',
  }).then(resolveTaxonomyJsonOrRejectWithError);
};

const deleteSubTopicConnection = (id: string): Promise<boolean> => {
  return fetchAuthorized(`${baseUrl}/topic-subtopics/${id}`, {
    method: 'DELETE',
  }).then(resolveTaxonomyJsonOrRejectWithError);
};

const fetchTopicConnections = (id: string): Promise<TopicConnections[]> => {
  return fetchAuthorized(`${baseUrl}/topics/${id}/connections`).then(resolveJsonOrRejectWithError);
};

const updateTopicMetadata = (
  subjectId: string,
  body: Partial<TaxonomyMetadata>,
): Promise<TaxonomyMetadata> => {
  return fetchAuthorized(`${baseUrl}/topics/${subjectId}/metadata`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(resolveTaxonomyJsonOrRejectWithError);
};

export {
  fetchTopics,
  fetchTopic,
  addTopic,
  updateTopic,
  deleteTopic,
  addTopicToTopic,
  deleteTopicConnection,
  deleteSubTopicConnection,
  fetchTopicResources,
  fetchTopicConnections,
  updateTopicSubtopic,
  fetchTopicResourceTypes,
  updateTopicMetadata,
};
