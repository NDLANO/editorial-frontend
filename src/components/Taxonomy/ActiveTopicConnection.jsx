/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ChevronRight } from '@ndla/icons/common';
import { Cross } from '@ndla/icons/action';
import { injectT } from '@ndla/i18n';
import styled from '@emotion/styled';
import {
  StyledBreadCrumb,
  StyledConnections,
  StyledErrorLabel,
  StyledRemoveConnectionButton,
  StyledPrimaryConnectionButton,
} from '../../style/LearningResourceTaxonomyStyles';
import SharedTopicConnections from './SharedTopicConnections';
import { TopicShape } from '../../shapes';

const StyledFlexWrapper = styled.div`
  display: flex;
`;

const ActiveTopicConnection = ({
  retriveBreadCrumbs,
  removeConnection,
  setPrimaryConnection,
  t,
  type,
  topic,
}) => {
  const breadCrumbs = retriveBreadCrumbs(topic.path);
  if (!breadCrumbs) {
    return (
      <StyledConnections error>
        <StyledErrorLabel>
          {t('taxonomy.topics.disconnectedTaxonomyWarning')}
        </StyledErrorLabel>
        <StyledBreadCrumb>
          <span>{topic.path}</span>
        </StyledBreadCrumb>
        <StyledRemoveConnectionButton
          type="button"
          onClick={() => removeConnection(topic.id)}>
          <Cross />
        </StyledRemoveConnectionButton>
      </StyledConnections>
    );
  }

  if (type === 'topic-article') {
    return (
      <Fragment>
        <StyledConnections>
          <StyledBreadCrumb>
            {breadCrumbs.map((path, i) => (
              <Fragment key={`${topic.id}${path.id}`}>
                <span css={{ 'white-space': 'nowrap' }}>{path.name}</span>
                {i + 1 !== breadCrumbs.length && <ChevronRight />}
              </Fragment>
            ))}
          </StyledBreadCrumb>
        </StyledConnections>
        <SharedTopicConnections
          topic={topic}
          retriveBreadCrumbs={retriveBreadCrumbs}
        />
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
          <StyledBreadCrumb>
            {breadCrumbs.map(path => (
              <Fragment key={`${topic.id}${path.id}`}>
                <span>{path.name}</span>
                <ChevronRight />
              </Fragment>
            ))}
          </StyledBreadCrumb>
        </StyledFlexWrapper>
        <StyledRemoveConnectionButton
          type="button"
          onClick={() => removeConnection(topic.id)}>
          <Cross />
        </StyledRemoveConnectionButton>
      </StyledConnections>
      <SharedTopicConnections
        topic={topic}
        retriveBreadCrumbs={retriveBreadCrumbs}
      />
    </Fragment>
  );
};

ActiveTopicConnection.propTypes = {
  retriveBreadCrumbs: PropTypes.func.isRequired,
  removeConnection: PropTypes.func,
  setPrimaryConnection: PropTypes.func,
  topic: TopicShape.isRequired,
  type: PropTypes.string,
};

export default injectT(ActiveTopicConnection);
