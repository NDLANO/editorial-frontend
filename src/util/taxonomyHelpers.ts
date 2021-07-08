/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as _ from 'lodash';
import { FlattenedResourceType } from '../interfaces';
import {
  ResourceType,
  ResourceWithTopicConnection,
  SubjectTopic,
  TaxonomyElement,
} from '../modules/taxonomy/taxonomyApiInterfaces';

import { getContentTypeFromResourceTypes } from './resourceHelpers';

// Kan hende at id i contentUri fra taxonomy inneholder '#xxx' (revision)
export const getIdFromUrn = (urn?: string) => {
  if (!urn) return;
  const [, , id] = urn.split(':');
  const idWithoutRevision = parseInt(id.split('#')[0]);
  return idWithoutRevision;
};

const sortByName = (a: TaxonomyElement, b: TaxonomyElement) => {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
};

const flattenResourceTypesAndAddContextTypes = (
  data: ResourceType[] = [],
  t: (key: string) => string,
) => {
  const resourceTypes: FlattenedResourceType[] = [];
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
};

const sortIntoCreateDeleteUpdate = <T extends { id: string }>({
  changedItems,
  originalItems,
  updateProperties = [],
}: {
  changedItems: T[];
  originalItems: T[];
  updateProperties?: string[];
}) => {
  const updateItems: T[] = [];
  const createItems: T[] = [];
  const deleteItems = originalItems.filter(item => {
    const originalItemInChangedItem = changedItems.find(changedItem => changedItem.id === item.id);
    return !originalItemInChangedItem;
  });
  changedItems.forEach(changedItem => {
    const foundItem = originalItems.find(item => item.id === changedItem.id);
    if (foundItem) {
      updateProperties.forEach(updateProperty => {
        if (_.get(foundItem, updateProperty) !== _.get(changedItem, updateProperty)) {
          updateItems.push({
            ...foundItem,
            [updateProperty]: _.get(changedItem, updateProperty),
          });
        }
      });
    } else {
      createItems.push(changedItem);
    }
  });

  return [createItems, deleteItems, updateItems];
};

// Same structuring used from ndla-frontend

const getResourcesGroupedByResourceTypes = (
  resourcesByTopic: ResourceWithTopicConnection[],
): Record<string, ResourceWithTopicConnection[]> => {
  return resourcesByTopic.reduce<Record<string, ResourceWithTopicConnection[]>>((obj, resource) => {
    const resourceTypesWithResources = resource.resourceTypes.map(type => {
      const existing = obj[type.id] ?? [];
      return { ...type, resources: [...existing, resource] };
    });
    const reduced = resourceTypesWithResources.reduce(
      (acc, type) => ({ ...acc, [type.id]: type.resources }),
      {},
    );
    return { ...obj, ...reduced };
  }, {});
};

// Same structuring used from ndla-frontend
const getTopicResourcesByType = (
  resourceTypes: ResourceType[],
  groupedResourceListItem: Record<string, ResourceWithTopicConnection[]>,
): (ResourceType & { resources: ResourceWithTopicConnection[] })[] => {
  return resourceTypes
    .map(type => {
      const resources: ResourceWithTopicConnection[] = groupedResourceListItem[type.id] ?? [];
      return { ...type, resources };
    })
    .filter(type => type.resources.length > 0);
};

const topicResourcesByTypeWithMetaData = (
  resorceTypesByTopic: (ResourceType & {
    resources: ResourceWithTopicConnection[];
  })[],
) => {
  return resorceTypesByTopic.map(type => ({
    ...type,
    contentType: getContentTypeFromResourceTypes([type]).contentType,
  }));
};

const groupSortResourceTypesFromTopicResources = (
  resourceTypes: ResourceType[],
  topicResources: ResourceWithTopicConnection[],
) => {
  const sortedResourceTypes = getResourcesGroupedByResourceTypes(topicResources);
  const resorceTypesByTopic = getTopicResourcesByType(resourceTypes, sortedResourceTypes);
  return topicResourcesByTypeWithMetaData(resorceTypesByTopic);
};

const insertSubTopic = (topics: SubjectTopic[], subTopic: SubjectTopic): SubjectTopic[] => {
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
};

const groupTopics = (allTopics: SubjectTopic[]) =>
  allTopics.reduce((acc, curr) => {
    const mainTopic = curr.parent.includes('subject');
    if (mainTopic) return acc;
    return insertSubTopic(
      acc.filter(topic => topic.id !== curr.id),
      curr,
    );
  }, allTopics);

const getCurrentTopic = ({
  params,
  allTopics = [],
}: {
  params: {
    topic?: string;
    subtopics?: string;
  };
  allTopics: SubjectTopic[];
}) => {
  const { topic, subtopics } = params;
  const topics = subtopics?.split('/');
  if (topics && topics.length > 0) {
    const lastTopic = topics.slice(-1)[0];
    return allTopics.find(t => t.id === lastTopic) || {};
  }
  if (topic) {
    return allTopics.find(t => t.id === topic) || {};
  }
  return {};
};

const selectedResourceTypeValue = (resourceTypes: { id: string; parentId?: string }[]): string => {
  if (resourceTypes.length === 0) {
    return '';
  }
  const withParentId = resourceTypes.find(resourceType => resourceType.parentId);
  if (withParentId) {
    return `${withParentId.parentId},${withParentId.id}`;
  }
  // return first match (multiple selections not possible..)
  return resourceTypes[0].id;
};

const pathToUrnArray = (path: string) =>
  path
    .split('/')
    .splice(1)
    .map(url => `urn:${url}`);

export {
  flattenResourceTypesAndAddContextTypes,
  sortIntoCreateDeleteUpdate,
  getResourcesGroupedByResourceTypes,
  getTopicResourcesByType,
  topicResourcesByTypeWithMetaData,
  groupSortResourceTypesFromTopicResources,
  groupTopics,
  getCurrentTopic,
  sortByName,
  selectedResourceTypeValue,
  pathToUrnArray,
};
