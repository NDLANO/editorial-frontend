/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { colors, spacing, fonts, misc } from '@ndla/core';
import { TextAreaV2 } from '@ndla/forms';
import { TrashCanOutline, RightArrow, ExpandMore } from '@ndla/icons/action';
import { IComment } from '@ndla/types-backend/draft-api';
import AlertModal from '../../../components/AlertModal';

export const COMMENT_COLOR = colors.support.yellowLight;

export const textAreaStyles = css`
  width: 100%;
  border: 1px solid ${colors.brand.neutral7};
  min-height: 25px;
  background-color: ${COMMENT_COLOR};

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
  &:focus-visible {
    border: 1px solid ${colors.brand.primary};
  }
  textarea {
    &[data-open='false'] {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-height: 30px;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
`;

const CommentCard = styled.li`
  border: 1px solid ${colors.brand.greyMedium};
  border-radius: ${misc.borderRadius};
  padding: ${spacing.xsmall};
  ${fonts.sizes('16px')};
  font-weight: ${fonts.weight.light};
  background-color: ${COMMENT_COLOR};
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
  comments: CommentType[];
  setComments: (c: CommentType[]) => void;
  onDelete: (index: number) => void;
  index: number;
}

const Comment = ({ comments, setComments, onDelete, index }: Props) => {
  const { t } = useTranslation();
  const comment = comments[index];

  const [inputValue, setInputValue] = useState(comment?.content);
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
    const _open = value !== undefined ? value : !comment.isOpen;
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

  const tooltipText = comment.isOpen ? t('form.hideComment') : t('form.showComment');
  const commentId = `${'id' in comment ? comment.id : comment.generatedId}-comment-section`;

  return (
    <CommentCard>
      <CardContent>
        <TopButtonRow>
          <IconButtonV2
            variant="ghost"
            size="xsmall"
            aria-label={tooltipText}
            title={tooltipText}
            onClick={() => toggleOpen()}
            aria-expanded={comment.isOpen}
            aria-controls={commentId}
          >
            {comment.isOpen ? <ExpandMore /> : <RightArrow />}
          </IconButtonV2>

          <IconButtonV2
            variant="ghost"
            size="xsmall"
            aria-label={t('form.workflow.deleteComment.title')}
            title={t('form.workflow.deleteComment.title')}
            onClick={() => setModalOpen(true)}
            colorTheme="danger"
          >
            <TrashCanOutline />
          </IconButtonV2>
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
          data-open={comment.isOpen}
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
