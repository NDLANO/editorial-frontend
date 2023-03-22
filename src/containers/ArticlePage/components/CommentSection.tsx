/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing, fonts } from '@ndla/core';
import { useFormikContext } from 'formik';
import { useState, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { CommentType } from '../../../interfaces';
import Comment from './Comment';

const CommentWrapper = styled.ul`
  list-style: none;
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  margin-left: ${spacing.nsmall};
`;

const StyledOpenCloseAll = styled.li`
  ${fonts.sizes('16px')};
  font-weight: ${fonts.weight.semibold};
  margin: 0;
  margin-left: auto;
`;

interface Props {
  comments: CommentType[];
  savedComments?: any; //TODO: update to api type!
}
//TODO: update any type!
const CommentSection = <T extends any>({ comments = [], savedComments }: Props) => {
  const [commentList, setCommentList] = useState<CommentType[]>(comments);
  const [allOpen, setAllOpen] = useState(false);
  const { t } = useTranslation();
  const { setFieldValue } = useFormikContext<T>();

  const onDelete = (index: number) => {
    const updatedList = commentList.filter((c, i) => i !== index);
    setCommentList(updatedList);
    setFieldValue('comments', updatedList);
  };
  return (
    <CommentWrapper>
      <Comment
        showInput
        setComments={setCommentList}
        comments={commentList}
        setFieldValue={setFieldValue}
      />
      {comments.length ? (
        <StyledOpenCloseAll>
          <ButtonV2 variant="stripped" onClick={() => setAllOpen(!allOpen)}>
            {allOpen ? t('form.hideAll') : t('form.openAll')}
          </ButtonV2>
        </StyledOpenCloseAll>
      ) : null}
      {commentList.map((comment, index) => (
        <Comment
          key={`${comment}_${index}`}
          comment={comment}
          setComments={setCommentList}
          comments={commentList}
          allOpen={allOpen}
          savedComment={savedComments?.[index]}
          onDelete={onDelete}
          index={index}
          setFieldValue={setFieldValue}
        />
      ))}
    </CommentWrapper>
  );
};

export default CommentSection;
