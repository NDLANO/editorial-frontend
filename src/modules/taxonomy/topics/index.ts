/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { resolveLocation } from '../../../util/resolveJsonOrRejectWithError';
import { apiResourceUrl, httpFunctions } from '../../../util/apiHelpers';
import { taxonomyApi } from '../../../config';
import {
  ResourceWithTopicConnection,
  TaxonomyMetadata,
  Topic,
  TopicConnections,
} from '../taxonomyApiInterfaces';
import { WithTaxonomyVersion } from '../../../interfaces';
import { TopicPostBody, TopicSubtopicPostBody } from './topicApiInterfaces';

const baseUrl = apiResourceUrl(`${taxonomyApi}/topics`);
const baseTopicSubtopicUrl = apiResourceUrl(`${taxonomyApi}/topic-subtopics`);

const { fetchAndResolve, postAndResolve, putAndResolve } = httpFunctions;

interface TopicGetParams extends WithTaxonomyVersion {
  id: string;
  language?: string;
}

const fetchTopic = ({ id, language, taxonomyVersion }: TopicGetParams): Promise<Topic> => {
  return fetchAndResolve({
    url: `${baseUrl}/${id}`,
    taxonomyVersion,
    queryParams: { language },
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
    url: `${baseUrl}/${topicUrn}/resources`,
    taxonomyVersion,
    queryParams: { language, relevance },
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
  fetchTopic,
  addTopic,
  addTopicToTopic,
  fetchTopicResources,
  fetchTopicConnections,
  updateTopicMetadata,
};
