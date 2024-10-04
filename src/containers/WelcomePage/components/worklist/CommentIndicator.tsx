/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from "@emotion/styled";
import { Comment } from "@ndla/icons/common";
import { stripInlineContentHtmlTags } from "../../../../util/formHelper";

const StyledIconWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;
interface Props {
  comment: string;
}

const CommentIndicator = ({ comment }: Props) => {
  const strippedComment = stripInlineContentHtmlTags(comment);

  return (
    <StyledIconWrapper title={strippedComment} aria-label={strippedComment}>
      <Comment size="small" />
    </StyledIconWrapper>
  );
};
export default CommentIndicator;
