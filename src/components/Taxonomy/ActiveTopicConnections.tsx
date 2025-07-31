/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import ActiveTopicConnection from "./ActiveTopicConnection";
import { MinimalNodeChild } from "./types";

interface Props {
  removeConnection?: (id: string) => void;
  setPrimaryConnection?: (id: string) => void;
  activeTopics: MinimalNodeChild[] | Node[];
  type: string;
  setRelevance?: (topicId: string, relevanceId: string) => void;
}

const StyledConnectionsList = styled("ul", {
  base: {
    listStyle: "none",
    marginBottom: "small",
  },
});

const ActiveTopicConnections = ({ activeTopics, ...rest }: Props) => (
  <StyledConnectionsList>
    {activeTopics.map((node) => (
      <ActiveTopicConnection key={node.id} node={node} {...rest} />
    ))}
  </StyledConnectionsList>
);

export default ActiveTopicConnections;
