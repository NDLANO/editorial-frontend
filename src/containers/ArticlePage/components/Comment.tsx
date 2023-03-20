/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import styled from '@emotion/styled';
import { colors, spacing, fonts } from '@ndla/core';
import { TrashCanOutline, RightArrow, ExpandMore } from '@ndla/icons/action';
import { ButtonV2, IconButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import Tooltip from '@ndla/tooltip';
import { TextAreaV2 } from '@ndla/forms';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { css } from '@emotion/react';

export const textAreaStyles = css`
  width: 100%;
  border: 1px solid ${colors.brand.neutral7};
  min-height: 30px;

  input,
  textarea {
    ${fonts.sizes('16px')};
    margin: 0px;
    padding: ${spacing.xxsmall};
    font-weight: 300;
  }
`;

const StyledClickableTextArea = styled(TextAreaV2)`
  ${textAreaStyles};
  border: 1px solid transparent;

  &:active,
  &:focus,
  &:focus-within {
    border: 1px solid ${colors.brand.primary};
  }
`;
const ClosedTextField = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: ${spacing.xxsmall};
  border: 1px solid transparent;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${spacing.xsmall};
`;

const StyledButton = styled(ButtonV2)<{ flex: number }>`
  flex: ${(p) => p.flex};
`;

const CommentCard = styled.li`
  display: flex;
  width: 200px;
  border: 1px solid ${colors.brand.neutral7};
  border-radius: 5px;
  padding: 10px;
  ${fonts.sizes('16px')};
  font-weight: 300;
`;

const CardContent = styled.div`
  display: flex;
`;

const InputAndButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  width: 100%;
`;

const StyledTrashIcon = styled(TrashCanOutline)`
  color: ${colors.support.red};
`;

interface Props {
  comment?: string;
  showInput?: boolean;
  allOpen?: boolean;
}

const Comment = ({ comment, showInput = false, allOpen = false }: Props) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(comment);
  const [open, setOpen] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const displayEditButtons = useMemo(() => inputValue !== comment, [inputValue]);

  useEffect(() => {
    comment && setInputValue(comment);
  }, [comment]);

  useEffect(() => {
    setOpen(allOpen);
  }, [allOpen]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInputValue(e.target.value);
  };

  return (
    <CommentCard>
      {showInput && (
        <InputAndButtons>
          <TextAreaV2
            css={textAreaStyles}
            label={t('form.commentField')}
            name={t('form.commentField')}
            placeholder={`${t('form.comment')}...`}
            labelHidden
            value={inputValue}
            onChange={handleInputChange}
          />
          <ButtonWrapper>
            <StyledButton
              shape="pill"
              size="xsmall"
              colorTheme="danger"
              flex={1}
              disabled={!inputValue}
              onClick={() => setInputValue('')}
            >
              {t('form.abort')}
            </StyledButton>
            <StyledButton
              variant="outline"
              shape="pill"
              size="xsmall"
              flex={2}
              disabled={!inputValue}
              onClick={() => console.log('clicked comment')}
            >
              {t('form.comment')}
            </StyledButton>
          </ButtonWrapper>
        </InputAndButtons>
      )}
      {comment && (
        <InputAndButtons>
          <CardContent>
            <Tooltip tooltip={open ? t('form.hideComment') : t('form.showComment')}>
              <IconButtonV2
                variant="ghost"
                size="xsmall"
                aria-label={open ? t('form.hideComment') : t('form.showComment')}
                onMouseDown={() => setOpen(!open)}
                aria-expanded={open}
                aria-controls="comment-section"
              >
                <> {open ? <ExpandMore /> : <RightArrow />}</>
              </IconButtonV2>
            </Tooltip>

            {open ? (
              <StyledClickableTextArea
                value={inputValue}
                label={t('form.commentField')}
                name={t('form.commentField')}
                labelHidden
                onChange={handleInputChange}
                id="comment-section"
              />
            ) : (
              <ClosedTextField id="comment-section">{inputValue}</ClosedTextField>
            )}

            <Tooltip tooltip={t('form.trash')}>
              <IconButtonV2
                variant="ghost"
                size="xsmall"
                aria-label={t('form.trash')}
                onMouseDown={() => console.log('clicked delete')}
              >
                <StyledTrashIcon />
              </IconButtonV2>
            </Tooltip>
          </CardContent>
          {displayEditButtons && (
            <ButtonWrapper>
              <StyledButton
                shape="pill"
                size="xsmall"
                colorTheme="danger"
                flex={1}
                disabled={!inputValue}
                onClick={() => setInputValue(comment)}
              >
                {t('form.abort')}
              </StyledButton>
              <StyledButton
                variant="outline"
                shape="pill"
                size="xsmall"
                flex={1}
                disabled={!inputValue}
                onClick={() => console.log('clicked comment')}
              >
                {t('form.save')}
              </StyledButton>
            </ButtonWrapper>
          )}
        </InputAndButtons>
      )}
    </CommentCard>
  );
};

export default Comment;
