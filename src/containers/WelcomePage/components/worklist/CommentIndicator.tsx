/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Comment } from "@ndla/icons/common";
import { styled } from "@ndla/styled-system/jsx";
import { stripInlineContentHtmlTags } from "../../../../util/formHelper";

const StyledIconWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
});
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
