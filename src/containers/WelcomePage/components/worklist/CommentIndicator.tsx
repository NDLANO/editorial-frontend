/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from "@emotion/styled";
import { Comment } from "@ndla/icons/common";
import { Tooltip } from "@ndla/tooltip";
import { stripInlineContentHtmlTags } from "../../../../util/formHelper";

const StyledIconWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;
const StyledCommentIcon = styled(Comment)`
  width: 20px;
  height: 20px;
`;

interface Props {
  comment: string;
}

const CommentIndicator = ({ comment }: Props) => {
  const strippedComment = stripInlineContentHtmlTags(comment);

  return (
    <Tooltip tooltip={strippedComment} delayDuration={0}>
      <StyledIconWrapper>
        <StyledCommentIcon aria-label={strippedComment} />
      </StyledIconWrapper>
    </Tooltip>
  );
};
export default CommentIndicator;
