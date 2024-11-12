/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FastField, FieldArray, FieldProps, useField, useFormikContext } from "formik";
import { memo } from "react";
import { spacing } from "@ndla/core";
import { styled } from "@ndla/styled-system/jsx";
import Comment, { CommentType } from "./Comment";
import InputComment from "./InputComment";
import { ARCHIVED, PUBLISHED, UNPUBLISHED } from "../../../constants";

export const RESET_COMMENTS_STATUSES = [PUBLISHED, ARCHIVED, UNPUBLISHED];
export const COMMENT_WIDTH = 220;
export const SPACING_COMMENT = Number(spacing.small.replace("px", ""));

const StyledList = styled("ul", {
  base: {
    listStyle: "none",
  },
});

const StyledCommentWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "large",
  },
});

const CommentSection = () => {
  const [_, { value }] = useField<CommentType[]>("comments");
  const { isSubmitting } = useFormikContext();

  return (
    <FieldArray
      name="comments"
      render={(arrayHelpers) => (
        <StyledCommentWrapper>
          <InputComment arrayHelpers={arrayHelpers} isSubmitting={isSubmitting} />
          <StyledList>
            {value.map((comment, index) => {
              const id = "id" in comment ? comment.id : comment.generatedId;
              return (
                <FastField key={`comments.${index}`} name={`comments.${index}`}>
                  {({ field }: FieldProps) => (
                    <Comment
                      key={id}
                      id={id}
                      field={field}
                      index={index}
                      isSubmitting={isSubmitting}
                      arrayHelpers={arrayHelpers}
                    />
                  )}
                </FastField>
              );
            })}
          </StyledList>
        </StyledCommentWrapper>
      )}
    />
  );
};

export default memo(CommentSection);
