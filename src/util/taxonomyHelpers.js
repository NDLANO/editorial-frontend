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
import {
  addTopic,
  addTopicToTopic,
  addFilterToTopic,
  addSubjectTopic,
  deleteTopicFilter,
  updateTopicFilter,
} from '../modules/taxonomy';

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

function flattenResourceTypesAndAddContextTypes(data = [], t) {
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
  resourceTypes.push({ name: t('contextTypes.topic'), id: 'topic-article' });
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

const pathToUrnArray = path =>
  path
    .split('/')
    .splice(1)
    .map(url => `urn:${url}`);

const createAndPlaceTopic = async (topic, articleId, structure) => {
  const newTopicPath = await addTopic({
    name: topic.name,
    contentUri: `urn:article:${articleId}`,
  });
  const paths = pathToUrnArray(topic.path);
  const newTopicId = newTopicPath.split('/').pop();
  if (paths.length > 2) {
    // we are placing it under a topic
    const parentTopicId = paths.slice(-2)[0];
    await addTopicToTopic({
      subtopicid: newTopicId,
      topicid: parentTopicId,
    });

    // add filters from parent
    const topicFilters = structure
      .find(subject => subject.id === paths[0])
      .topics.find(topic => topic.id === parentTopicId).filters;
    await Promise.all(
      topicFilters.map(({ id, relevanceId }) =>
        addFilterToTopic({ filterId: id, relevanceId, topicId: newTopicId }),
      ),
    );
  } else {
    // we are placing it under a subject
    await addSubjectTopic({
      topicid: newTopicId,
      subjectid: paths[0],
    });
  }
  return {
    name: topic.name,
    id: newTopicId,
    path: topic.path.replace('staged', newTopicId.replace('urn:', '')),
  };
};

const createDeleteUpdateTopicFilters = async (
  createFilter,
  deleteFilter,
  updateFilter,
  stagedFilterChanges,
) => {
  const newFilters = await Promise.all(
    createFilter.map(filter =>
      addFilterToTopic({ filterId: filter.id, topicId: filter.topicId }),
    ),
  );
  await Promise.all([
    ...deleteFilter.map(({ connectionId }) =>
      deleteTopicFilter({ connectionId }),
    ),
    ...updateFilter.map(({ connectionId, relevanceId }) =>
      updateTopicFilter({ connectionId, relevanceId }),
    ),
  ]);

  const newFiltersWithId = createFilter.map((f, i) => ({
    ...f,
    connectionId: newFilters[i].split('/').pop(),
  }));
  const updatedFilters = stagedFilterChanges.map(filter => {
    const newFilter = newFiltersWithId.find(f => f.id === filter.id);
    return newFilter || filter;
  });
  return updatedFilters;
};

export {
  flattenResourceTypesAndAddContextTypes,
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
  pathToUrnArray,
  createAndPlaceTopic,
  createDeleteUpdateTopicFilters,
};
