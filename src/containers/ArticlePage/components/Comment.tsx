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
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { CommentType } from '../../../components/SlateEditor/CommentsProvider';
import AlertModal from '../../../components/AlertModal';
import CancelButton from './CancelButton';
import SaveButton from './SaveButton';

export const textAreaStyles = css`
  width: 100%;
  border: 1px solid ${colors.brand.neutral7};
  min-height: 30px;

  input,
  textarea {
    ${fonts.sizes('16px')};
    margin: 0px;
    padding: 0 ${spacing.xxsmall};
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

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${spacing.xsmall};
`;

export const StyledButton = styled(ButtonV2)<{ flex: number }>`
  flex: ${(p) => p.flex};
`;

const CommentCard = styled.li`
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

export const InputAndButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  width: 100%;
`;

const StyledTrashIcon = styled(TrashCanOutline)`
  color: ${colors.support.red};
`;

interface Props {
  comment: CommentType;
  allOpen: boolean;
  comments: CommentType[];
  setComments: (c: CommentType[]) => void;
  onDelete: (index: number) => void;
  index: number;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
}

const Comment = ({
  comment,
  allOpen = false,
  comments,
  setComments,
  onDelete,
  index,
  setFieldValue,
}: Props) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(comment?.content);
  const [open, setOpen] = useState(comment?.isOpen !== undefined ? comment?.isOpen : true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const closedComment = useRef<HTMLDivElement>(null);
  const openComment = useRef<HTMLTextAreaElement>(null);

  const rendered = useRef(false);

  useEffect(() => {
    const closedClicked = () => {
      setOpen(true);
      openComment.current?.focus();
      setEditMode(true);
    };
    const openClicked = () => {
      setEditMode(true);
    };

    const closed = closedComment?.current;
    const open = openComment?.current;
    if (closed) closed.addEventListener('click', closedClicked);
    if (open) open.addEventListener('click', openClicked);

    return () => {
      closed?.removeEventListener('click', closedClicked);
      open?.removeEventListener('click', openClicked);
    };
  }, [open]);

  useEffect(() => {
    comment && setInputValue(comment.content);
  }, [comment]);

  useEffect(() => {
    if (rendered.current) {
      toggleOpen(allOpen);
    } else {
      rendered.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allOpen]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInputValue(e.target.value);
  };

  const updateComment = (indexPosition: number) => {
    const updatedComments = comments.map((c, index) =>
      indexPosition === index ? { ...c, content: inputValue } : c,
    );
    setComments(updatedComments);
    setFieldValue('comments', updatedComments);
    setEditMode(false);
  };

  const handleDelete = () => {
    if (index === undefined) return;
    onDelete?.(index);
    setModalOpen(false);
  };

  const toggleOpen = (value?: boolean) => {
    const _open = value !== undefined ? value : !open;
    setOpen(_open);
    const updatedComments = comments.map((c, i) => (index === i ? { ...c, isOpen: _open } : c));
    setComments(updatedComments);
    setFieldValue('comments', updatedComments);
  };

  return (
    <CommentCard>
      <InputAndButtons>
        <CardContent>
          {!editMode && (
            <Tooltip tooltip={open ? t('form.hideComment') : t('form.showComment')}>
              <IconButtonV2
                variant="ghost"
                size="xsmall"
                aria-label={open ? t('form.hideComment') : t('form.showComment')}
                onMouseDown={() => toggleOpen()}
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
              ref={openComment}
            />
          ) : (
            <ClosedTextField ref={closedComment}>{inputValue}</ClosedTextField>
          )}

          {!editMode && (
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
        {editMode && (
          <ButtonWrapper>
            <CancelButton
              disabled={!inputValue}
              onClick={() => {
                setInputValue(comment.content);
                setEditMode(false);
              }}
            />
            <SaveButton disabled={!inputValue} onClick={() => updateComment(index)} />
          </ButtonWrapper>
        )}
      </InputAndButtons>

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
