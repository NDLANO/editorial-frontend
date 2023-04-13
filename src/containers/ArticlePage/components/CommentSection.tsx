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
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ARCHIVED, PUBLISHED, UNPUBLISHED } from '../../../constants';
import Comment, { CommentType } from './Comment';
import InputComment from './InputComment';

const CommentColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;
  margin-left: ${spacing.nsmall};
`;

const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 0;
`;

const StyledOpenCloseAll = styled(ButtonV2)`
  ${fonts.sizes('16px')};
  font-weight: ${fonts.weight.semibold};
  margin: 0;
  margin-left: auto;
`;

export const RESET_COMMENTS_STATUSES = [PUBLISHED, ARCHIVED, UNPUBLISHED];

interface Props {
  savedStatus?: IStatus;
}
const CommentSection = ({ savedStatus }: Props) => {
  const [allOpen, setAllOpen] = useState(false);

  const { t } = useTranslation();

  const [comments] = useField<CommentType[]>('comments');
  const { onChange, value } = comments;

  const updateComments = useCallback(
    (c: CommentType[]) => onChange({ target: { name: 'comments', value: c } }),
    [onChange],
  );
  useEffect(() => {
    if (RESET_COMMENTS_STATUSES.find((s) => s === savedStatus?.current)) {
      updateComments([]);
    }
  }, [savedStatus, updateComments]);

  const onDelete = (index: number) => {
    const updatedList = value?.filter((c, i) => i !== index);

    updateComments(updatedList);
  };

  return (
    <>
      {RESET_COMMENTS_STATUSES.every((s) => s !== savedStatus?.current) && (
        <CommentColumn>
          <InputComment
            comments={value ?? []}
            setComments={updateComments}
            setFieldValue={onChange}
          />
          {value.length ? (
            <StyledOpenCloseAll variant="stripped" onClick={() => setAllOpen(!allOpen)}>
              {allOpen ? t('form.hideAll') : t('form.openAll')}
            </StyledOpenCloseAll>
          ) : null}
          <StyledList>
            {value.map((comment, index) => (
              <Comment
                key={'id' in comment ? comment.id : comment.generatedId}
                comment={comment}
                setComments={updateComments}
                comments={value ?? []}
                allOpen={allOpen}
                onDelete={onDelete}
                index={index}
              />
            ))}
          </StyledList>
        </CommentColumn>
      )}
    </>
  );
};

export default CommentSection;
