/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { apiResourceUrl, fetchAuthorized } from '../../../util/apiHelpers';
import { sortIntoCreateDeleteUpdate } from '../../../util/taxonomyHelpers';
import { taxonomyApi } from '../../../config';
import { ParentTopicWithRelevanceAndConnections } from '../taxonomyApiInterfaces';
import {
  resolveLocation,
  resolveVoidOrRejectWithError,
} from '../../../util/resolveJsonOrRejectWithError';
import { TopicResourcePostType } from './topicResourceInterfaces';

const baseUrl = apiResourceUrl(taxonomyApi);

const createTopicResource = (topicResource: TopicResourcePostType): Promise<string> => {
  return fetchAuthorized(`${baseUrl}/topic-resources`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(topicResource),
  }).then(resolveLocation);
};

const updateTopicResource = (
  id: string,
  topicResource: {
    primary?: boolean;
    rank?: number;
    relevanceId?: string;
  },
): Promise<void> => {
  return fetchAuthorized(`${baseUrl}/topic-resources/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(topicResource),
  }).then(resolveVoidOrRejectWithError);
};

const deleteTopicResource = (id: string): Promise<void> => {
  return fetchAuthorized(`${baseUrl}/topic-resources/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  }).then(resolveVoidOrRejectWithError);
};

async function createDeleteUpdateTopicResources(
  resourceId: string,
  topics: ParentTopicWithRelevanceAndConnections[],
  originalTopics: ParentTopicWithRelevanceAndConnections[],
): Promise<void> {
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
          topicid: item.id,
          primary: item.primary,
          relevanceId: item.relevanceId,
          resourceId, // Not consistent!
        }),
      ),
    );
    await Promise.all(deleteItems.map(item => deleteTopicResource(item.connectionId)));
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
      if (Object.keys(update).length) updateTopicResource(item.connectionId, update);
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
