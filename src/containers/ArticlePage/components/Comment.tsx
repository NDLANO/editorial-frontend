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
import { useFormikContext } from 'formik';
import { CommentType } from '../../../interfaces';
import AlertModal from '../../../components/AlertModal';

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
  comment?: CommentType;
  showInput?: boolean;
  allOpen?: boolean;
  comments: CommentType[];
  setComments: (comment: CommentType[]) => void;
  savedComment?: any; // update type from api
  onDelete?: (index: number) => void;
  index?: number;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
}

const Comment = ({
  comment,
  showInput = false,
  allOpen = false,
  comments,
  setComments,
  savedComment,
  onDelete,
  index,
  setFieldValue,
}: Props) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(comment?.content);
  const [open, setOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [displayEditButtons, setDisplayEditButtons] = useState(false);

  useEffect(() => {
    setDisplayEditButtons(inputValue !== comment?.content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  useEffect(() => {
    comment && setInputValue(comment.content);
  }, [comment]);

  useEffect(() => {
    setOpen(allOpen);
  }, [allOpen]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (indexPosition?: number) => {
    if (inputValue) {
      const updatedComments =
        indexPosition !== undefined
          ? comments.map((c, index) =>
              indexPosition === index ? { ...savedComment, content: inputValue } : c,
            )
          : [{ content: inputValue }, ...comments];
      setComments(updatedComments);
      setFieldValue('comments', updatedComments);
      setDisplayEditButtons(false);
    }
  };

  const handleDelete = () => {
    if (index === undefined) return;
    onDelete?.(index);
    setModalOpen(false);
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
              onClick={() => {
                handleSubmit();
                setInputValue('');
              }}
            >
              {t('form.comment')}
            </StyledButton>
          </ButtonWrapper>
        </InputAndButtons>
      )}
      {comment && (
        <InputAndButtons>
          <CardContent>
            {!displayEditButtons && (
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
            )}
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

            {!displayEditButtons && (
              <Tooltip tooltip={t('form.trash')}>
                <IconButtonV2
                  variant="ghost"
                  size="xsmall"
                  aria-label={t('form.trash')}
                  onMouseDown={() => setModalOpen(true)}
                >
                  <StyledTrashIcon />
                </IconButtonV2>
              </Tooltip>
            )}
          </CardContent>
          {displayEditButtons && (
            <ButtonWrapper>
              <StyledButton
                shape="pill"
                size="xsmall"
                colorTheme="danger"
                flex={1}
                disabled={!inputValue}
                onClick={() => {
                  setInputValue(comment.content);
                  setDisplayEditButtons(false);
                }}
              >
                {t('form.abort')}
              </StyledButton>
              <StyledButton
                variant="outline"
                shape="pill"
                size="xsmall"
                flex={1}
                disabled={!inputValue}
                onClick={() => handleSubmit(index)}
              >
                {t('form.save')}
              </StyledButton>
            </ButtonWrapper>
          )}
        </InputAndButtons>
      )}

      <AlertModal
        title={t('form.workflow.deleteComment.title')}
        label={t('form.workflow.deleteComment.title')}
        show={modalOpen}
        text={t('form.workflow.deleteComment.modal')}
        actions={[
          {
            text: t('form.abort'),
            onClick: () => setModalOpen(!modalOpen),
          },
          {
            text: t('form.workflow.deleteComment.button'),
            onClick: handleDelete,
          },
        ]}
        onCancel={() => setModalOpen(!modalOpen)}
      />
    </CommentCard>
  );
};

export default Comment;
