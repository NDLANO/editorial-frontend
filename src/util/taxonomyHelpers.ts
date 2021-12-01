/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FlattenedResourceType } from '../interfaces';
import {
  ResourceType,
  SubjectTopic,
  TaxonomyElement,
} from '../modules/taxonomy/taxonomyApiInterfaces';
import { fetchTopic, fetchSubject } from '../modules/taxonomy';
import { getContentTypeFromResourceTypes } from './resourceHelpers';
import { ChildNodeType, ResourceWithNodeConnection } from '../modules/taxonomy/nodes/nodeApiTypes';

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
  updateProperties?: Array<keyof T>;
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
        if (foundItem[updateProperty] !== changedItem[updateProperty]) {
          updateItems.push({
            ...foundItem,
            [updateProperty]: changedItem[updateProperty],
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

const safeSpread = <T>(toAdd: T, existing?: T[]) => (existing ? [...existing, toAdd] : [toAdd]);

const groupResourcesByResourceType = (resources: ResourceWithNodeConnection[]) => {
  return resources
    .flatMap(res => res.resourceTypes.map<[string, ResourceWithNodeConnection]>(rt => [rt.id, res]))
    .reduce<Record<string, ResourceWithNodeConnection[]>>(
      (acc, [id, cur]) => ({ ...acc, [id]: safeSpread(cur, acc[id]) }),
      {},
    );
};

const groupSortResourceTypesFromNodeResources = (
  resourceTypes: ResourceType[],
  topicResources: ResourceWithNodeConnection[],
) => {
  const groupedByResource = groupResourcesByResourceType(topicResources);
  return resourceTypes
    .map(type => ({ ...type, resources: groupedByResource[type.id] ?? [] }))
    .filter(type => type.resources.length > 0)
    .map(type => ({ ...type, contentType: getContentTypeFromResourceTypes([type]).contentType }));
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

const insertChild = (childNodes: ChildNodeType[], childNode: ChildNodeType): ChildNodeType[] => {
  return childNodes.map(node => {
    if (node.id === childNode.parent) {
      return { ...node, childNodes: safeSpread(childNode, node.childNodes) };
    }
    if (node.childNodes) {
      return { ...node, childNodes: insertChild(node.childNodes, childNode) };
    }
    return node;
  });
};

const groupChildNodes = (childNodes: ChildNodeType[]) =>
  childNodes.reduce((acc, curr) => {
    const mainTopic = curr.parent.includes('subject');
    if (mainTopic) return acc;
    const withoutCurrent = acc.filter(node => node.id !== curr.id);
    return insertChild(withoutCurrent, curr);
  }, childNodes);

const groupTopics = (allTopics: SubjectTopic[]) =>
  allTopics.reduce((acc, curr) => {
    const mainTopic = curr.parent.includes('subject');
    if (mainTopic) return acc;
    return insertSubTopic(
      acc.filter(topic => topic.id !== curr.id),
      curr,
    );
  }, allTopics);

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

const getBreadcrumbFromPath = async (
  path: string,
  language?: string,
): Promise<TaxonomyElement[]> => {
  const [subjectPath, ...topicPaths] = pathToUrnArray(path);
  const subjectAndTopics = await Promise.all([
    fetchSubject(subjectPath, language),
    ...topicPaths.map(id => fetchTopic(id, language)),
  ]);
  return subjectAndTopics.map(element => ({
    id: element.id,
    name: element.name,
    metadata: element.metadata,
  }));
};

export const nodePathToUrnPath = (path: string) => path.replace(/\//g, '/urn:').substr(1);

export {
  groupChildNodes,
  flattenResourceTypesAndAddContextTypes,
  sortIntoCreateDeleteUpdate,
  groupSortResourceTypesFromNodeResources,
  groupTopics,
  sortByName,
  selectedResourceTypeValue,
  pathToUrnArray,
  getBreadcrumbFromPath,
};
