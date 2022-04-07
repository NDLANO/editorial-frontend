/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import {
  resolveLocation,
  resolveVoidOrRejectWithError,
} from '../../../util/resolveJsonOrRejectWithError';
import { apiResourceUrl, httpFunctions } from '../../../util/apiHelpers';
import { taxonomyApi } from '../../../config';
import {
  ResourceWithTopicConnection,
  TaxonomyMetadata,
  Topic,
  TopicConnections,
} from '../taxonomyApiInterfaces';
import { WithTaxonomyVersion } from '../../../interfaces';
import {
  TopicPostBody,
  TopicPutBody,
  TopicSubtopicPostBody,
  TopicSubtopicPutBody,
} from './topicApiInterfaces';

const baseUrl = apiResourceUrl(`${taxonomyApi}/topics`);
const baseTopicSubtopicUrl = apiResourceUrl(`${taxonomyApi}/topic-subtopics`);
const baseSubjectTopicsUrl = apiResourceUrl(`${taxonomyApi}/subject-topics`);

const { fetchAndResolve, postAndResolve, deleteAndResolve, putAndResolve } = httpFunctions;

const stringifyQuery = (object: Record<string, any> = {}) => {
  const stringified = `?${queryString.stringify(object)}`;
  return stringified === '?' ? '' : stringified;
};

interface TopicsGetParams extends WithTaxonomyVersion {
  language?: string;
}

const fetchTopics = ({ language, taxonomyVersion }: TopicsGetParams): Promise<Topic[]> => {
  return fetchAndResolve({ url: `${baseUrl}${stringifyQuery({ language })}`, taxonomyVersion });
};

interface TopicGetParams extends WithTaxonomyVersion {
  id: string;
  language?: string;
}

const fetchTopic = ({ id, language, taxonomyVersion }: TopicGetParams): Promise<Topic> => {
  return fetchAndResolve({
    url: `${baseUrl}/${id}${stringifyQuery({ language })}`,
    taxonomyVersion,
  });
};

interface TopicResourcesGetParams extends WithTaxonomyVersion {
  topicUrn: string;
  language?: string;
  relevance?: string;
}
const fetchTopicResources = ({
  topicUrn,
  language,
  relevance,
  taxonomyVersion,
}: TopicResourcesGetParams): Promise<ResourceWithTopicConnection[]> => {
  return fetchAndResolve({
    url: `${baseUrl}/${topicUrn}/resources${stringifyQuery({ language, relevance })}`,
    taxonomyVersion,
  });
};

interface TopicPostParams extends WithTaxonomyVersion {
  body: TopicPostBody;
}

const addTopic = ({ body, taxonomyVersion }: TopicPostParams): Promise<string> => {
  return postAndResolve({
    url: baseUrl,
    taxonomyVersion,
    body: JSON.stringify(body),
    alternateResolve: resolveLocation,
  });
};

interface TopicPutParams extends WithTaxonomyVersion {
  id: string;
  body: TopicPutBody;
}

const updateTopic = ({ id, body, taxonomyVersion }: TopicPutParams): Promise<void> => {
  return putAndResolve({
    url: `${baseUrl}/${id}`,
    taxonomyVersion,
    body: JSON.stringify(body),
    alternateResolve: resolveVoidOrRejectWithError,
  });
};

interface TopicDeleteParams extends WithTaxonomyVersion {
  id: string;
}

const deleteTopic = ({ id, taxonomyVersion }: TopicDeleteParams): Promise<void> => {
  return deleteAndResolve({
    url: `${baseUrl}/${id}`,
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });
};

interface TopicSubtopicPostParams extends WithTaxonomyVersion {
  body: TopicSubtopicPostBody;
}

const addTopicToTopic = ({ body, taxonomyVersion }: TopicSubtopicPostParams): Promise<string> => {
  return postAndResolve({
    url: `${baseTopicSubtopicUrl}`,
    taxonomyVersion,
    body: JSON.stringify(body),
    alternateResolve: resolveLocation,
  });
};

interface TopicSubtopicPutParams extends WithTaxonomyVersion {
  connectionId: string;
  body: TopicSubtopicPutBody;
}

const updateTopicSubtopic = ({
  connectionId,
  body,
  taxonomyVersion,
}: TopicSubtopicPutParams): Promise<void> => {
  return putAndResolve({
    url: `${baseTopicSubtopicUrl}/${connectionId}`,
    taxonomyVersion,
    body: JSON.stringify(body),
    alternateResolve: resolveVoidOrRejectWithError,
  });
};

interface TopicConnectionDeleteParams extends WithTaxonomyVersion {
  id: string;
}

const deleteTopicConnection = ({
  id,
  taxonomyVersion,
}: TopicConnectionDeleteParams): Promise<void> => {
  return deleteAndResolve({
    url: `${baseSubjectTopicsUrl}/${id}`,
    taxonomyVersion,
    alternateResolve: resolveVoidOrRejectWithError,
  });
};

interface TopicSubtopicConnectionDeleteParams extends WithTaxonomyVersion {
  id: string;
}

const deleteSubTopicConnection = ({
  id,
  taxonomyVersion,
}: TopicSubtopicConnectionDeleteParams): Promise<void> => {
  return deleteAndResolve({
    url: `${baseTopicSubtopicUrl}/${id}`,
    taxonomyVersion,
    alternateResolve: resolveVoidOrRejectWithError,
  });
};

interface TopicConnectionsGetParams extends WithTaxonomyVersion {
  id: string;
}

const fetchTopicConnections = ({
  id,
  taxonomyVersion,
}: TopicConnectionsGetParams): Promise<TopicConnections[]> => {
  return fetchAndResolve({ url: `${baseUrl}/${id}/connections`, taxonomyVersion });
};

interface TopicMetadataPutParams extends WithTaxonomyVersion {
  topicId: string;
  body: Partial<TaxonomyMetadata>;
}

const updateTopicMetadata = ({
  topicId,
  body,
  taxonomyVersion,
}: TopicMetadataPutParams): Promise<TaxonomyMetadata> => {
  return putAndResolve({
    url: `${baseUrl}/${topicId}/metadata`,
    taxonomyVersion,
    body: JSON.stringify(body),
  });
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
