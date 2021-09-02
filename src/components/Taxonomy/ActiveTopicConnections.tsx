/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { StyledConnectionsWrapper } from '../../style/LearningResourceTaxonomyStyles';
import ActiveTopicConnection from './ActiveTopicConnection';
import { ResourceWithTopicConnection } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { PathArray } from '../../util/retrieveBreadCrumbs';

interface Props {
  retrieveBreadCrumbs: (path: string) => PathArray;
  removeConnection?: (id: string) => void;
  setPrimaryConnection?: (id: string) => void;
  activeTopics: ResourceWithTopicConnection[];
  type: string;
  setRelevance?: (topicId: string, relevanceId: string) => void;
}

const ActiveTopicConnections = ({ activeTopics, ...rest }: Props) => (
  <StyledConnectionsWrapper>
    {activeTopics.map(topic => (
      <ActiveTopicConnection key={topic.id} topic={topic} {...rest} />
    ))}
  </StyledConnectionsWrapper>
);

export default ActiveTopicConnections;
