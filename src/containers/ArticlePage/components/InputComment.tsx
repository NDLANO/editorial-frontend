/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { format } from "date-fns";
import { FieldInputProps } from "formik";
import { TFunction } from "i18next";
import uniqueId from "lodash/uniqueId";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors, spacing, misc } from "@ndla/core";
import { FormControl, Label, TextAreaV3 } from "@ndla/forms";
import { CommentType } from "./Comment";
import { plugins, toolbarAreaFilters, toolbarOptions } from "./commentToolbarUtils";
import { COMMENT_COLOR, formControlStyles, textAreaStyles } from "./styles";
import { TYPE_DIV } from "../../../components/SlateEditor/plugins/div/types";
import { TYPE_PARAGRAPH } from "../../../components/SlateEditor/plugins/paragraph/types";
import RichTextEditor from "../../../components/SlateEditor/RichTextEditor";
import formatDate, { formatDateForBackend } from "../../../util/formatDate";
import { useSession } from "../../Session/SessionProvider";

const CommentCard = styled.div`
  max-width: inherit;
  width: 100%;
  border: 1px solid ${colors.brand.greyMedium};
  border-radius: ${misc.borderRadius};
  padding: ${spacing.small};
  background-color: ${COMMENT_COLOR};
`;

const StyledTextArea = styled(TextAreaV3)`
  ${textAreaStyles}
  border: 1px solid ${colors.brand.neutral7};
`;

const WrapperColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
`;

const StyledButtonSmall = styled(ButtonV2)`
  flex: 1;
`;
const StyledButtonMedium = styled(ButtonV2)`
  flex: 2;
  background-color: ${colors.white};

  &[disabled] {
    background-color: ${colors.brand.neutral7};
  }
`;

const StyledFormControl = styled(FormControl)`
  ${formControlStyles}
  [data-comment] {
    border: 1px solid ${colors.brand.neutral7};
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${spacing.xsmall};
`;

export const getCommentInfoText = (userName: string | undefined, t: TFunction): string => {
  const currentDate = new Date();
  const dateTime = formatDateForBackend(currentDate);
  const formattedDate = formatDate(dateTime);
  const formattedTime = format(currentDate, "HH:mm");

  return `${t("form.workflow.addComment.createdBy")} ${userName?.split(" ")[0]} (${formattedDate} - ${formattedTime})`;
};

const emptyParagraph: Descendant = { type: TYPE_PARAGRAPH, children: [{ text: "" }] };

interface Props {
  field: FieldInputProps<CommentType[]>;
  isSubmitting: boolean;
}

const InputComment = ({ field, isSubmitting }: Props) => {
  const { value, onChange, name } = field;
  const { t } = useTranslation();
  const { userName } = useSession();
  const [inputValue, setInputValue] = useState<Descendant[]>([emptyParagraph]);
  const [isFocused, setIsFocused] = useState(false);

  const addComment = useCallback(() => {
    // We need a temporary unique id in frontend before id is generated in draft-api when comment is created
    const uid = uniqueId();
    const updatedComments = [{ generatedId: uid, content: inputValue, isOpen: true, solved: false }, ...value];
    onChange({ target: { value: updatedComments, name: name } });
  }, [inputValue, value, onChange, name]);

  const handleFocus = useCallback(() => {
    if (!isFocused) {
      const comment = getCommentInfoText(userName, t);

      const emptyComment: Descendant[] = [
        { type: TYPE_DIV, children: [...inputValue, { type: TYPE_PARAGRAPH, children: [{ text: comment }] }] },
      ];

      setInputValue(emptyComment);
    }

    setIsFocused(true);
  }, [inputValue, isFocused, t, userName]);

  const onCancel = useCallback(() => {
    setInputValue([emptyParagraph]);
    setIsFocused(false);
  }, []);

  const onSubmit = useCallback(() => {
    addComment();
    setInputValue([emptyParagraph]);

    setIsFocused(false);
  }, [addComment]);

  return (
    <CommentCard>
      <WrapperColumn>
        <StyledFormControl id="input-comment">
          <Label visuallyHidden>{t("form.comment.commentField")}</Label>
          {isFocused ? (
            <RichTextEditor
              value={inputValue ?? []}
              hideBlockPicker
              submitted={isSubmitting}
              plugins={plugins}
              onChange={setInputValue}
              toolbarOptions={toolbarOptions}
              toolbarAreaFilters={toolbarAreaFilters}
              data-comment=""
              receiveInitialFocus
              hideSpinner
            />
          ) : (
            <StyledTextArea
              name={t("form.comment.commentField")}
              placeholder={`${t("form.comment.comment")}...`}
              onFocus={handleFocus}
            />
          )}
        </StyledFormControl>
        <ButtonWrapper>
          <StyledButtonSmall shape="pill" size="xsmall" colorTheme="danger" disabled={!isFocused} onClick={onCancel}>
            {t("form.abort")}
          </StyledButtonSmall>
          <StyledButtonMedium variant="outline" shape="pill" size="xsmall" disabled={!isFocused} onClick={onSubmit}>
            {t("form.comment.comment")}
          </StyledButtonMedium>
        </ButtonWrapper>
      </WrapperColumn>
    </CommentCard>
  );
};

export default InputComment;
