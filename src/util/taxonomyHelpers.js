/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import {
  RESOURCE_FILTER_CORE,
  RESOURCE_FILTER_SUPPLEMENTARY,
} from '../constants';
import { getContentTypeFromResourceTypes } from './resourceHelpers';

const sortByName = (a, b) => {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
};

const connectSubConnections = (items, parents) => {
  const currentParents = parents;
  items.forEach(connection => {
    const currentConnection = connection;
    if (parents[currentConnection.id]) {
      currentConnection.subtopics = parents[currentConnection.id];
      delete currentParents[currentConnection.id];
      connectSubConnections(connection.subtopics, currentParents);
    } else {
      currentConnection.subtopics = [];
    }
  });
};

const connectionTopicsToParent = (unConnectedTopics, id) => {
  const parents = {};
  // Group into arrays
  unConnectedTopics.forEach(unconnected => {
    if (!parents[unconnected.parent]) {
      parents[unconnected.parent] = [];
    }
    parents[unconnected.parent].push(unconnected);
  });
  // Sort groups by name
  Object.keys(parents).forEach(parentKey => {
    parents[parentKey] = parents[parentKey].sort(sortByName);
  });
  // Get all direct connections
  const directConnections = parents[id];
  delete parents[id];
  // Connect subconnections
  connectSubConnections(directConnections, parents);
  return directConnections;
};

const filterToSubjects = allFilters => {
  const filterObjects = {};
  allFilters.forEach(filter => {
    if (!filterObjects[filter.subjectId]) {
      filterObjects[filter.subjectId] = [];
    }
    filterObjects[filter.subjectId].push(filter);
  });
  Object.keys(filterObjects).forEach(subjectId => {
    filterObjects[subjectId] = filterObjects[subjectId].sort(sortByName);
  });
  return filterObjects;
};

function flattenResourceTypes(data = []) {
  const resourceTypes = [];
  data.forEach(type => {
    if (type.subtypes) {
      type.subtypes.forEach(subtype =>
        resourceTypes.push({
          typeName: type.name,
          typeId: type.id,
          name: subtype.name,
          id: subtype.id,
        }),
      );
    } else {
      resourceTypes.push({
        name: type.name,
        id: type.id,
      });
    }
  });
  return resourceTypes;
}

function spliceChangedItems(
  changedItems,
  items,
  changedItemId = 'id',
  itemId = 'id',
  updateProperty,
) {
  const copy = [...changedItems];
  const updatedItems = [];
  copy.forEach(item => {
    const foundItem = items.find(
      itemType => itemType[itemId] === item[changedItemId],
    );
    if (foundItem) {
      changedItems.splice(
        changedItems.findIndex(
          itemType => itemType[changedItemId] === item[changedItemId],
        ),
        1,
      );
      items.splice(
        items.findIndex(itemType => itemType[itemId] === item[changedItemId]),
        1,
      );
      if (
        updateProperty &&
        foundItem[updateProperty] !== item[updateProperty]
      ) {
        updatedItems.push({
          ...foundItem,
          [updateProperty]: item[updateProperty],
        });
      }
    }
  });
  // [Create], [Delete], [Update]
  return [[...changedItems], [...items], [...updatedItems]];
}

function groupRelevanceResourceTypes(
  coreResourceTypes,
  supplementaryResourceTypes,
) {
  return [
    ...coreResourceTypes.map(resource => ({
      ...resource,
      relevance: RESOURCE_FILTER_CORE,
    })),
    ...supplementaryResourceTypes.map(resource => ({
      ...resource,
      relevance: RESOURCE_FILTER_SUPPLEMENTARY,
    })),
  ];
}

// Same structuring used from ndla-frontend
function getResourcesGroupedByResourceTypes(resourcesByTopic) {
  return resourcesByTopic.reduce((obj, resource) => {
    const resourceTypesWithResources = resource.resourceTypes.map(type => {
      const existing = defined(obj[type.id], []);
      return { ...type, resources: [...existing, resource] };
    });
    const reduced = resourceTypesWithResources.reduce(
      (acc, type) => ({ ...acc, [type.id]: type.resources }),
      {},
    );
    return { ...obj, ...reduced };
  }, {});
}

// Same structuring used from ndla-frontend
function getTopicResourcesByType(resourceTypes, groupedResourceListItem) {
  return resourceTypes
    .map(type => {
      const resources = defined(groupedResourceListItem[type.id], []);
      return { ...type, resources };
    })
    .filter(type => type.resources.length > 0);
}

function topicResourcesByTypeWithMetaData(resorceTypesByTopic) {
  return resorceTypesByTopic.map(type => ({
    ...type,
    contentType: getContentTypeFromResourceTypes([type]).contentType,
  }));
}

function groupSortResourceTypesFromTopicResources(
  resourceTypes,
  coreTopicResources,
  supplementaryTopicResources,
) {
  const groupedResourceTypes = groupRelevanceResourceTypes(
    coreTopicResources,
    supplementaryTopicResources,
  );

  const sortedResourceTypes = getResourcesGroupedByResourceTypes(
    groupedResourceTypes,
  );

  const resorceTypesByTopic = getTopicResourcesByType(
    resourceTypes,
    sortedResourceTypes,
  );

  return topicResourcesByTypeWithMetaData(resorceTypesByTopic);
}

function insertSubTopic(topics, subTopic) {
  return topics.map(topic => {
    if (topic.id === subTopic.parent) {
      return {
        ...topic,
        topics: [...(topic.topics || []), subTopic],
      };
    }
    if (topic.topics) {
      return {
        ...topic,
        topics: insertSubTopic(topic.topics, subTopic),
      };
    }
    return topic;
  });
}

const groupTopics = allTopics =>
  allTopics.reduce((acc, curr) => {
    const mainTopic = curr.parent.includes('subject');
    if (mainTopic) return acc;
    return insertSubTopic(acc.filter(topic => topic.id !== curr.id), curr);
  }, allTopics);

const getCurrentTopic = ({ params, topics }) => {
  const { subject, topic1, topic2, topic3 } = params;
  if (topic1) {
    const sub = topics[`urn:${subject}`];
    let topic = sub ? sub.find(top => top.id === `urn:${topic1}`) : {};
    if (topic2) {
      topic = topic.topics
        ? topic.topics.find(top => top.id === `urn:${topic2}`)
        : {};
      if (topic3) {
        topic = topic.topics
          ? topic.topics.find(top => top.id === `urn:${topic3}`)
          : {};
      }
    }
    return topic || {};
  }
  return {};
};

export {
  flattenResourceTypes,
  spliceChangedItems,
  getResourcesGroupedByResourceTypes,
  getTopicResourcesByType,
  topicResourcesByTypeWithMetaData,
  groupSortResourceTypesFromTopicResources,
  groupTopics,
  getCurrentTopic,
  filterToSubjects,
  connectionTopicsToParent,
  sortByName,
};
