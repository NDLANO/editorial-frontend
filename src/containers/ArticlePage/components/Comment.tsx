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
import { CheckLine, DeleteBinLine, ArrowDownShortLine, ArrowRightShortLine } from "@ndla/icons";
import { Button, FieldRoot, IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { plugins, toolbarAreaFilters, toolbarOptions } from "./commentToolbarUtils";
import { AlertDialog } from "../../../components/AlertDialog/AlertDialog";
import { ContentEditableFieldLabel } from "../../../components/Form/ContentEditableFieldLabel";
import { FormActionsContainer } from "../../../components/FormikForm";
import { UnsupportedElement } from "../../../components/SlateEditor/plugins/unsupported/UnsupportedElement";
import RichTextEditor from "../../../components/SlateEditor/RichTextEditor";
import { SlateCommentType } from "../../FormikForm/articleFormHooks";

const StyledFieldRoot = styled(FieldRoot, {
  base: {
    "& [data-comment]": {
      paddingInline: "xsmall",
      paddingBlock: "3xsmall",
      border: "1px solid transparent",
      "& li": {
        margin: "0",
        padding: "0",
      },
    },
  },
  variants: {
    open: {
      false: {
        lineClamp: "1",
        maxHeight: "large",
      },
      true: {
        "& [data-comment]": {
          _focusVisible: {
            borderRadius: "xsmall",
            border: "1px solid",
            borderColor: "stroke.default",
          },
        },
      },
    },
  },
});

const CommentCard = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
    border: "1px solid",
    borderColor: "stroke.warning",
    borderRadius: "xsmall",
    padding: "xsmall",
    backgroundColor: "surface.brand.4.subtle",
    marginBlockEnd: "xsmall",
  },
  variants: {
    solved: {
      true: {
        backgroundColor: "surface.brand.3.subtle",
      },
    },
  },
});

const TopButtonRow = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    gap: "3xsmall",
  },
});

const ButtonsWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
  },
});

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
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    if (index === undefined) return;
    arrayHelpers.remove(index);
    setOpen(false);
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
    <>
      <CommentCard solved={field.value.solved}>
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
            {field.value.isOpen ? <ArrowDownShortLine /> : <ArrowRightShortLine />}
          </IconButton>
          <ButtonsWrapper>
            <IconButton
              variant={field.value.solved ? "primary" : "clear"}
              size="small"
              aria-label={field.value.solved ? t("form.comment.unresolve") : t("form.comment.solve")}
              title={field.value.solved ? t("form.comment.unresolve") : t("form.comment.solve")}
              onClick={() => updateComment("solved", !field.value.solved)}
            >
              <CheckLine />
            </IconButton>
            <IconButton
              variant="danger"
              size="small"
              aria-label={t("form.workflow.deleteComment.title")}
              title={t("form.workflow.deleteComment.title")}
              onClick={() => setOpen(true)}
            >
              <DeleteBinLine />
            </IconButton>
          </ButtonsWrapper>
        </TopButtonRow>
        <StyledFieldRoot id={`comment-${id}`} open={field.value.isOpen}>
          <ContentEditableFieldLabel srOnly>{t("form.comment.commentField")}</ContentEditableFieldLabel>
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
            renderInvalidElement={(props) => <UnsupportedElement {...props} />}
            data-comment=""
            noArticleStyling
          />
        </StyledFieldRoot>
      </CommentCard>
      <AlertDialog
        title={t("form.workflow.deleteComment.title")}
        label={t("form.workflow.deleteComment.title")}
        show={open}
        text={t("form.workflow.deleteComment.dialog")}
        onCancel={() => setOpen(!open)}
      >
        <FormActionsContainer>
          <Button onClick={() => setOpen(false)} variant="secondary">
            {t("form.abort")}
          </Button>
          <Button onClick={handleDelete} variant="danger">
            {t("form.workflow.deleteComment.button")}
          </Button>
        </FormActionsContainer>
      </AlertDialog>
    </>
  );
};

export default Comment;
