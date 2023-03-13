/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing, fonts } from '@ndla/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  comments: string[];
}

const CommentSection = ({ comments = [] }: Props) => {
  const [allOpen, setAllOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <CommentWrapper>
      <Comment showInput />
      <StyledOpenCloseAll>
        <ButtonV2 variant="stripped" onClick={() => setAllOpen(!allOpen)}>
          {allOpen ? t('form.hideAll') : t('form.openAll')}
        </ButtonV2>
      </StyledOpenCloseAll>
      {comments.map(comment => (
        <Comment key={comment} comment={comment} allOpen={allOpen} />
      ))}
    </CommentWrapper>
  );
};

export default CommentSection;
