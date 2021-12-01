/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from 'i18next';
import { differenceWith } from 'lodash';
import { FlattenedResourceType } from '../interfaces';
import {
  ResourceType,
  SubjectTopic,
  TaxonomyElement,
} from '../modules/taxonomy/taxonomyApiInterfaces';
import { fetchTopic, fetchSubject } from '../modules/taxonomy';
import { getContentTypeFromResourceTypes } from './resourceHelpers';
import { ChildNodeType, ResourceWithNodeConnection } from '../modules/taxonomy/nodes/nodeApiTypes';
import handleError from './handleError';

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

const transformSubtypes = (type: ResourceType): FlattenedResourceType[] =>
  type.subtypes?.map(subtype => ({ typeName: type.name, typeId: type.id, ...subtype })) ?? [];

const flattenResourceTypesAndAddContextTypes = (data: ResourceType[] = [], t: TFunction) => {
  return data
    .flatMap(type => (type.subtypes ? transformSubtypes(type) : { name: type.name, id: type.id }))
    .concat({ name: t('contextTypes.topic'), id: 'topic-article' });
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
  const deleteItems = differenceWith(originalItems, changedItems, (a, b) => a.id === b.id);
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

const safeConcat = <T>(toAdd: T, existing?: T[]) => (existing ? existing.concat(toAdd) : [toAdd]);

const groupResourcesByResourceType = (resources: ResourceWithNodeConnection[]) => {
  return resources
    .flatMap(res => res.resourceTypes.map<[string, ResourceWithNodeConnection]>(rt => [rt.id, res]))
    .reduce<Record<string, ResourceWithNodeConnection[]>>(
      (acc, [id, cur]) => ({ ...acc, [id]: safeConcat(cur, acc[id]) }),
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
      return { ...topic, subtopics: safeConcat(subTopic, topic.subtopics) };
    }
    if (topic.subtopics) {
      return { ...topic, subtopics: insertSubTopic(topic.subtopics, subTopic) };
    }
    return topic;
  });
};

const insertChild = (childNodes: ChildNodeType[], childNode: ChildNodeType): ChildNodeType[] => {
  return childNodes.map(node => {
    if (node.id === childNode.parent) {
      return { ...node, childNodes: safeConcat(childNode, node.childNodes) };
    }
    if (node.childNodes) {
      return { ...node, childNodes: insertChild(node.childNodes, childNode) };
    }
    return node;
  });
};

const groupChildNodes = (childNodes: ChildNodeType[]) =>
  childNodes.reduce((acc, curr) => {
    if (curr.parent.includes('subject')) return acc;
    const withoutCurrent = acc.filter(node => node.id !== curr.id);
    return insertChild(withoutCurrent, curr);
  }, childNodes);

const groupTopics = (allTopics: SubjectTopic[]) =>
  allTopics.reduce((acc, curr) => {
    if (curr.parent.includes('subject')) return acc;
    const withoutCurrent = acc.filter(topic => topic.id !== curr.id);
    return insertSubTopic(withoutCurrent, curr);
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

export type Input = {
  nodePath: string;
  structure: TaxonomyElement[];
  allNodes: TaxonomyElement[];
  title?: string;
};

export const retrieveBreadCrumbs = ({
  nodePath,
  structure,
  allNodes,
  title,
}: Input): TaxonomyElement[] => {
  try {
    const [subjectPath, ...topicPaths] = pathToUrnArray(nodePath);
    const subject = structure.find(structureSubject => structureSubject.id === subjectPath);
    if (!subject) return [];

    const subjectRet = [{ name: subject.name, id: subject.id, metadata: subject.metadata }];
    return topicPaths.reduce((acc, pathId) => {
      const path = allNodes.find(subtopic => subtopic.id === pathId);
      if (path) {
        return acc.concat({ name: path.name, id: path.id, metadata: path.metadata });
      } else if (title) {
        const metadata = { visible: true, grepCodes: [], customFields: {} };
        return acc.concat({ name: title, id: pathId, metadata });
      } else return acc;
    }, subjectRet);
  } catch (err) {
    handleError(err);
    return [];
  }
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
