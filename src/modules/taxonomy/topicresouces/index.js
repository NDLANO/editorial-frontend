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
import { sortIntoCreateDeleteUpdate } from '../../../util/taxonomyHelpers';
import { resolveTaxonomyJsonOrRejectWithError } from '../helpers';
import { taxonomyApi } from '../../../config';

const baseUrl = apiResourceUrl(taxonomyApi);

function fetchAllTopicResource(language) {
  return fetchAuthorized(`${baseUrl}/topic-resources/?language=${language}`).then(
    resolveJsonOrRejectWithError,
  );
}

function fetchSingleTopicResource(id) {
  return fetchAuthorized(`${baseUrl}/topic-resources/${id}`).then(resolveJsonOrRejectWithError);
}

function createTopicResource(topicResource) {
  return fetchAuthorized(`${baseUrl}/topic-resources`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(topicResource),
  }).then(resolveTaxonomyJsonOrRejectWithError);
}

function updateTopicResource(id, topicResource) {
  return fetchAuthorized(`${baseUrl}/topic-resources/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(topicResource),
  }).then(resolveJsonOrRejectWithError);
}

function deleteTopicResource(id) {
  return fetchAuthorized(`${baseUrl}/topic-resources/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  }).then(resolveJsonOrRejectWithError);
}

async function createDeleteUpdateTopicResources(resourceId, topics, originalTopics) {
  try {
    const [createItems, deleteItems, updateItems] = sortIntoCreateDeleteUpdate({
      changedItems: topics,
      originalItems: originalTopics,
      updateProperties: ['primary', 'relevanceId'],
    });

    await Promise.all(
      createItems.map(item =>
        createTopicResource({
          topicid: item.id,
          primary: item.primary,
          resourceId, // Not consistent!
        }),
      ),
    );
    await Promise.all(deleteItems.map(item => deleteTopicResource(item.connectionId)));
    updateItems.forEach(item => {
      // only update if changed to primary, previous primary is automatically unset
      const update = {
        ...(item.primary && { primary: item.primary }),
        ...(originalTopics.find(topic => topic.id === item.id).relevanceId !== item.relevanceId && {
          relevanceId: item.relevanceId,
        }),
      };
      if (Object.keys(update).length) updateTopicResource(item.connectionId, update);
    });
  } catch (e) {
    throw new Error(e);
  }
}

export {
  fetchAllTopicResource,
  fetchSingleTopicResource,
  createTopicResource,
  updateTopicResource,
  deleteTopicResource,
  createDeleteUpdateTopicResources,
};
