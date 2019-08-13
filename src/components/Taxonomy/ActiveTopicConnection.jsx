/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ChevronRight, Launch } from '@ndla/icons/common';
import { Cross } from '@ndla/icons/action';
import { injectT } from '@ndla/i18n';
import { Link } from 'react-router-dom';
import css from '@emotion/css';
import {
  StyledBreadCrumb,
  StyledConnections,
  StyledErrorLabel,
  StyledRemoveConnectionButton,
  StyledPrimaryConnectionButton,
} from '../../style/LearningResourceTaxonomyStyles';
import SharedTopicConnections from './SharedTopicConnections';
import { TopicShape } from '../../shapes';
import styled from '@emotion/styled';

const linkStyle = css`
  margin-right: 10px;
  white-space: nowrap;

  > span {
    margin-right: 4px;
  }
`;

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
  console.log(topic);
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
          <StyledFlexWrapper>
            <Link
              target="_blank"
              css={linkStyle}
              to={`/structure/${breadCrumbs.map(b => b.id).join('/')}`}>
              <span>{t('taxonomy.goTo')}</span>
              <Launch />
            </Link>
            <StyledRemoveConnectionButton
              type="button"
              onClick={() => removeConnection(topic.id)}>
              <Cross />
            </StyledRemoveConnectionButton>
          </StyledFlexWrapper>
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
  removeConnection: PropTypes.func.isRequired,
  setPrimaryConnection: PropTypes.func,
  topic: TopicShape.isRequired,
  type: PropTypes.string,
};

export default injectT(ActiveTopicConnection);
