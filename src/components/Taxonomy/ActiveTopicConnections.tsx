/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { StyledConnectionsWrapper } from '../../style/LearningResourceTaxonomyStyles';
import ActiveTopicConnection from './ActiveTopicConnection';
import { MinimalNodeChild } from '../../containers/ArticlePage/LearningResourcePage/components/LearningResourceTaxonomy';

interface Props {
  removeConnection?: (id: string) => void;
  setPrimaryConnection?: (id: string) => void;
  activeTopics: MinimalNodeChild[];
  primaryPath: string | undefined;
  type: string;
  setRelevance?: (topicId: string, relevanceId: string) => void;
}

const ActiveTopicConnections = ({ activeTopics, ...rest }: Props) => (
  <StyledConnectionsWrapper>
    {activeTopics.map((node) => (
      <ActiveTopicConnection key={node.id} node={node} {...rest} />
    ))}
  </StyledConnectionsWrapper>
);

export default ActiveTopicConnections;
