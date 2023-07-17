/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Metadata } from '@ndla/types-taxonomy';
import { resolveLocation } from '../../../util/resolveJsonOrRejectWithError';
import { apiResourceUrl, httpFunctions } from '../../../util/apiHelpers';
import { taxonomyApi } from '../../../config';
import { Topic } from '../taxonomyApiInterfaces';
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

interface TopicMetadataPutParams extends WithTaxonomyVersion {
  topicId: string;
  body: Partial<Metadata>;
}

const updateTopicMetadata = ({
  topicId,
  body,
  taxonomyVersion,
}: TopicMetadataPutParams): Promise<Metadata> => {
  return putAndResolve({
    url: `${baseUrl}/${topicId}/metadata`,
    taxonomyVersion,
    body: JSON.stringify(body),
  });
};

export { fetchTopic, addTopic, addTopicToTopic, updateTopicMetadata };
