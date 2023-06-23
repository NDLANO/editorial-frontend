/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import groupBy from 'lodash/groupBy';
import merge from 'lodash/merge';
import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import { NodeChild, ResourceType } from '@ndla/types-taxonomy';
import { FlattenedResourceType } from '../interfaces';
import { SubjectTopic, TaxonomyElement } from '../modules/taxonomy/taxonomyApiInterfaces';
import { fetchTopic, fetchSubject } from '../modules/taxonomy';
import { getContentTypeFromResourceTypes } from './resourceHelpers';
import { ResourceWithNodeConnectionAndMeta } from '../containers/StructurePage/resourceComponents/StructureResources';
import { NodeChildWithChildren } from '../modules/nodes/nodeQueries';

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
  data.forEach((type) => {
    if (type.subtypes) {
      type.subtypes.forEach((subtype) =>
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
  resourceTypes.push({ name: t('contextTypes.frontpage'), id: 'frontpage-article' });
  return resourceTypes;
};

export const groupResourcesByType = (
  resources: ResourceWithNodeConnectionAndMeta[],
  resourceTypes: ResourceType[],
) => {
  const types = resourceTypes.reduce<Record<string, string>>((types, rt) => {
    const reversedMapping =
      rt.subtypes?.reduce<Record<string, string>>((acc, curr) => {
        acc[curr.id] = rt.id;
        return acc;
      }, {}) ?? {};
    reversedMapping[rt.id] = rt.id;
    return merge(types, reversedMapping);
  }, {});

  const typeToResourcesMapping = resources
    .flatMap((res) =>
      res.resourceTypes.map<[string, ResourceWithNodeConnectionAndMeta]>((rt) => [rt.id, res]),
    )
    .reduce<Record<string, { parentId: string; resources: ResourceWithNodeConnectionAndMeta[] }>>(
      (acc, [id, curr]) => {
        if (acc[id]) {
          acc[id]['resources'] = acc[id]['resources'].concat(curr);
        } else {
          acc[id] = {
            parentId: types[id],
            resources: [curr],
          };
        }
        return acc;
      },
      {},
    );

  const groupedValues = groupBy(Object.values(typeToResourcesMapping), (t) => t.parentId);

  const unique = Object.entries(groupedValues).reduce<
    Record<string, ResourceWithNodeConnectionAndMeta[]>
  >((acc, [id, val]) => {
    const uniqueValues = uniqBy(
      val.flatMap((v) => v.resources),
      (r) => r.id,
    );

    acc[id] = uniqueValues;
    return acc;
  }, {});

  return resourceTypes
    .map((rt) => ({
      ...rt,
      resources: sortBy(unique[rt.id], (res) => res.rank) ?? [],
      contentType: getContentTypeFromResourceTypes([rt]).contentType,
    }))
    .filter((rt) => rt.resources.length > 0);
};

export const safeConcat = <T>(toAdd: T, existing?: T[]) =>
  existing ? existing.concat(toAdd) : [toAdd];

const insertSubTopic = (topics: SubjectTopic[], subTopic: SubjectTopic): SubjectTopic[] => {
  return topics.map((topic) => {
    if (topic.id === subTopic.parentId) {
      return { ...topic, subtopics: safeConcat(subTopic, topic.subtopics) };
    }
    if (topic.subtopics) {
      return { ...topic, subtopics: insertSubTopic(topic.subtopics, subTopic) };
    }
    return topic;
  });
};
const insertChild = (
  childNodes: NodeChildWithChildren[],
  childNode: NodeChildWithChildren,
): NodeChildWithChildren[] => {
  return childNodes.map((node) => {
    if (node.id === childNode.parentId) {
      return { ...node, childNodes: safeConcat(childNode, node.childNodes) };
    }
    if (node.childNodes) {
      return { ...node, childNodes: insertChild(node.childNodes, childNode) };
    }
    return node;
  });
};

const groupChildNodes = (childNodes: NodeChild[]) =>
  childNodes.reduce((acc, curr) => {
    if (curr.parentId.includes('subject')) return acc;
    const withoutCurrent = acc.filter((node) => node.id !== curr.id);
    return insertChild(withoutCurrent, curr);
  }, childNodes);

const groupTopics = (allTopics: SubjectTopic[]) =>
  allTopics.reduce((acc, curr) => {
    const mainTopic = curr.parentId.includes('subject');
    if (mainTopic) return acc;
    return insertSubTopic(
      acc.filter((topic) => topic.id !== curr.id),
      curr,
    );
  }, allTopics);

const selectedResourceTypeValue = (resourceTypes: { id: string; parentId?: string }[]): string => {
  if (resourceTypes.length === 0) {
    return '';
  }
  const withParentId = resourceTypes.find((resourceType) => resourceType.parentId);
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
    .map((url) => `urn:${url}`);

const getBreadcrumbFromPath = async (
  path: string,
  taxonomyVersion: string,
  language?: string,
): Promise<TaxonomyElement[]> => {
  const [subjectPath, ...topicPaths] = pathToUrnArray(path);
  const subjectAndTopics = await Promise.all([
    fetchSubject({ id: subjectPath, language, taxonomyVersion }),
    ...topicPaths.map((id) => fetchTopic({ id, language, taxonomyVersion })),
  ]);
  return subjectAndTopics.map((element) => ({
    id: element.id,
    name: element.name,
    metadata: element.metadata,
  }));
};

export const nodePathToUrnPath = (path: string) => path.replace(/\//g, '/urn:').substr(1);

export {
  groupChildNodes,
  flattenResourceTypesAndAddContextTypes,
  groupTopics,
  sortByName,
  selectedResourceTypeValue,
  pathToUrnArray,
  getBreadcrumbFromPath,
};
