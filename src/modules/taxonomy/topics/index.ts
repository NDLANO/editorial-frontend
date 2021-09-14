/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  resolveLocation,
  resolveVoidOrRejectWithError,
} from '../../../util/resolveJsonOrRejectWithError';
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
} from '../taxonomyApiInterfaces';

const baseUrl = apiResourceUrl(taxonomyApi);

const fetchTopics = (language?: string): Promise<Topic[]> => {
  const lang = language ? `?language=${language}` : '';
  return fetchAuthorized(`${baseUrl}/topics${lang}`).then(r =>
    resolveJsonOrRejectWithError<Topic[]>(r),
  );
};

const fetchTopic = (urn: string, language?: string): Promise<Topic> => {
  const lang = language ? `?language=${language}` : '';
  return fetchAuthorized(`${baseUrl}/topics/${urn}${lang}`).then(r =>
    resolveJsonOrRejectWithError<Topic>(r),
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
  ).then(r => resolveJsonOrRejectWithError<ResourceWithTopicConnection[]>(r));
};

const addTopic = (body: { contentUri?: string; id?: string; name: string }): Promise<string> => {
  return fetchAuthorized(`${baseUrl}/topics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  }).then(resolveLocation);
};

const updateTopic = ({
  id,
  ...params
}: {
  id: string;
  name?: string;
  contentUri?: string;
}): Promise<void> => {
  return fetchAuthorized(`${baseUrl}/topics/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ ...params }),
  }).then(resolveVoidOrRejectWithError);
};

const deleteTopic = (id: string): Promise<void> => {
  return fetchAuthorized(`${baseUrl}/topics/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  }).then(resolveVoidOrRejectWithError);
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
  }).then(resolveLocation);
};

const updateTopicSubtopic = (
  connectionId: string,
  body: {
    id?: string;
    primary?: boolean;
    rank?: number;
    relevanceId?: string;
  },
): Promise<void> => {
  return fetchAuthorized(`${baseUrl}/topic-subtopics/${connectionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(resolveVoidOrRejectWithError);
};

const deleteTopicConnection = (id: string): Promise<void> => {
  return fetchAuthorized(`${baseUrl}/subject-topics/${id}`, {
    method: 'DELETE',
  }).then(resolveVoidOrRejectWithError);
};

const deleteSubTopicConnection = (id: string): Promise<void> => {
  return fetchAuthorized(`${baseUrl}/topic-subtopics/${id}`, {
    method: 'DELETE',
  }).then(resolveVoidOrRejectWithError);
};

const fetchTopicConnections = (id: string): Promise<TopicConnections[]> => {
  return fetchAuthorized(`${baseUrl}/topics/${id}/connections`).then(r =>
    resolveJsonOrRejectWithError<TopicConnections[]>(r),
  );
};

const updateTopicMetadata = (
  subjectId: string,
  body: Partial<TaxonomyMetadata>,
): Promise<TaxonomyMetadata> => {
  return fetchAuthorized(`${baseUrl}/topics/${subjectId}/metadata`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(r => resolveJsonOrRejectWithError<TaxonomyMetadata>(r));
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
  updateTopicMetadata,
};
