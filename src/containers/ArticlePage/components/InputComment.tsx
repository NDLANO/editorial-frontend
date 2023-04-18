/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import styled from '@emotion/styled';
import { colors, fonts, spacing, misc } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { TextAreaV2 } from '@ndla/forms';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import uniqueId from 'lodash/uniqueId';
import { format } from 'date-fns';
import { ButtonV2 } from '@ndla/button';
import { useSession } from '../../Session/SessionProvider';
import { CommentType, textAreaStyles } from './Comment';
import formatDate, { formatDateForBackend } from '../../../util/formatDate';

const CommentCard = styled.div`
  width: 200px;
  border: 1px solid ${colors.brand.neutral7};
  border-radius: ${misc.borderRadius};
  padding: ${spacing.xsmall};
  font-weight: ${fonts.weight.light};
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
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${spacing.xsmall};
`;

interface Props {
  comments: CommentType[];
  setComments: (c: CommentType[]) => void;
}

const InputComment = ({ comments, setComments }: Props) => {
  const { t } = useTranslation();
  const { userName } = useSession();
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInputValue(e.target.value);
  }, []);

  const addComment = () => {
    // We need a temporary unique id in frontend before id is generated in draft-api when comment is created
    const uid = uniqueId();
    const updatedComments = [{ generatedId: uid, content: inputValue, isOpen: true }, ...comments];
    setComments(updatedComments);
  };
  const createComment = useRef<HTMLTextAreaElement>(null);

  const handleFocus = () => {
    const currentDate = new Date();
    const dateTime = formatDateForBackend(currentDate);
    const formattedDate = formatDate(dateTime);
    const formattedTime = format(currentDate, 'HH:mm');

    setInputValue(
      `\n${t('form.workflow.addComment.from')} ${
        userName?.split(' ')[0]
      } (${formattedDate} - ${formattedTime})`,
    );
    createComment.current?.setSelectionRange(0, 0);
  };

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
          onFocus={() => handleFocus()}
          ref={createComment}
        />
        <ButtonWrapper>
          <StyledButtonSmall
            shape="pill"
            size="xsmall"
            colorTheme="danger"
            disabled={!inputValue}
            onClick={() => setInputValue('')}
          >
            {t('form.abort')}
          </StyledButtonSmall>
          <StyledButtonMedium
            variant="outline"
            shape="pill"
            size="xsmall"
            disabled={!inputValue}
            onClick={() => {
              addComment();
              setInputValue('');
            }}
          >
            {t('form.comment')}
          </StyledButtonMedium>
        </ButtonWrapper>
      </WrapperColumn>
    </CommentCard>
  );
};

export default InputComment;
