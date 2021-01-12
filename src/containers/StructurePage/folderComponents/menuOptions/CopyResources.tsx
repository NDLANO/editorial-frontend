/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import { css } from '@emotion/core';
import { injectT } from '@ndla/i18n';
import { Copy } from '@ndla/icons/action';

import {
  fetchTopics,
  fetchSubjectTopics,
  fetchTopicResources,
  createTopicResource,
  fetchTopicFilters,
  addFilterToResource,
  fetchResource,
  createResource,
  createResourceResourceType,
  fetchResourceTranslations,
  setResourceTranslation,
} from '../../../../modules/taxonomy';
import { cloneDraft } from '../../../../modules/draft/draftApi';
import { learningpathCopy } from '../../../../modules/learningpath/learningpathApi';
import {
  Filter,
  Resource,
  ResourceTranslation,
  ResourceType,
  TaxonomyElement,
  Topic,
  TranslateType,
} from '../../../../interfaces';
import retriveBreadCrumbs from '../../../../util/retriveBreadCrumbs';
import MenuItemDropdown from './MenuItemDropdown';
import MenuItemButton from './MenuItemButton';
import RoundIcon from '../../../../components/RoundIcon';
import handleError from '../../../../util/handleError';

type PathArray = Array<TaxonomyElement>;

interface Props {
  t: TranslateType;
  locale: string;
  id: string;
  subjectId: string;
  structure: PathArray;
  onClose: Function;
  setResourcesUpdated: Function;
  setShowAlertModal: Function;
}

const iconCss = css`
  width: 8px;
  height: 8px;
`;

