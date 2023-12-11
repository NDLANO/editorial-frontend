/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { format } from 'date-fns';
import { TFunction } from 'i18next';
import uniqueId from 'lodash/uniqueId';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { colors, fonts, spacing, misc } from '@ndla/core';
import { TextAreaV2 } from '@ndla/forms';
import { COMMENT_COLOR, CommentType, textAreaStyles } from './Comment';
import formatDate, { formatDateForBackend } from '../../../util/formatDate';
import { useSession } from '../../Session/SessionProvider';

const CommentCard = styled.div`
  max-width: inherit;
  width: 100%;
  border: 1px solid ${colors.brand.greyMedium};
  border-radius: ${misc.borderRadius};
  padding: ${spacing.small};
  font-weight: ${fonts.weight.light};
  background-color: ${COMMENT_COLOR};
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

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${spacing.xsmall};
`;

export const getCommentWithInfoText = (
  comment: string,
  userName: string | undefined,
  t: TFunction,
) => {
  const currentDate = new Date();
  const dateTime = formatDateForBackend(currentDate);
  const formattedDate = formatDate(dateTime);
  const formattedTime = format(currentDate, 'HH:mm');

  return `${comment}\n${t('form.workflow.addComment.createdBy')} ${userName?.split(
    ' ',
  )[0]} (${formattedDate} - ${formattedTime})`;
};

interface Props {
  comments: CommentType[];
  setComments: (c: CommentType[]) => void;
}

const InputComment = ({ comments, setComments }: Props) => {
  const { t } = useTranslation();
  const { userName } = useSession();
  const [inputValue, setInputValue] = useState('');
  const [clickedInputField, setClickedInputField] = useState(false);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInputValue(e.target.value);
  }, []);

  const addComment = useCallback(() => {
    // We need a temporary unique id in frontend before id is generated in draft-api when comment is created
    const uid = uniqueId();
    const updatedComments = [{ generatedId: uid, content: inputValue, isOpen: true }, ...comments];
    setComments(updatedComments);
  }, [comments, inputValue, setComments]);

  const createComment = useRef<HTMLTextAreaElement>(null);

  const handleFocus = useCallback(() => {
    if (!clickedInputField) {
      const comment = getCommentWithInfoText(inputValue, userName, t);
      setInputValue(comment);
      setTimeout(() => createComment.current?.setSelectionRange(0, 0), 0);
    }

    setClickedInputField(true);
  }, [clickedInputField, inputValue, t, userName]);

  const onClickSmall = useCallback(() => {
    setInputValue('');
    setClickedInputField(false);
  }, []);

  const onClickMedium = useCallback(() => {
    addComment();
    setInputValue('');
    setClickedInputField(false);
  }, [addComment]);

  return (
    <CommentCard>
      <WrapperColumn>
        <TextAreaV2
          css={textAreaStyles}
          label={t('form.commentField')}
          name={t('form.commentField')}
          placeholder={`${t('form.comment')}...`}
          labelHidden
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          ref={createComment}
        />
        <ButtonWrapper>
          <StyledButtonSmall
            shape="pill"
            size="xsmall"
            colorTheme="danger"
            disabled={!inputValue}
            onClick={onClickSmall}
          >
            {t('form.abort')}
          </StyledButtonSmall>
          <StyledButtonMedium
            variant="outline"
            shape="pill"
            size="xsmall"
            disabled={!inputValue}
            onClick={onClickMedium}
          >
            {t('form.comment')}
          </StyledButtonMedium>
        </ButtonWrapper>
      </WrapperColumn>
    </CommentCard>
  );
};

export default InputComment;
