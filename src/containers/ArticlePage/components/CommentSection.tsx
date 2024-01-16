/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from 'formik';
import { useCallback, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing, fonts } from '@ndla/core';
import { IStatus } from '@ndla/types-backend/draft-api';
import Comment, { CommentType } from './Comment';
import InputComment from './InputComment';
import { ARCHIVED, PUBLISHED, UNPUBLISHED } from '../../../constants';

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

  const [_, { value }, { setValue }] = useField<CommentType[]>('comments');
  const allOpen = useMemo(() => value.every((v) => v.isOpen), [value]);

  const onDelete = useCallback(
    (index: number) => {
      const updatedList = value.filter((_, i) => i !== index);
      setValue(updatedList);
    },
    [value, setValue],
  );

  const toggleAllOpen = (allOpen: boolean) => {
    setValue(value.map((c) => ({ ...c, isOpen: allOpen })));
  };
  const commentsHidden = RESET_COMMENTS_STATUSES.some((s) => s === savedStatus?.current);

  return (
    <CommentColumn data-hidden={commentsHidden} aria-hidden={commentsHidden}>
      <InputComment comments={value ?? []} setComments={setValue} />
      {value.length ? (
        <StyledOpenCloseAll
          variant="stripped"
          onClick={() => toggleAllOpen(allOpen !== undefined ? !allOpen : true)}
          fontWeight="semibold"
        >
          {allOpen ? t('form.hideAll') : t('form.openAll')}
        </StyledOpenCloseAll>
      ) : null}
      <StyledList>
        {value.map((comment, index) => {
          const id = 'id' in comment ? comment.id : comment.generatedId;
          return (
            <Comment
              key={id}
              id={id}
              setComments={setValue}
              comments={value ?? []}
              onDelete={onDelete}
              index={index}
            />
          );
        })}
      </StyledList>
    </CommentColumn>
  );
};

export default memo(CommentSection);