const CopyResources = ({
  t,
  id,
  locale,
  subjectId,
  structure,
  onClose,
  setResourcesUpdated,
  setShowAlertModal,
}: Props) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showCopySearch, setShowCopySearch] = useState(false);
  const [showCloneSearch, setShowCloneSearch] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchTopics(locale || 'nb'),
      fetchSubjectTopics(subjectId, locale),
    ])
      .then(([topics, subjectTopics]: Array<Topic[]>) => {
        setTopics(
          topics
            .filter(topic => !subjectTopics.some(t => t.id === topic.id))
            .map(topic => ({
              ...topic,
              description: getTopicBreadcrumb(topic, topics),
            })),
        );
      })
      .catch((e: Error) => handleError(e));
  }, []);

  const getTopicBreadcrumb = (topic: Topic, topics: Topic[]) => {
    if (!topic.path) return undefined;
    const breadCrumbs: PathArray = retriveBreadCrumbs({
      topicPath: topic.path,
      structure,
      allTopics: topics,
      title: topic.name,
    });
    return breadCrumbs.map(crumb => crumb.name).join(' > ');
  };

  const addResourcesToTopic = async (resources: Resource[]) => {
    // This is made so the code runs sequentially and not cause server overflow
    // on topics with plenty of resources. The for-loop can be replaced with reduce().
    for (let i = 0; i < resources.length; i++) {
      await createTopicResource({
        primary: resources[i].isPrimary,
        rank: resources[i].rank,
        resourceId: resources[i].id,
        topicid: id,
      });
    }
    setResourcesUpdated(true);
  };

  const addTopicFiltersToResources = async (
    resources: Resource[],
    filters: Filter[],
  ) => {
    // This is made so the code runs sequentially and not cause server overflow
    // on topics with plenty of resources. The for-loop can be replaced with reduce().
    for (let i = 0; i < resources.length; i++) {
      for (let j = 0; j < filters.length; j++) {
        await addFilterToResource({
          filterId: filters[j].id,
          resourceId: resources[i].id,
        });
      }
    }
  };

  const cloneResourceResourceTypes = async (
    resourceTypes: ResourceType[],
    resourceId: String,
  ) => {
    // This is made so the code runs sequentially and not cause server overflow
    // on topics with plenty of resources. The for-loop can be replaced with reduce().
    for (let i = 0; i < resourceTypes.length; i++) {
      await createResourceResourceType({
        resourceId: `${resourceId}`,
        resourceTypeId: `${resourceTypes[i].id}`,
      });
    }
  };

  const cloneResourceTranslations = async (
    resourceTranslations: ResourceTranslation[],
    resourceId: String,
  ) => {
    // This is made so the code runs sequentially and not cause server overflow
    // on topics with plenty of resources. The for-loop can be replaced with reduce().
    for (let i = 0; i < resourceTranslations.length; i++) {
      await setResourceTranslation(
        resourceId,
        resourceTranslations[i].language,
        {
          name: resourceTranslations[i].name,
        },
      );
    }
  };

  const clonedResource = async (
    newResourceBody: { contentUri?: String; name: String },
    oldResource: Resource,
  ) => {
    const newResourcePath = await createResource(newResourceBody);
    const newResourceUrn = newResourcePath.split('/').pop();
    cloneResourceResourceTypes(oldResource.resourceTypes, newResourceUrn);
    const resourceTranslations = await fetchResourceTranslations(
      oldResource.id,
    );
    await cloneResourceTranslations(resourceTranslations, newResourceUrn);
    // eslint-disable-next-line no-return-await
    return await fetchResource(newResourceUrn, locale);
  };

  const cloneResource = async (resource: Resource) => {
    const resourceType = resource.contentUri?.split(':')[1];
    const resourceId = resource.contentUri?.split(':')[2] || '';

    if (resourceType === 'article') {
      const clonedArticle = await cloneDraft(resourceId, undefined, false);
      const newResourceBody = {
        contentUri: `urn:article:${clonedArticle.id}`,
        name: resource.name,
      };
      // eslint-disable-next-line no-return-await
      return await clonedResource(newResourceBody, resource);
    } else if (resourceType === 'learningpath') {
      const newLearningpathBody = {
        title: resource.name,
        language: locale,
      };
      const clonedLearningpath = await learningpathCopy(
        resourceId,
        newLearningpathBody,
      );
      const newLearningpathId = clonedLearningpath.id;
      const newResourceBody = {
        contentUri: `urn:learningpath:${newLearningpathId}`,
        name: resource.name,
      };
      // eslint-disable-next-line no-return-await
      return await clonedResource(newResourceBody, resource);
    } else {
      // Edge-case for resources without contentUri
      // eslint-disable-next-line no-return-await
      return await clonedResource(
        {
          name: resource.name,
        },
        resource,
      );
    }
  };

  const cloneResources = async (resources: Resource[]) => {
    const clonedResources = [];
    // This is made so the code runs sequentially and not cause server overflow
    // on topics with plenty of resources. The for-loop can be replaced with reduce().
    for (let i = 0; i < resources.length; i++) {
      const clonedResource = await cloneResource(resources[i]);
      clonedResources.push(clonedResource);
    }
    return clonedResources;
  };

  const copyResources = async (topic: Topic) => {
    try {
      const resources: Resource[] = await fetchTopicResources(topic.id);
      await addResourcesToTopic(resources);
      const filters: Filter[] = await fetchTopicFilters(id);
      await addTopicFiltersToResources(resources, filters);
    } catch (e) {
      setShowAlertModal(true);
      handleError(e);
    }
  };

  const copyAndCloneResources = async (topic: Topic) => {
    try {
      const resources: Resource[] = await fetchTopicResources(topic.id);
      const clonedResources = await cloneResources(resources);
      await addResourcesToTopic(clonedResources);
      const filters: Filter[] = await fetchTopicFilters(id);
      await addTopicFiltersToResources(clonedResources, filters);
    } catch (e) {
      setShowAlertModal(true);
      handleError(e);
    }
  };

  return (
    <>
      {!showCopySearch ? (
        <MenuItemButton
          stripped
          onClick={() => {
            setShowCopySearch(true);
            setShowCloneSearch(false);
          }}>
          <RoundIcon small smallIcon icon={<Copy css={iconCss} />} />
          {t('taxonomy.copyResources')}
        </MenuItemButton>
      ) : (
        <MenuItemDropdown
          placeholder={t('taxonomy.existingTopic')}
          searchResult={topics}
          onClose={onClose}
          onSubmit={copyResources}
          icon={<Copy />}
          smallIcon
        />
      )}
      {!showCloneSearch ? (
        <MenuItemButton
          stripped
          onClick={() => {
            setShowCopySearch(false);
            setShowCloneSearch(true);
          }}>
          <RoundIcon small smallIcon icon={<Copy css={iconCss} />} />
          {t('taxonomy.copyAndCloneResources')}
        </MenuItemButton>
      ) : (
        <MenuItemDropdown
          placeholder={t('taxonomy.existingTopic')}
          searchResult={topics}
          onClose={onClose}
          onSubmit={copyAndCloneResources}
          icon={<Copy />}
          smallIcon
        />
      )}
    </>
  );
};

export default injectT(CopyResources);
