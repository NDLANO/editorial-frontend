/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldInputProps } from "formik";
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
import { COMMENT_COLOR, formControlStyles, slateContentStyles } from "./styles";
import AlertModal from "../../../components/AlertModal";
import RichTextEditor from "../../../components/SlateEditor/RichTextEditor";
import { inlineContentToHTML } from "../../../util/articleContentConverter";
import { SlateCommentType } from "../../FormikForm/articleFormHooks";

const StyledFormControl = styled(FormControl)`
  ${formControlStyles}
`;

const StyledTextArea = styled.div`
  ${slateContentStyles};
  background-color: ${COMMENT_COLOR};
  font-family: ${fonts.sans};
  font-weight: ${fonts.weight.light};
  padding: 0 ${spacing.xxsmall};
  ${fonts.size.text.button};
  border: 1px solid transparent;

  &[data-open="false"] {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 30px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
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
  field: FieldInputProps<CommentType[]>;
  index: number;
  isSubmitting: boolean;
}

const Comment = ({ id, index, isSubmitting, field }: Props) => {
  const { t } = useTranslation();
  const { value, onChange, name } = field;
  const comment = value[index];

  const [inputValue, setInputValue] = useState<Descendant[]>(comment.content);
  const [modalOpen, setModalOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleDelete = () => {
    if (index === undefined) return;
    const updatedList = value.filter((_, i) => i !== index);
    onChange({ target: { value: updatedList, name: name } });
    setModalOpen(false);
  };

  const updateComment = (updateValue: boolean | Descendant[], field: keyof CommentType) => {
    const updatedComments = value.map((c, i) => (index === i ? { ...c, [field]: updateValue } : c));
    onChange({ target: { value: updatedComments, name: "comments" } });
  };

  const tooltipText = comment.isOpen ? t("form.comment.hide") : t("form.comment.show");
  const commentId = `${id}-comment-section`;

  return (
    <CommentCard data-solved={comment.solved}>
      <CardContent>
        <TopButtonRow>
          <IconButtonV2
            variant="ghost"
            size="xsmall"
            aria-label={tooltipText}
            title={tooltipText}
            onClick={() => updateComment(!comment.isOpen, "isOpen")}
            aria-expanded={comment.isOpen}
            aria-controls={commentId}
          >
            {comment.isOpen ? <ExpandMore /> : <RightArrow />}
          </IconButtonV2>
          <div>
            <IconButtonV2
              variant={comment.solved ? "solid" : "ghost"}
              size="xsmall"
              aria-label={comment.solved ? t("form.comment.unresolve") : t("form.comment.solve")}
              title={comment.solved ? t("form.comment.unresolve") : t("form.comment.solve")}
              onClick={() => updateComment(!comment.solved, "solved")}
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
          {isFocused ? (
            <RichTextEditor
              value={comment.content ?? []}
              hideBlockPicker
              submitted={isSubmitting}
              plugins={plugins}
              onChange={setInputValue}
              onBlur={() => updateComment(inputValue, "content")}
              onFocus={() => updateComment(true, "isOpen")}
              toolbarOptions={toolbarOptions}
              toolbarAreaFilters={toolbarAreaFilters}
              data-open={comment.isOpen}
              data-comment=""
              receiveInitialFocus
              hideSpinner
            />
          ) : (
            <StyledTextArea
              dangerouslySetInnerHTML={{ __html: inlineContentToHTML(comment.content) }}
              onFocus={() => {
                setInputValue(comment.content);
                updateComment(true, "isOpen");
                setIsFocused(true);
              }}
              role="textbox"
              tabIndex={0}
              data-open={comment.isOpen}
              data-comment=""
            />
          )}
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
