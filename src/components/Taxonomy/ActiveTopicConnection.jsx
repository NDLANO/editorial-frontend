/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Cross } from '@ndla/icons/action';
import { injectT } from '@ndla/i18n';
import styled from '@emotion/styled';
import {
  StyledConnections,
  StyledErrorLabel,
  StyledRemoveConnectionButton,
  StyledPrimaryConnectionButton,
} from '../../style/LearningResourceTaxonomyStyles';
import SharedTopicConnections from './SharedTopicConnections';
import { TopicShape } from '../../shapes';
import Breadcrumb from './Breadcrumb';
import RelevanceOption from '../../containers/StructurePage/folderComponents/menuOptions/RelevanceOption';
import RemoveButton from '../RemoveButton';

const StyledFlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ActiveTopicConnection = ({
  retriveBreadCrumbs,
  removeConnection,
  setPrimaryConnection,
  setRelevance,
  t,
  type,
  topic,
}) => {
  const breadcrumb = retriveBreadCrumbs(topic.path);
  if (!breadcrumb) {
    return (
      <StyledConnections error>
        <StyledErrorLabel>{t('taxonomy.topics.disconnectedTaxonomyWarning')}</StyledErrorLabel>
        <Breadcrumb breadcrumb={[{ name: topic.path }]} />
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
      <Fragment>
        <StyledConnections>
          <Breadcrumb breadcrumb={breadcrumb} type={type} />
        </StyledConnections>
        <SharedTopicConnections topic={topic} retriveBreadCrumbs={retriveBreadCrumbs} type={type} />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <StyledConnections>
        <StyledFlexWrapper>
          <StyledPrimaryConnectionButton
            primary={topic.primary}
            type="button"
            onClick={() => setPrimaryConnection(topic.id)}>
            {t('form.topics.primaryTopic')}
          </StyledPrimaryConnectionButton>
          <Breadcrumb breadcrumb={breadcrumb} />
        </StyledFlexWrapper>
        <StyledFlexWrapper>
          <RelevanceOption
            relevanceId={topic.relevanceId}
            onChange={relevanceId => setRelevance(topic.id, relevanceId)}
          />
          <RemoveButton onClick={() => removeConnection && removeConnection(topic.id)} />
        </StyledFlexWrapper>
      </StyledConnections>
      <SharedTopicConnections topic={topic} retriveBreadCrumbs={retriveBreadCrumbs} />
    </Fragment>
  );
};

ActiveTopicConnection.propTypes = {
  retriveBreadCrumbs: PropTypes.func.isRequired,
  removeConnection: PropTypes.func,
  setPrimaryConnection: PropTypes.func,
  topic: TopicShape.isRequired,
  type: PropTypes.string,
  setRelevance: PropTypes.func,
};

export default injectT(ActiveTopicConnection);
