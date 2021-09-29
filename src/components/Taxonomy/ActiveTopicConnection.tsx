/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Cross } from '@ndla/icons/action';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import {
  StyledConnections,
  StyledErrorLabel,
  StyledRemoveConnectionButton,
  StyledPrimaryConnectionButton,
} from '../../style/LearningResourceTaxonomyStyles';
import SharedTopicConnections from './SharedTopicConnections';
import Breadcrumb from './Breadcrumb';
import RelevanceOption from '../../containers/StructurePage/folderComponents/menuOptions/RelevanceOption';
import RemoveButton from '../RemoveButton';
import { StagedTopic } from '../../containers/ArticlePage/TopicArticlePage/components/TopicArticleTaxonomy';

interface Props {
  removeConnection?: (id: string) => void;
  setPrimaryConnection?: (id: string) => void;
  topic: StagedTopic;
  type: string;
  setRelevance?: (topicId: string, relevanceId: string) => void;
}

const StyledFlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ActiveTopicConnection = ({
  removeConnection,
  setPrimaryConnection,
  setRelevance,
  type,
  topic,
}: Props) => {
  const { t } = useTranslation();
  if (!topic.breadcrumb) {
    return (
      <StyledConnections error>
        <StyledErrorLabel>{t('taxonomy.topics.disconnectedTaxonomyWarning')}</StyledErrorLabel>
        <Breadcrumb breadcrumb={[topic]} />
        <StyledRemoveConnectionButton
          type="button"
          onClick={() => removeConnection && removeConnection(topic.id)}>
          <Cross />
        </StyledRemoveConnectionButton>
      </StyledConnections>
    );
  }

  if (type === 'topic-article') {
    return (
      <>
        <StyledConnections>
          <Breadcrumb breadcrumb={topic.breadcrumb} type={type} />
        </StyledConnections>
        <SharedTopicConnections
          topic={topic}
          type={type}
        />
      </>
    );
  }
  return (
    <>
      <StyledConnections>
        <StyledFlexWrapper>
          <StyledPrimaryConnectionButton
            primary={topic.primary}
            type="button"
            onClick={() => setPrimaryConnection && setPrimaryConnection(topic.id)}>
            {t('form.topics.primaryTopic')}
          </StyledPrimaryConnectionButton>
          <Breadcrumb breadcrumb={topic.breadcrumb} />
        </StyledFlexWrapper>
        <StyledFlexWrapper>
          <RelevanceOption
            relevanceId={topic.relevanceId}
            onChange={relevanceId => setRelevance && setRelevance(topic.id, relevanceId)}
          />
          <RemoveButton onClick={() => removeConnection && removeConnection(topic.id)} />
        </StyledFlexWrapper>
      </StyledConnections>
      <SharedTopicConnections topic={topic} />
    </>
  );
};

export default ActiveTopicConnection;
