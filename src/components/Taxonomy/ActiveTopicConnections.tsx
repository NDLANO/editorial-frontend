/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { Node } from "@ndla/types-taxonomy";
import ActiveTopicConnection from "./ActiveTopicConnection";
import { MinimalNodeChild } from "../../containers/ArticlePage/LearningResourcePage/components/LearningResourceTaxonomy";

interface Props {
  removeConnection?: (id: string) => void;
  setPrimaryConnection?: (id: string) => void;
  activeTopics: MinimalNodeChild[] | Node[];
  type: string;
  setRelevance?: (topicId: string, relevanceId: string) => void;
}

const StyledConnectionsWrapper = styled.div`
  padding-bottom: ${spacing.small};
`;

const ActiveTopicConnections = ({ activeTopics, ...rest }: Props) => (
  <StyledConnectionsWrapper>
    {activeTopics.map((node) => (
      <ActiveTopicConnection key={node.id} node={node} {...rest} />
    ))}
  </StyledConnectionsWrapper>
);

export default ActiveTopicConnections;
