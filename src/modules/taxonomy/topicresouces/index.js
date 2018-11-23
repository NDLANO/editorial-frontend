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
import { resolveTaxonomyJsonOrRejectWithError } from '..';

const baseUrl = apiResourceUrl('/taxonomy/v1');

function fetchAllTopicResource(locale) {
  return fetchAuthorized(`${baseUrl}/topic-resources/?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
}

function fetchSingleTopicResource(id) {
  return fetchAuthorized(`${baseUrl}/topic-resources/${id}`).then(
    resolveJsonOrRejectWithError,
  );
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

async function createDeleteUpdateTopicResources(
  resourceId,
  topics,
  locale,
  allTopics,
) {
  try {
    const originalTopics = allTopics.filter(
      item => item.resourceId === resourceId,
    );
    const [createItems, deleteItems, updateItems] = sortIntoCreateDeleteUpdate({
      changedItems: topics,
      originalItems: originalTopics,
      changedId: 'id',
      originalId: 'topicid',
      updateProperty: 'primary',
    });

    createItems.forEach(item => {
      createTopicResource({
        topicid: item.id,
        primary: item.primary,
        resourceId, // Not consistent!
      });
    });
    deleteItems.forEach(item => {
      deleteTopicResource(item.id);
    });
    updateItems.forEach(item => {
      // only update if changed to primary, previous primary is automatically unset
      if (item.primary)
        updateTopicResource(item.id, {
          primary: item.primary,
        });
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
