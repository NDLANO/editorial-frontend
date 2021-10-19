/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import { css } from '@emotion/core';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Copy } from '@ndla/icons/action';
import {
  fetchTopics,
  fetchSubjectTopics,
  fetchTopicResources,
  createTopicResource,
  fetchResource,
  createResource,
  createResourceResourceType,
  fetchResourceTranslations,
  setResourceTranslation,
} from '../../../../modules/taxonomy';
import { cloneDraft } from '../../../../modules/draft/draftApi';
import { learningpathCopy } from '../../../../modules/learningpath/learningpathApi';
import {
  Resource,
  ResourceResourceType,
  ResourceTranslation,
  SubjectTopic,
  TaxonomyElement,
  Topic,
  ResourceWithTopicConnection,
} from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import retrieveBreadCrumbs from '../../../../util/retrieveBreadCrumbs';
import MenuItemDropdown from './MenuItemDropdown';
import MenuItemButton from './MenuItemButton';
import RoundIcon from '../../../../components/RoundIcon';
import handleError from '../../../../util/handleError';
import { getIdFromUrn } from '../../../../util/taxonomyHelpers';
import { TOPIC_RESOURCES, TOPIC_RESOURCE_STATUS_GREP_QUERY } from '../../../../queryKeys';

type PathArray = Array<TaxonomyElement>;

interface Props {
  locale: string;
  id: string;
  subjectId: string;
  structure: PathArray;
  onClose: () => void;
  setShowAlertModal: (show: boolean) => void;
}

const iconCss = css`
  width: 8px;
  height: 8px;
`;

const CopyResources = ({ id, locale, subjectId, structure, onClose, setShowAlertModal }: Props) => {
  const { t } = useTranslation();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showCopySearch, setShowCopySearch] = useState(false);
  const [showCloneSearch, setShowCloneSearch] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    Promise.all([fetchTopics(locale || 'nb'), fetchSubjectTopics(subjectId, locale)])
      .then(([topics, subjectTopics]: [Topic[], SubjectTopic[]]) => {
        const newTopics = topics
          .filter(topic => !subjectTopics.some(t => t.id === topic.id))
          .map(topic => ({ ...topic, description: getTopicBreadcrumb(topic, topics) }));
        setTopics(newTopics);
      })
      .catch((e: Error) => handleError(e));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getTopicBreadcrumb = (topic: Topic, topics: Topic[]) => {
    if (!topic.path) return undefined;
    const breadCrumbs: PathArray = retrieveBreadCrumbs({
      topicPath: topic.path,
      structure,
      allTopics: topics,
      title: topic.name,
    });
    return breadCrumbs.map(crumb => crumb.name).join(' > ');
  };

  const addResourcesToTopic = async (resources: (Resource | ResourceWithTopicConnection)[]) => {
    // This is made so the code runs sequentially and not cause server overflow
    // on topics with plenty of resources. The for-loop can be replaced with reduce().
    for (let i = 0; i < resources.length; i++) {
      try {
        await createTopicResource({
          primary: resources[i].isPrimary,
          rank: resources[i].rank,
          resourceId: resources[i].id,
          topicid: id,
        });
      } catch (e) {
        handleError(e);
      }
    }
  };

  const cloneResourceResourceTypes = async (
    resourceTypes: ResourceResourceType[],
    resourceId: string,
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
    resourceId: string,
  ) => {
    // This is made so the code runs sequentially and not cause server overflow
    // on topics with plenty of resources. The for-loop can be replaced with reduce().
    for (let i = 0; i < resourceTranslations.length; i++) {
      await setResourceTranslation(resourceId, resourceTranslations[i].language, {
        name: resourceTranslations[i].name,
      });
    }
  };

  const clonedResource = async (
    newResourceBody: { contentUri?: string; name: string },
    oldResource: ResourceWithTopicConnection,
  ) => {
    const newResourcePath = await createResource(newResourceBody);
    const newResourceUrn = newResourcePath.split('/').pop()!;
    cloneResourceResourceTypes(oldResource.resourceTypes, newResourceUrn);
    const resourceTranslations = await fetchResourceTranslations(oldResource.id);
    await cloneResourceTranslations(resourceTranslations, newResourceUrn);
    return await fetchResource(newResourceUrn, locale);
  };

  const cloneResource = async (resource: ResourceWithTopicConnection) => {
    const resourceType = resource.contentUri?.split(':')[1];
    const resourceId = resource.contentUri ? getIdFromUrn(resource.contentUri!) : null;
    if (resourceType === 'article' && resourceId) {
      const clonedArticle = await cloneDraft(resourceId, undefined, false);
      const newResourceBody = {
        contentUri: `urn:article:${clonedArticle.id}`,
        name: resource.name,
      };
      return await clonedResource(newResourceBody, resource);
    } else if (resourceType === 'learningpath' && resourceId) {
      const newLearningpathBody = {
        title: resource.name,
        language: locale,
      };
      const clonedLearningpath = await learningpathCopy(resourceId, newLearningpathBody);
      const newLearningpathId = clonedLearningpath.id;
      const newResourceBody = {
        contentUri: `urn:learningpath:${newLearningpathId}`,
        name: resource.name,
      };
      return await clonedResource(newResourceBody, resource);
    } else {
      // Edge-case for resources without contentUri
      return await clonedResource(
        {
          name: resource.name,
        },
        resource,
      );
    }
  };

  const cloneResources = async (resources: ResourceWithTopicConnection[]) => {
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
      const resources = await fetchTopicResources(topic.id);
      await addResourcesToTopic(resources);
      await qc.invalidateQueries([TOPIC_RESOURCES, id]);
    } catch (e) {
      setShowAlertModal(true);
      handleError(e);
    }
  };

  const copyAndCloneResources = async (topic: Topic) => {
    try {
      const resources = await fetchTopicResources(topic.id);
      const clonedResources = await cloneResources(resources);
      await addResourcesToTopic(clonedResources);
      await qc.invalidateQueries(TOPIC_RESOURCES);
      await qc.invalidateQueries(TOPIC_RESOURCE_STATUS_GREP_QUERY);
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
          showPagination
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
          showPagination
        />
      )}
    </>
  );
};

export default CopyResources;
