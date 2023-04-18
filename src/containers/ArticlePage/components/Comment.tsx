/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import styled from '@emotion/styled';
import { colors, spacing, fonts, misc } from '@ndla/core';
import { TrashCanOutline, RightArrow, ExpandMore } from '@ndla/icons/action';
import { IconButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import Tooltip from '@ndla/tooltip';
import { TextAreaV2 } from '@ndla/forms';
import { ChangeEvent, useMemo, useState } from 'react';
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

const StyledClickableTextArea = styled(TextAreaV2)<{ open: boolean }>`
  ${textAreaStyles};
  border: 1px solid transparent;

  &:active,
  &:focus-visible {
    border: 1px solid ${colors.brand.primary};
  }
  & textarea {
    ${(p) =>
      !p.open &&
      css`
        max-height: 30px;
        white-space: nowrap;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      `}
  }
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
  allOpen: boolean | undefined;
  setAllOpen: (v: boolean | undefined) => void;
  comments: CommentType[];
  setComments: (c: CommentType[]) => void;
  onDelete: (index: number) => void;
  index: number;
}

const Comment = ({
  comment,
  allOpen,
  setAllOpen,
  comments,
  setComments,
  onDelete,
  index,
}: Props) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(comment?.content);

  const open = useMemo(
    () => (allOpen !== undefined ? allOpen : comment.isOpen),
    [allOpen, comment.isOpen],
  );

  const [modalOpen, setModalOpen] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInputValue(e.target.value);
  };

  const handleDelete = () => {
    if (index === undefined) return;
    onDelete?.(index);
    setModalOpen(false);
  };

  const toggleOpen = (value?: boolean) => {
    setAllOpen(undefined);
    const _open = value !== undefined ? value : !open;
    const updatedComments = comments.map((c, i) => (index === i ? { ...c, isOpen: _open } : c));
    setComments(updatedComments);
  };

  const focusUpdate = (focus: boolean) => {
    if (!focus) {
      const updatedComments = comments.map((c, i) =>
        i === index ? { ...c, content: inputValue } : c,
      );
      setComments(updatedComments);
    }
  };

  const tooltipText = open ? t('form.hideComment') : t('form.showComment');
  const commentId = `${'id' in comment ? comment.id : comment.generatedId}-comment-section`;

  return (
    <CommentCard>
      <CardContent>
        <TopButtonRow>
          <Tooltip tooltip={tooltipText}>
            <IconButtonV2
              variant="ghost"
              size="xsmall"
              aria-label={tooltipText}
              onClick={() => toggleOpen()}
              aria-expanded={open}
              aria-controls={commentId}
            >
              {open ? <ExpandMore /> : <RightArrow />}
            </IconButtonV2>
          </Tooltip>

          <Tooltip tooltip={t('form.workflow.deleteComment.title')}>
            <IconButtonV2
              variant="ghost"
              size="xsmall"
              aria-label={t('form.workflow.deleteComment.title')}
              onClick={() => setModalOpen(true)}
              colorTheme="danger"
            >
              <TrashCanOutline />
            </IconButtonV2>
          </Tooltip>
        </TopButtonRow>
        <StyledClickableTextArea
          value={inputValue}
          label={t('form.commentField')}
          name={t('form.commentField')}
          labelHidden
          onChange={handleInputChange}
          onFocus={() => {
            focusUpdate(true);
            toggleOpen(true);
          }}
          onBlur={() => focusUpdate(false)}
          id={commentId}
          open={open}
        />
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
