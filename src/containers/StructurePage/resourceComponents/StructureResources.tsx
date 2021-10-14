/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { spacing } from '@ndla/core';
import styled from '@emotion/styled';
import { RefObject } from 'react';
import { useState } from 'react';
import { TFunction } from 'i18next';
import ResourceGroup from './ResourceGroup';
import AllResourcesGroup from './AllResourcesGroup';
import { groupSortResourceTypesFromTopicResources } from '../../../util/taxonomyHelpers';
import handleError from '../../../util/handleError';
import TopicDescription from './TopicDescription';
import GroupTopicResources from '../folderComponents/GroupTopicResources';
import {
  ResourceType,
  ResourceWithTopicConnection,
  SubjectTopic,
} from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { DraftStatus } from '../../../modules/draft/draftApiInterfaces';
import { LocaleType } from '../../../interfaces';
import { useAllResourceTypes } from '../../../modules/taxonomy/resourcetypes/resourceTypesQueries';
import { useTopicResources } from '../../../modules/taxonomy/topics/topicQueries';

const StyledDiv = styled('div')`
  width: calc(${spacing.large} * 5);
  margin-left: auto;
  margin-right: calc(${spacing.nsmall});
`;

export interface TopicResource extends ResourceWithTopicConnection {
  status?: DraftStatus;
}

interface Props {
  locale: LocaleType;
  currentTopic: SubjectTopic;
  resourceRef: RefObject<HTMLDivElement>;
  setResourcesLoading: (loading: boolean) => void;
  updateCurrentTopic: (newCurrent: SubjectTopic) => void;
  grouped: string;
}

const getMissingResourceType = (t: TFunction): ResourceType & { disabled?: boolean } => ({
  id: 'missing',
  name: t('taxonomy.missingResourceType'),
  disabled: true,
});

const withMissing = (r: TopicResource) => ({
  ...r,
  resourceTypes: [{ id: 'missing', name: '', connectionId: '' }],
});

const StructureResources = ({
  locale,
  currentTopic,
  resourceRef,
  grouped,
  updateCurrentTopic,
}: Props) => {
  const { t } = useTranslation();
  const [topicGrepCodes, setTopicGrepCodes] = useState<string[]>([]);

  const { data: topicResources } = useTopicResources<TopicResource[]>(
    currentTopic.id,
    locale,
    undefined,
    {
      select: resources => resources.map(r => (r.resourceTypes.length > 0 ? r : withMissing(r))),
      onError: e => handleError(e),
      placeholderData: [],
    },
  );

  const { data: resourceTypes } = useAllResourceTypes(locale, {
    select: resourceTypes => [...resourceTypes, getMissingResourceType(t)],
    onError: e => handleError(e),
    placeholderData: [],
  });

  const groupedTopicResources = groupSortResourceTypesFromTopicResources(
    resourceTypes ?? [],
    topicResources!,
  );

  return (
    <div ref={resourceRef}>
      {currentTopic && currentTopic.id && (
        <StyledDiv>
          <GroupTopicResources
            topicId={currentTopic.id}
            subjectId={`urn:${currentTopic.path.split('/')[1]}`}
            metadata={currentTopic.metadata}
            onChanged={partialMeta =>
              updateCurrentTopic({
                ...currentTopic,
                metadata: { ...currentTopic.metadata, ...partialMeta },
              })
            }
            hideIcon
          />
        </StyledDiv>
      )}
      <TopicDescription
        onUpdateResource={r => setTopicGrepCodes(r.grepCodes ?? [])}
        locale={locale}
        currentTopic={currentTopic}
        grepCodes={topicGrepCodes}
      />
      {grouped === 'ungrouped' && (
        <AllResourcesGroup
          key="ungrouped"
          topicResources={topicResources!}
          locale={locale}
          resourceTypes={resourceTypes!}
          currentTopicId={currentTopic.id}
        />
      )}
      {grouped === 'grouped' &&
        resourceTypes!.map(resourceType => {
          const topicResource = groupedTopicResources.find(
            resource => resource.id === resourceType.id,
          );
          return (
            <ResourceGroup
              key={resourceType.id}
              resourceType={resourceType}
              topicResource={topicResource}
              locale={locale}
              currentTopicId={currentTopic.id}
            />
          );
        })}
    </div>
  );
};

export default memo(StructureResources);
