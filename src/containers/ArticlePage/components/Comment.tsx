/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldArrayRenderProps, FieldInputProps } from "formik";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import styled from "@emotion/styled";
import { colors, spacing, fonts, misc } from "@ndla/core";
import { TrashCanOutline, RightArrow, ExpandMore } from "@ndla/icons/action";
import { Done } from "@ndla/icons/editor";
import { FieldLabel, FieldRoot, IconButton } from "@ndla/primitives";
import { plugins, toolbarAreaFilters, toolbarOptions } from "./commentToolbarUtils";
import { COMMENT_COLOR, formControlStyles } from "./styles";
import { AlertDialog } from "../../../components/AlertDialog/AlertDialog";
import RichTextEditor from "../../../components/SlateEditor/RichTextEditor";
import { SlateCommentType } from "../../FormikForm/articleFormHooks";

const StyledFieldRoot = styled(FieldRoot)`
  ${formControlStyles}
`;

const CommentCard = styled.li`
  border: 1px solid ${colors.brand.greyMedium};
  border-radius: ${misc.borderRadius};
  padding: ${spacing.xsmall};
  margin-bottom: ${spacing.small};
  ${fonts.size.text.button};
  background-color: ${COMMENT_COLOR};

  &[data-solved="true"] {
    background-color: ${colors.support.greenLight};
    [data-comment] {
      background-color: ${colors.support.greenLight};
    }
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const TopButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

// Comment generated on frontend, we will use id from draft-api once comment is generated
export type CommentType =
  | { generatedId?: string; content: Descendant[]; isOpen: boolean; solved: boolean }
  | SlateCommentType;

interface Props {
  id: string | undefined;
  field: FieldInputProps<CommentType>;
  index: number;
  isSubmitting: boolean;
  arrayHelpers: FieldArrayRenderProps;
}

const Comment = ({ id, index, isSubmitting, field, arrayHelpers }: Props) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState<Descendant[]>(field.value.content);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = () => {
    if (index === undefined) return;
    arrayHelpers.remove(index);
    setModalOpen(false);
  };

  const updateComment = useCallback(
    (updateField: keyof CommentType, updateValue: boolean | Descendant[]) => {
      arrayHelpers.replace(index, { ...field.value, [updateField]: updateValue });
    },
    [arrayHelpers, field.value, index],
  );
  const updateContentOnBlur = useCallback(() => updateComment("content", inputValue), [inputValue, updateComment]);

  const tooltipText = field.value.isOpen ? t("form.comment.hide") : t("form.comment.show");
  const commentId = `${id}-comment-section`;

  return (
    <CommentCard data-solved={field.value.solved}>
      <CardContent>
        <TopButtonRow>
          <IconButton
            variant="tertiary"
            size="small"
            aria-label={tooltipText}
            title={tooltipText}
            onClick={() => updateComment("isOpen", !field.value.isOpen)}
            aria-expanded={field.value.isOpen}
            aria-controls={commentId}
          >
            {field.value.isOpen ? <ExpandMore /> : <RightArrow />}
          </IconButton>
          <div>
            <IconButton
              variant={field.value.solved ? "primary" : "clear"}
              size="small"
              aria-label={field.value.solved ? t("form.comment.unresolve") : t("form.comment.solve")}
              title={field.value.solved ? t("form.comment.unresolve") : t("form.comment.solve")}
              onClick={() => updateComment("solved", !field.value.solved)}
            >
              <Done />
            </IconButton>
            <IconButton
              variant="danger"
              size="small"
              aria-label={t("form.workflow.deleteComment.title")}
              title={t("form.workflow.deleteComment.title")}
              onClick={() => setModalOpen(true)}
            >
              <TrashCanOutline />
            </IconButton>
          </div>
        </TopButtonRow>
        <StyledFieldRoot id={`comment-${id}`}>
          <FieldLabel srOnly>{t("form.comment.commentField")}</FieldLabel>
          <RichTextEditor
            value={field.value.content ?? []}
            hideBlockPicker
            submitted={isSubmitting}
            plugins={plugins}
            onChange={setInputValue}
            onClick={() => updateComment("isOpen", true)}
            onBlur={updateContentOnBlur}
            toolbarOptions={toolbarOptions}
            toolbarAreaFilters={toolbarAreaFilters}
            data-open={field.value.isOpen}
            data-comment=""
          />
        </StyledFieldRoot>
      </CardContent>

      <AlertDialog
        title={t("form.workflow.deleteComment.title")}
        label={t("form.workflow.deleteComment.title")}
        show={modalOpen}
        text={t("form.workflow.deleteComment.modal")}
        actions={[
          {
            text: t("form.abort"),
            onClick: () => setModalOpen(!modalOpen),
          },
          {
            text: t("form.workflow.deleteComment.button"),
            onClick: handleDelete,
          },
        ]}
        onCancel={() => setModalOpen(!modalOpen)}
      />
    </CommentCard>
  );
};

export default Comment;
