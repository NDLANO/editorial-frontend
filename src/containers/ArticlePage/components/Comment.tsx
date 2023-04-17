/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import styled from '@emotion/styled';
import { colors, spacing, fonts, misc } from '@ndla/core';
import { TrashCanOutline, RightArrow, ExpandMore } from '@ndla/icons/action';
import { ButtonV2, IconButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import Tooltip from '@ndla/tooltip';
import { TextAreaV2 } from '@ndla/forms';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { IComment } from '@ndla/types-backend/build/draft-api';
import AlertModal from '../../../components/AlertModal';

export const textAreaStyles = css`
  width: 100%;
  border: 1px solid ${colors.brand.neutral7};
  min-height: 25px;

  input,
  textarea {
    ${fonts.sizes('16px')};
    margin: 0px;
    padding: 0 ${spacing.xxsmall};
    font-weight: ${fonts.weight.light};
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
  padding: 0 ${spacing.xxsmall};
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
  border-radius: ${misc.borderRadius};
  padding: ${spacing.xsmall};
  ${fonts.sizes('16px')};
  font-weight: ${fonts.weight.light};
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
export type CommentType = { generatedId?: string; content: string; isOpen: boolean } | IComment;

interface Props {
  comment: CommentType;
  allOpen: boolean;
  comments: CommentType[];
  setComments: (c: CommentType[]) => void;
  onDelete: (index: number) => void;
  index: number;
}

const Comment = ({ comment, allOpen = false, comments, setComments, onDelete, index }: Props) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(comment?.content);
  const [open, setOpen] = useState(comment?.isOpen !== undefined ? comment?.isOpen : true);
  const [modalOpen, setModalOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const closedComment = useRef<HTMLDivElement>(null);
  const openComment = useRef<HTMLTextAreaElement>(null);

  const rendered = useRef(false);

  useEffect(() => {
    const closedClicked = () => {
      setOpen(true);
      openComment.current?.focus();
    };

    const closed = closedComment?.current;
    if (closed) closed.addEventListener('click', closedClicked);

    return () => {
      closed?.removeEventListener('click', closedClicked);
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

  useEffect(() => {
    if (!focused) {
      const updatedComments = comments.map((c, i) =>
        i === index ? { ...c, content: inputValue } : c,
      );
      setComments(updatedComments);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInputValue(e.target.value);
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
  };

  return (
    <CommentCard>
      <CardContent>
        <TopButtonRow>
          <Tooltip tooltip={open ? t('form.hideComment') : t('form.showComment')}>
            <IconButtonV2
              variant="ghost"
              size="xsmall"
              aria-label={open ? t('form.hideComment') : t('form.showComment')}
              onMouseDown={() => toggleOpen()}
              aria-expanded={open}
              aria-controls="comment-section"
            >
              {open ? <ExpandMore /> : <RightArrow />}
            </IconButtonV2>
          </Tooltip>

          <Tooltip tooltip={t('form.workflow.deleteComment.title')}>
            <IconButtonV2
              variant="ghost"
              size="xsmall"
              aria-label={t('form.workflow.deleteComment.title')}
              onMouseDown={() => setModalOpen(true)}
              colorTheme="danger"
            >
              <TrashCanOutline />
            </IconButtonV2>
          </Tooltip>
        </TopButtonRow>
        {open ? (
          <StyledClickableTextArea
            value={inputValue}
            label={t('form.commentField')}
            name={t('form.commentField')}
            labelHidden
            onChange={handleInputChange}
            ref={openComment}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        ) : (
          <ClosedTextField ref={closedComment}>{inputValue}</ClosedTextField>
        )}
      </CardContent>

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
