/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FastField, FieldArray, FieldProps, useField, useFormikContext } from "formik";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing, fonts } from "@ndla/core";
import { IStatus } from "@ndla/types-backend/draft-api";
import Comment, { CommentType } from "./Comment";
import InputComment from "./InputComment";
import { ARCHIVED, PUBLISHED, UNPUBLISHED } from "../../../constants";

export const RESET_COMMENTS_STATUSES = [PUBLISHED, ARCHIVED, UNPUBLISHED];
export const COMMENT_WIDTH = 220;
export const SPACING_COMMENT = Number(spacing.small.replace("px", ""));

const CommentColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 53px;
  margin-left: ${SPACING_COMMENT}px;
  width: 100%;
  max-width: ${COMMENT_WIDTH}px;

  &[data-hidden="true"] {
    visibility: hidden;
  }
`;

const StyledList = styled.ul`
  max-width: ${COMMENT_WIDTH}px;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StyledOpenCloseAll = styled(ButtonV2)`
  ${fonts.size.text.button}
  margin-left: auto;
`;

interface Props {
  articleType: string;
  savedStatus?: IStatus;
}
const CommentSection = ({ articleType, savedStatus }: Props) => {
  const { t } = useTranslation();
  const [_, { value }] = useField<CommentType[]>("comments");
  const { isSubmitting } = useFormikContext();
  const allOpen = (value: CommentType[]) => value.every((v) => v.isOpen);

  const commentsHidden =
    articleType !== "topic-article" && RESET_COMMENTS_STATUSES.some((s) => s === savedStatus?.current);

  return (
    <CommentColumn data-hidden={commentsHidden} aria-hidden={commentsHidden}>
      <FieldArray
        name="comments"
        render={(arrayHelpers) => (
          <>
            <InputComment arrayHelpers={arrayHelpers} isSubmitting={isSubmitting} />
            {value.length ? (
              <StyledOpenCloseAll
                variant="stripped"
                onClick={() => {
                  const open = allOpen(value) !== undefined ? !allOpen(value) : true;
                  value.forEach((v, i) => (v.isOpen !== open ? arrayHelpers.replace(i, { ...v, isOpen: open }) : null));
                }}
                fontWeight="semibold"
              >
                {allOpen(value) ? t("form.hideAll") : t("form.openAll")}
              </StyledOpenCloseAll>
            ) : null}
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
          </>
        )}
      />
    </CommentColumn>
  );
};

export default memo(CommentSection);
