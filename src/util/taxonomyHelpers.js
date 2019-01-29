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

function sortIntoCreateDeleteUpdate({
  changedItems,
  originalItems,
  changedId = 'id',
  originalId = 'id',
  updateProperty,
}) {
  const updateItems = [];
  const createItems = [];
  const deleteItems = originalItems.filter(item => {
    const originalItemInChangedItem = changedItems.find(
      changedItem => changedItem[changedId] === item[originalId],
    );
    return !originalItemInChangedItem;
  });
  changedItems.forEach(changedItem => {
    const foundItem = originalItems.find(
      item => item[originalId] === changedItem[changedId],
    );
    if (foundItem) {
      if (
        updateProperty &&
        foundItem[updateProperty] !== changedItem[updateProperty]
      ) {
        updateItems.push({
          ...foundItem,
          [updateProperty]: changedItem[updateProperty],
        });
      }
    } else {
      createItems.push(changedItem);
    }
  });

  return [createItems, deleteItems, updateItems];
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
        subtopics: [...(topic.subtopics || []), subTopic],
      };
    }
    if (topic.subtopics) {
      return {
        ...topic,
        subtopics: insertSubTopic(topic.subtopics, subTopic),
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

const getCurrentTopic = ({ params, subject = {} }) => {
  const { topic1, topic2, topic3 } = params;
  let topic = {};
  if (topic1) {
    topic =
      (subject.topics && subject.topics.find(top => top.id === topic1)) || {};
    if (topic2) {
      topic =
        (topic.subtopics && topic.subtopics.find(top => top.id === topic2)) ||
        {};
      if (topic3) {
        topic =
          topic.subtopics && topic.subtopics.find(top => top.id === topic3);
      }
    }
  }
  return topic || {};
};

const selectedResourceTypeValue = resourceTypes => {
  if (resourceTypes.length === 0) {
    return '';
  }
  const withParentId = resourceTypes.find(
    resourceType => resourceType.parentId,
  );
  if (withParentId) {
    return `${withParentId.parentId},${withParentId.id}`;
  }
  // return first match (multiple selections not possible..)
  return resourceTypes[0].id;
};

export {
  flattenResourceTypes,
  sortIntoCreateDeleteUpdate,
  getResourcesGroupedByResourceTypes,
  getTopicResourcesByType,
  topicResourcesByTypeWithMetaData,
  groupSortResourceTypesFromTopicResources,
  groupTopics,
  getCurrentTopic,
  filterToSubjects,
  sortByName,
  selectedResourceTypeValue,
};
