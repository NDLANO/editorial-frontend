/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { format } from "date-fns";
import { FieldArrayRenderProps } from "formik";
import { TFunction } from "i18next";
import uniqueId from "lodash/uniqueId";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import styled from "@emotion/styled";
import { colors, spacing, misc } from "@ndla/core";
import { Button, FieldLabel, FieldRoot, FieldTextArea } from "@ndla/primitives";
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

const StyledFieldTextArea = styled(FieldTextArea)`
  ${textAreaStyles}
  border: 1px solid ${colors.brand.neutral7};
`;

const WrapperColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
`;

const StyledFieldRoot = styled(FieldRoot)`
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
  isSubmitting: boolean;
  arrayHelpers: FieldArrayRenderProps;
}

const InputComment = ({ isSubmitting, arrayHelpers }: Props) => {
  const { t } = useTranslation();
  const { userName } = useSession();
  const [inputValue, setInputValue] = useState<Descendant[]>([emptyParagraph]);
  const [isFocused, setIsFocused] = useState(false);

  const addComment = useCallback(() => {
    // We need a temporary unique id in frontend before id is generated in draft-api when comment is created
    const uid = uniqueId();
    arrayHelpers.insert(0, { generatedId: uid, content: inputValue, isOpen: true, solved: false });
  }, [arrayHelpers, inputValue]);

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
        <StyledFieldRoot id="input-comment">
          <FieldLabel srOnly>{t("form.comment.commentField")}</FieldLabel>
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
              hideSpinner
              receiveInitialFocus
            />
          ) : (
            <StyledFieldTextArea
              name={t("form.comment.commentField")}
              placeholder={`${t("form.comment.comment")}...`}
              onFocus={handleFocus}
            />
          )}
        </StyledFieldRoot>
        <ButtonWrapper>
          <Button variant="tertiary" size="small" onClick={onCancel}>
            {t("form.abort")}
          </Button>
          <Button variant="tertiary" size="small" onClick={onSubmit}>
            {t("form.comment.comment")}
          </Button>
        </ButtonWrapper>
      </WrapperColumn>
    </CommentCard>
  );
};

export default InputComment;
