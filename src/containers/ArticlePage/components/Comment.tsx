/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldArrayRenderProps, FieldInputProps } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { colors, spacing, fonts, misc } from "@ndla/core";
import { FormControl, Label } from "@ndla/forms";
import { TrashCanOutline, RightArrow, ExpandMore } from "@ndla/icons/action";
import { Done } from "@ndla/icons/editor";
import { plugins, toolbarAreaFilters, toolbarOptions } from "./commentToolbarUtils";
import { COMMENT_COLOR, formControlStyles } from "./styles";
import AlertModal from "../../../components/AlertModal";
import RichTextEditor from "../../../components/SlateEditor/RichTextEditor";
import { SlateCommentType } from "../../FormikForm/articleFormHooks";

const StyledFormControl = styled(FormControl)`
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

  const updateComment = (updateField: keyof CommentType, updateValue: boolean | Descendant[]) => {
    arrayHelpers.replace(index, { ...field.value, [updateField]: updateValue });
  };

  const tooltipText = field.value.isOpen ? t("form.comment.hide") : t("form.comment.show");
  const commentId = `${id}-comment-section`;

  return (
    <CommentCard data-solved={field.value.solved}>
      <CardContent>
        <TopButtonRow>
          <IconButtonV2
            variant="ghost"
            size="xsmall"
            aria-label={tooltipText}
            title={tooltipText}
            onClick={() => updateComment("isOpen", !field.value.isOpen)}
            aria-expanded={field.value.isOpen}
            aria-controls={commentId}
          >
            {field.value.isOpen ? <ExpandMore /> : <RightArrow />}
          </IconButtonV2>
          <div>
            <IconButtonV2
              variant={field.value.solved ? "solid" : "ghost"}
              size="xsmall"
              aria-label={field.value.solved ? t("form.comment.unresolve") : t("form.comment.solve")}
              title={field.value.solved ? t("form.comment.unresolve") : t("form.comment.solve")}
              onClick={() => updateComment("solved", !field.value.solved)}
              colorTheme="darker"
            >
              <Done />
            </IconButtonV2>
            <IconButtonV2
              variant="ghost"
              size="xsmall"
              aria-label={t("form.workflow.deleteComment.title")}
              title={t("form.workflow.deleteComment.title")}
              onClick={() => setModalOpen(true)}
              colorTheme="danger"
            >
              <TrashCanOutline />
            </IconButtonV2>
          </div>
        </TopButtonRow>
        <StyledFormControl id={`comment-${id}`}>
          <Label visuallyHidden>{t("form.comment.commentField")}</Label>
          <RichTextEditor
            value={field.value.content ?? []}
            hideBlockPicker
            submitted={isSubmitting}
            plugins={plugins}
            onChange={setInputValue}
            onClick={() => updateComment("isOpen", true)}
            onBlur={() => updateComment("content", inputValue)}
            toolbarOptions={toolbarOptions}
            toolbarAreaFilters={toolbarAreaFilters}
            data-open={field.value.isOpen}
            data-comment=""
          />
        </StyledFormControl>
      </CardContent>

      <AlertModal
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
