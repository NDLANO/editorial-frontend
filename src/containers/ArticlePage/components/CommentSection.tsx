/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing, fonts } from '@ndla/core';
import { IStatus } from '@ndla/types-backend/draft-api';
import { useField } from 'formik';
import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ARCHIVED, PUBLISHED, UNPUBLISHED } from '../../../constants';
import Comment, { CommentType } from './Comment';
import InputComment from './InputComment';

export const RESET_COMMENTS_STATUSES = [PUBLISHED, ARCHIVED, UNPUBLISHED];
export const COMMENT_WIDTH = 220;
export const SPACING_COMMENT = Number(spacing.small.replace('px', ''));

const CommentColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 53px;
  margin-left: ${SPACING_COMMENT}px;
  width: 100%;
  max-width: ${COMMENT_WIDTH}px;

  &[data-hidden='true'] {
    visibility: hidden;
  }
`;

const StyledList = styled.ul`
  max-width: ${COMMENT_WIDTH}px;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StyledOpenCloseAll = styled(ButtonV2)`
  ${fonts.sizes('16px')};
  margin-left: auto;
`;

interface Props {
  savedStatus?: IStatus;
}
const CommentSection = ({ savedStatus }: Props) => {
  const { t } = useTranslation();

  const [comments] = useField<CommentType[]>('comments');
  const [commentsOpen, setCommentsOpen] = useState<boolean[]>(comments.value.map((c) => c.isOpen));
  const allOpen = useMemo(() => commentsOpen.every((o) => !!o) ?? undefined, [commentsOpen]);

  const updateComments = useCallback(
    (c: CommentType[]) => comments.onChange({ target: { name: 'comments', value: c } }),
    [comments],
  );

  const onDelete = (index: number) => {
    const updatedList = comments.value?.filter((_c, i) => i !== index);
    updateComments(updatedList);
  };

  const toggleAllOpen = (allOpen: boolean) => {
    setCommentsOpen(comments.value.map(() => allOpen));
    comments.onChange({
      target: { name: 'comments', value: comments.value.map((c) => ({ ...c, isOpen: allOpen })) },
    });
  };
  const commentsHidden = RESET_COMMENTS_STATUSES.some((s) => s === savedStatus?.current);

  return (
    <CommentColumn data-hidden={commentsHidden} aria-hidden={commentsHidden}>
      <InputComment comments={comments.value ?? []} setComments={updateComments} />
      {comments.value.length ? (
        <StyledOpenCloseAll
          variant="stripped"
          onClick={() => toggleAllOpen(allOpen !== undefined ? !allOpen : true)}
          fontWeight="semibold"
        >
          {allOpen ? t('form.hideAll') : t('form.openAll')}
        </StyledOpenCloseAll>
      ) : null}
      <StyledList>
        {comments.value.map((comment, index) => (
          <Comment
            key={'id' in comment ? comment.id : comment.generatedId}
            setComments={updateComments}
            comments={comments.value ?? []}
            onDelete={onDelete}
            index={index}
            setCommentsOpen={setCommentsOpen}
            commentsOpen={commentsOpen}
          />
        ))}
      </StyledList>
    </CommentColumn>
  );
};

export default CommentSection;
