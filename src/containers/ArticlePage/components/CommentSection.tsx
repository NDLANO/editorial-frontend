/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps } from "formik";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing, fonts } from "@ndla/core";
import { IStatus } from "@ndla/types-backend/draft-api";
import Comment, { CommentType } from "./Comment";
import InputComment from "./InputComment";
import FormikField from "../../../components/FormikField";
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
  ${fonts.sizes("16px")};
  margin-left: auto;
`;

const StyledFormikField = styled(FormikField)`
  margin: 0;
  width: 100%;
`;

interface Props {
  articleType: string;
  savedStatus?: IStatus;
}
const CommentSection = ({ articleType, savedStatus }: Props) => {
  const { t } = useTranslation();
  const allOpen = (value: CommentType[]) => value.every((v) => v.isOpen);

  const commentsHidden =
    articleType !== "topic-article" && RESET_COMMENTS_STATUSES.some((s) => s === savedStatus?.current);

  return (
    <CommentColumn data-hidden={commentsHidden} aria-hidden={commentsHidden}>
      <StyledFormikField noBorder label={t("form.introduction.label")} name="comments" showMaxLength>
        {({ field, form: { isSubmitting } }: FieldProps<CommentType[]>) => (
          <>
            <InputComment field={field} isSubmitting={isSubmitting} />
            {field.value.length ? (
              <StyledOpenCloseAll
                variant="stripped"
                onClick={() => {
                  const open = allOpen(field.value) !== undefined ? !allOpen(field.value) : true;
                  field.onChange({
                    target: {
                      value: field.value.map((c) => ({ ...c, isOpen: open })),
                      name: field.name,
                    },
                  });
                }}
                fontWeight="semibold"
              >
                {allOpen(field.value) ? t("form.hideAll") : t("form.openAll")}
              </StyledOpenCloseAll>
            ) : null}
            <StyledList>
              {field.value.map((comment, index) => {
                const id = "id" in comment ? comment.id : comment.generatedId;
                return <Comment key={id} id={id} field={field} index={index} isSubmitting={isSubmitting} />;
              })}
            </StyledList>
          </>
        )}
      </StyledFormikField>
    </CommentColumn>
  );
};

export default memo(CommentSection);
