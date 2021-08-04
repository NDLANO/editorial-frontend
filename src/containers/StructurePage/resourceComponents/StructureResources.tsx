/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { memo, useRef } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { spacing } from '@ndla/core';
import styled from '@emotion/styled';
import { useLayoutEffect } from 'react';
import { useEffect } from 'react';
import { RefObject } from 'react';
import { useState } from 'react';
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
import { DraftStatus, DraftStatusTypes } from '../../../modules/draft/draftApiInterfaces';
import { StructureRouteParams } from '../StructureContainer';

const StyledDiv = styled('div')`
  width: calc(${spacing.large} * 5);
  margin-left: auto;
  margin-right: calc(${spacing.nsmall});
`;

export interface TopicResource extends ResourceWithTopicConnection {
  status?: DraftStatus;
}

interface Props {
  locale: string;
  params: StructureRouteParams;
  currentTopic: SubjectTopic;
  refreshTopics: () => Promise<void>;
  resourceRef: RefObject<HTMLDivElement>;
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
  grouped,
  t,
}: Props & tType) => {
  const [resourceTypes, setResourceTypes] = useState<(ResourceType & { disabled?: boolean })[]>([]);
  const [topicResources, setTopicResources] = useState<TopicResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [topicStatus, setTopicStatus] = useState<DraftStatus | undefined>(undefined);
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

  const getTopicResources = async () => {
    const { id: topicId } = currentTopic;
    setLoading(true);
    if (topicId) {
      try {
        const initialTopicResources = await fetchTopicResources(topicId, locale, undefined);
        // @ts-ignore The current resource type is not valid. It would require a name, a connectionId and a parentId.
        const allTopicResources: TopicResource[] = initialTopicResources.map(r =>
          r.resourceTypes.length > 0 ? r : { ...r, resourceTypes: [{ id: 'missing' }] },
        );

        if (currentTopic.contentUri) {
          const article = await fetchDraft(
            parseInt(currentTopic.contentUri.replace('urn:article:', '')),
            locale,
          );
          setTopicStatus(article.status);
        }
        await getResourceStatuses(allTopicResources);

        setTopicResources(allTopicResources);
      } catch (error) {
        handleError(error);
      }
    } else {
      setTopicResources([]);
    }
    setLoading(false);
  };

  const getResourceStatuses = async (allTopicResources: TopicResource[]) => {
    const resourcePromises = allTopicResources.map(async resource => {
      if (resource.contentUri) {
        const [, resourceType, id] = resource.contentUri.split(':');
        if (resourceType === 'article') {
          const article = await fetchDraft(parseInt(id), locale);
          resource.status = article.status;
          return article;
        } else if (resourceType === 'learningpath') {
          let learningpath;
          try {
            learningpath = await fetchLearningpath(parseInt(id), locale);
          } catch (e) {
            learningpath = {};
          }
          if (learningpath.status) {
            resource.status = { current: learningpath.status as DraftStatusTypes, other: [] };
          }
          return learningpath;
        }
      }
    });
    await Promise.all(resourcePromises);
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
        topicDescription={currentTopic.name}
        locale={locale}
        resourceRef={resourceRef}
        refreshTopics={refreshTopics}
        currentTopic={currentTopic}
        status={topicStatus}
      />
      {grouped === 'ungrouped' && (
        <AllResourcesGroup
          key="ungrouped"
          params={params}
          topicResources={topicResources}
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
              key={resourceType.id}
              resourceType={resourceType}
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

export default memo(injectT(StructureResources));
