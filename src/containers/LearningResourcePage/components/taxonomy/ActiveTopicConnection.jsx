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
import {
  StyledBreadCrumb,
  StyledConnections,
  StyledErrorLabel,
  StyledRemoveConnectionButton,
  StyledPrimaryConnectionButton,
} from '../../../../style/LearningResourceTaxonomyStyles';
import SharedTopicConnections from './SharedTopicConnections';
import { TopicShape } from '../../../../shapes';

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

  return (
    <Fragment>
      <StyledConnections>
        {type !== 'topic-article' && (
          <StyledPrimaryConnectionButton
            primary={topic.primary}
            type="button"
            onClick={() => setPrimaryConnection(topic.id)}>
            {t('form.topics.primaryTopic')}
          </StyledPrimaryConnectionButton>
        )}
        <StyledBreadCrumb>
          {breadCrumbs.map(path => (
            <Fragment key={`${topic.id}${path.id}`}>
              <span>{path.name}</span>
              <ChevronRight />
            </Fragment>
          ))}
        </StyledBreadCrumb>
        <StyledRemoveConnectionButton
          type="button"
          onClick={() => removeConnection(topic.id)}>
          <Cross />
        </StyledRemoveConnectionButton>
      </StyledConnections>
      {type !== 'topic-article' && (
        <SharedTopicConnections
          topic={topic}
          retriveBreadCrumbs={retriveBreadCrumbs}
        />
      )}
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
