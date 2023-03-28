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
import { useFormikContext } from 'formik';
import uniqueId from 'lodash/uniqueId';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCommentsContext } from '../../../components/SlateEditor/CommentsProvider';
import { ARCHIVED, PUBLISHED, UNPUBLISHED } from '../../../constants';
import { ArticleFormType } from '../../FormikForm/articleFormHooks';
import Comment from './Comment';
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

const RESET_COMMENTS_STATUSES = [PUBLISHED, ARCHIVED, UNPUBLISHED];

interface Props {
  savedStatus?: IStatus;
  savedComments?: any; //TODO: update to api type!
}
const CommentSection = ({ savedComments = [], savedStatus }: Props) => {
  const { comments, setComments } = useCommentsContext();
  const [allOpen, setAllOpen] = useState(false);

  const commentsWithId = useMemo(() => {
    return comments.map((c) => {
      if (c.uid) return c;
      else {
        const uid = uniqueId();

        return { ...c, uid: uid };
      }
    });
  }, [comments]);

  const { t } = useTranslation();
  const { setFieldValue } = useFormikContext<ArticleFormType>();

  useEffect(() => {
    // TODO: Se på denne logikken og hvordan commentWithId settes!!!!!
    setComments(savedComments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (RESET_COMMENTS_STATUSES.find((s) => s === savedStatus?.current)) {
      setComments([]);
    }
  }, [savedStatus, setComments]);

  const onDelete = (index: number) => {
    const updatedList = comments.filter((c, i) => i !== index);
    setComments(updatedList);
    setFieldValue('comments', updatedList);
  };
  return (
    <>
      {RESET_COMMENTS_STATUSES.every((s) => s !== savedStatus?.current) && (
        <CommentColumn>
          <InputComment
            comments={commentsWithId}
            setComments={setComments}
            setFieldValue={setFieldValue}
          />
          {commentsWithId.length ? (
            <StyledOpenCloseAll variant="stripped" onClick={() => setAllOpen(!allOpen)}>
              {allOpen ? t('form.hideAll') : t('form.openAll')}
            </StyledOpenCloseAll>
          ) : null}
          <StyledList>
            {commentsWithId.map((comment, index) => (
              <Comment
                key={comment.uid}
                comment={comment}
                setComments={setComments}
                comments={commentsWithId}
                allOpen={allOpen}
                onDelete={onDelete}
                index={index}
                setFieldValue={setFieldValue}
              />
            ))}
          </StyledList>
        </CommentColumn>
      )}
    </>
  );
};

export default CommentSection;
