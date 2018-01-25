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
import { spliceChangedItems } from '../../../util/taxonomyHelpers';

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
  }).then(resolveJsonOrRejectWithError);
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

async function createDeleteUpdateTopicResources(resourceId, topics, language) {
  try {
    const allTopics = await fetchAllTopicResource(language);
    const topicResource = allTopics.filter(
      item => item.resourceid === resourceId,
    );

    const newTopics = spliceChangedItems(
      topics,
      topicResource,
      'id',
      'topicid',
      'primary',
    );

    newTopics[0].forEach(item => {
      createTopicResource({
        topicid: item.id,
        primary: item.primary,
        resourceid: resourceId, // Not consistent!
      });
    });
    newTopics[1].forEach(item => {
      deleteTopicResource(item.id);
    });
    newTopics[2].forEach(item => {
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
