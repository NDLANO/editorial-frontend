/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyledConnectionsWrapper } from '../../../../style/LearningResourceTaxonomyStyles';
import ActiveTopicConnection from './ActiveTopicConnection';
import { TopicShape } from '../../../../shapes';

const ActiveTopicConnections = ({ activeTopics, ...rest }) => (
  <StyledConnectionsWrapper>
    {activeTopics.map(topic => (
      <ActiveTopicConnection key={topic.id} topic={topic} {...rest} />
    ))}
  </StyledConnectionsWrapper>
);

ActiveTopicConnections.propTypes = {
  retriveBreadCrumbs: PropTypes.func,
  removeConnection: PropTypes.func,
  setPrimaryConnection: PropTypes.func,
  activeTopics: PropTypes.arrayOf(TopicShape),
};

export default ActiveTopicConnections;
