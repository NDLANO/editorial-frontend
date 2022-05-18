/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { apiResourceUrl, httpFunctions } from '../../../util/apiHelpers';
import { sortIntoCreateDeleteUpdate } from '../../../util/taxonomyHelpers';
import { taxonomyApi } from '../../../config';
import { ParentTopicWithRelevanceAndConnections } from '../taxonomyApiInterfaces';
import {
  resolveLocation,
  resolveVoidOrRejectWithError,
} from '../../../util/resolveJsonOrRejectWithError';
import { TopicResourcePostBody, TopicResourcePutBody } from './topicResourceApiInterfaces';
import { WithTaxonomyVersion } from '../../../interfaces';

const baseUrl = apiResourceUrl(`${taxonomyApi}/topic-resources`);
const { postAndResolve, putAndResolve, deleteAndResolve } = httpFunctions;

interface TopicResourcePostParams extends WithTaxonomyVersion {
  body: TopicResourcePostBody;
}

const createTopicResource = ({
  body,
  taxonomyVersion,
}: TopicResourcePostParams): Promise<string> => {
  return postAndResolve({
    url: baseUrl,
    body: JSON.stringify(body),
    alternateResolve: resolveLocation,
    taxonomyVersion,
  });
};

interface TopicResourcePutParams extends WithTaxonomyVersion {
  id: string;
  body: TopicResourcePutBody;
}

const updateTopicResource = ({
  id,
  body,
  taxonomyVersion,
}: TopicResourcePutParams): Promise<void> => {
  return putAndResolve({
    url: `${baseUrl}/${id}`,
    taxonomyVersion,
    body: JSON.stringify(body),
    alternateResolve: resolveVoidOrRejectWithError,
  });
};

interface TopicResourceDeleteParams extends WithTaxonomyVersion {
  id: string;
}

const deleteTopicResource = ({ id, taxonomyVersion }: TopicResourceDeleteParams): Promise<void> => {
  return deleteAndResolve({
    url: `${baseUrl}/${id}`,
    taxonomyVersion,
    alternateResolve: resolveVoidOrRejectWithError,
  });
};

interface CreateDeleteUpdateTopicResourceParams extends WithTaxonomyVersion {
  resourceId: string;
  topics: ParentTopicWithRelevanceAndConnections[];
  originalTopics: ParentTopicWithRelevanceAndConnections[];
}

async function createDeleteUpdateTopicResources({
  resourceId,
  topics,
  originalTopics,
  taxonomyVersion,
}: CreateDeleteUpdateTopicResourceParams): Promise<void> {
  try {
    const [
      createItems,
      deleteItems,
      updateItems,
    ]: ParentTopicWithRelevanceAndConnections[][] = sortIntoCreateDeleteUpdate({
      changedItems: topics,
      originalItems: originalTopics,
      updateProperties: ['primary', 'relevanceId'],
    });

    await Promise.all(
      createItems.map(item =>
        createTopicResource({
          body: {
            topicid: item.id,
            primary: item.primary,
            relevanceId: item.relevanceId,
            resourceId, // Not consistent!
          },
          taxonomyVersion,
        }),
      ),
    );
    await Promise.all(
      deleteItems.map(item => deleteTopicResource({ id: item.connectionId, taxonomyVersion })),
    );
    updateItems.forEach(item => {
      // only update if changed to primary, previous primary is automatically unset
      const update = {
        ...(item.primary && { primary: item.primary }),
        ...((originalTopics.find(topic => topic.id === item.id)?.relevanceId !==
          item.relevanceId && {
          relevanceId: item.relevanceId,
        }) ??
          []),
      };
      if (Object.keys(update).length)
        updateTopicResource({ id: item.connectionId, body: update, taxonomyVersion });
    });
  } catch (e) {
    throw new Error(e);
  }
}

export {
  createTopicResource,
  updateTopicResource,
  deleteTopicResource,
  createDeleteUpdateTopicResources,
};
