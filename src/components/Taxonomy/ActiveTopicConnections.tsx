/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyledConnectionsWrapper } from '../../style/LearningResourceTaxonomyStyles';
import ActiveTopicConnection from './ActiveTopicConnection';
import { TopicShape } from '../../shapes';
import { ResourceWithTopicConnection } from '../../interfaces';
import { PathArray } from '../../util/retriveBreadCrumbs';

const ActiveTopicConnections = ({ activeTopics, ...rest }: Props) => (
  <StyledConnectionsWrapper>
    {activeTopics.map(topic => (
      <ActiveTopicConnection key={topic.id} topic={topic} {...rest} />
    ))}
  </StyledConnectionsWrapper>
);

interface Props {
  retriveBreadCrumbs: (path: string) => PathArray;
  removeConnection?: (id: string) => void;
  setPrimaryConnection?: (id: string) => void;
  activeTopics: ResourceWithTopicConnection[];
  type: string;
  setRelevance?: (topicId: string, relevanceId: string) => void;
}

ActiveTopicConnections.propTypes = {
  retriveBreadCrumbs: PropTypes.func.isRequired,
  removeConnection: PropTypes.func,
  setPrimaryConnection: PropTypes.func.isRequired,
  activeTopics: PropTypes.arrayOf(TopicShape).isRequired,
  type: PropTypes.string.isRequired,
};

export default ActiveTopicConnections;
