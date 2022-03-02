/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { spacing } from '@ndla/core';
import styled from '@emotion/styled';
import { useLayoutEffect, useEffect, RefObject, useState } from 'react';
import { IStatus } from '@ndla/types-draft-api';
import ResourceGroup from './ResourceGroup';
import AllResourcesGroup from './AllResourcesGroup';
import { groupSortResourceTypesFromTopicResources } from '../../../util/taxonomyHelpers';
import { fetchAllResourceTypes, fetchTopicResources } from '../../../modules/taxonomy';
import handleError from '../../../util/handleError';
import TopicDescription from './TopicDescription';
import Spinner from '../../../components/Spinner';
import { fetchDraft } from '../../../modules/draft/draftApi';
import { fetchLearningpath } from '../../../modules/learningpath/learningpathApi';
import GroupTopicResources from '../folderComponents/GroupTopicResources';
import {
  ResourceType,
  ResourceWithTopicConnection,
  SubjectTopic,
  TaxonomyMetadata,
} from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { LocaleType } from '../../../interfaces';

const StyledDiv = styled('div')`
  width: calc(${spacing.large} * 5);
  margin-left: auto;
  margin-right: calc(${spacing.nsmall});
`;

export interface TopicResource extends ResourceWithTopicConnection {
  articleType?: string;
  status?: IStatus;
}

interface Props {
  locale: LocaleType;
  params: { topic: string; subtopics?: string };
  currentTopic: SubjectTopic;
  refreshTopics: () => Promise<void>;
  resourceRef: RefObject<HTMLDivElement>;
  setResourcesLoading: (loading: boolean) => void;
  resourcesUpdated: boolean;
  setResourcesUpdated: (updated: boolean) => void;
  saveSubjectTopicItems: (topicId: string, saveItems: { metadata: TaxonomyMetadata }) => void;
  grouped: string;
}

const StructureResources = ({
  locale,
  params,
  currentTopic,
  refreshTopics,
  resourceRef,
  resourcesUpdated,
  setResourcesUpdated,
  saveSubjectTopicItems,
  setResourcesLoading,
  grouped,
}: Props) => {
  const { t } = useTranslation();
  const [resourceTypes, setResourceTypes] = useState<(ResourceType & { disabled?: boolean })[]>([]);
  const [topicResources, setTopicResources] = useState<TopicResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [topicStatus, setTopicStatus] = useState<IStatus | undefined>(undefined);
  const [topicArticleType, setTopicArticleType] = useState<string | undefined>(undefined);
  const [topicGrepCodes, setTopicGrepCodes] = useState<string[]>([]);
  const prevCurrentTopic = useRef<SubjectTopic | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await getAllResourceTypes();
        await getTopicResources();
      } catch (error) {
        handleError(error);
      }
      setLoading(false);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    (async () => {
      if (!prevCurrentTopic.current) {
        return;
      }
      if (currentTopic.id !== prevCurrentTopic.current?.id || resourcesUpdated) {
        await getTopicResources();
      }
      if (resourcesUpdated) {
        setResourcesUpdated(false);
      }
    })();
    prevCurrentTopic.current = currentTopic;
  });

  const getAllResourceTypes = async () => {
    try {
      const resourceTypes = await fetchAllResourceTypes(locale);
      setResourceTypes([
        ...resourceTypes,
        {
          id: 'missing',
          name: t('taxonomy.missingResourceType'),
          disabled: true,
        },
      ]);
    } catch (error) {
      handleError(error);
    }
  };

  const onUpdateResource = (updatedRes: TopicResource) => {
    const updated = topicResources.map(res => (res.id === updatedRes.id ? updatedRes : res));
    setTopicResources(updated);
  };

  const getTopicResources = async () => {
    const { id: topicId } = currentTopic;
    setResourcesLoading(true);
    setLoading(true);
    if (topicId) {
      try {
        const initialTopicResources = await fetchTopicResources(topicId, locale);
        const allTopicResources: TopicResource[] = initialTopicResources.map(r =>
          r.resourceTypes.length > 0
            ? r
            : { ...r, resourceTypes: [{ id: 'missing', name: '', connectionId: '' }] },
        );

        if (currentTopic.contentUri) {
          const article = await fetchDraft(
            parseInt(currentTopic.contentUri.replace('urn:article:', '')),
            locale,
          );
          setTopicStatus(article.status);
          setTopicArticleType(article.articleType);
          setTopicGrepCodes(article.grepCodes);
        }
        const modifiedResources = await getResourceStatusesAndGrepCodes(allTopicResources);

        setTopicResources(modifiedResources);
      } catch (error) {
        setTopicResources([]);
        handleError(error);
      }
    } else {
      setTopicResources([]);
    }
    setLoading(false);
    setResourcesLoading(false);
  };

  const onDeleteResource = (resourceId: string) => {
    setTopicResources(topicResources.filter(r => r.connectionId !== resourceId));
  };

  const getResourceStatusesAndGrepCodes = async (allTopicResources: TopicResource[]) => {
    const resourcePromises = allTopicResources.map(async resource => {
      const [, resourceType, id] = resource.contentUri?.split(':') ?? [];
      if (resourceType === 'article') {
        const article = await fetchDraft(parseInt(id), locale);
        return {
          ...resource,
          articleType: article.articleType,
          status: article.status,
          grepCodes: article.grepCodes,
        };
      } else if (resourceType === 'learningpath') {
        const learningpath = await fetchLearningpath(parseInt(id), locale);
        if (learningpath.status) {
          const status = { current: learningpath.status, other: [] };
          return { ...resource, status };
        }
      }
      return resource;
    });
    return await Promise.all(resourcePromises);
  };

  if (loading) {
    return <Spinner />;
  }

  const groupedTopicResources = groupSortResourceTypesFromTopicResources(
    resourceTypes,
    topicResources,
  );

  return (
    <>
      {currentTopic && currentTopic.id && (
        <StyledDiv>
          <GroupTopicResources
            topicId={currentTopic.id}
            subjectId={`urn:${currentTopic.path.split('/')[1]}`}
            metadata={currentTopic.metadata}
            updateLocalTopics={saveSubjectTopicItems}
            hideIcon
          />
        </StyledDiv>
      )}
      <TopicDescription
        onUpdateResource={r => setTopicGrepCodes(r.grepCodes)}
        topicDescription={currentTopic.name}
        locale={locale}
        resourceRef={resourceRef}
        refreshTopics={refreshTopics}
        currentTopic={currentTopic}
        status={topicStatus}
        grepCodes={topicGrepCodes}
        topicArticleType={topicArticleType}
      />
      {grouped === 'ungrouped' && (
        <AllResourcesGroup
          onDeleteResource={onDeleteResource}
          key="ungrouped"
          params={params}
          topicResources={topicResources}
          onUpdateResource={onUpdateResource}
          refreshResources={getTopicResources}
          locale={locale}
          resourceTypes={resourceTypes}
        />
      )}
      {grouped === 'grouped' &&
        resourceTypes.map(resourceType => {
          const topicResource = groupedTopicResources.find(
            resource => resource.id === resourceType.id,
          );
          return (
            <ResourceGroup
              onDeleteResource={onDeleteResource}
              key={resourceType.id}
              resourceType={resourceType}
              onUpdateResource={onUpdateResource}
              topicResource={topicResource}
              params={params}
              refreshResources={getTopicResources}
              locale={locale}
            />
          );
        })}
    </>
  );
};

export default memo(StructureResources);
