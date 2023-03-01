/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import styled from '@emotion/styled';
import { colors, spacing, fonts } from '@ndla/core';
import { Done } from '@ndla/icons/editor';
import { IconButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import Tooltip from '@ndla/tooltip';
import { InputV2 } from '@ndla/forms';

const StyledInputField = styled(InputV2)``;

const CommentCard = styled.li`
  width: 200px;
  border: 1px solid ${colors.brand.neutral7};
  border-radius: 5px;
  padding: ${spacing.xsmall};
  ${fonts.sizes('16px')};
`;

const StyledTitle = styled.div`
  color: ${colors.brand.primary};
`;

const StyledComment = styled.div`
  font-weight: ${fonts.weight.light};
`;
const StyledDateTime = styled.div`
  ${fonts.sizes('10px')}
  font-weight: ${fonts.weight.light};
  color: ${colors.text.light};
  display: flex;
  gap: ${spacing.xsmall}
  
`;
const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface Props {
  comment?: string;
  showInput?: boolean;
}

const Comment = ({ comment, showInput = false }: Props) => {
  const { t } = useTranslation();

  return (
    <CommentCard>
      <TitleWrapper>
        <StyledTitle>Fornavn Etternavn</StyledTitle>
        {comment && (
          <Tooltip tooltip={t('form.comment')}>
            <IconButtonV2
              variant="ghost"
              size="xsmall"
              aria-label={t('form.comment')}
              onMouseDown={() => console.log('clicked')}>
              <Done />
            </IconButtonV2>
          </Tooltip>
        )}
      </TitleWrapper>
      {showInput && <StyledInputField label={''} name={''} />}
      {comment && (
        <>
          <StyledDateTime>
            <span>09:48</span>
            <span>17. januar 2023</span>
          </StyledDateTime>
          <StyledComment>{comment}</StyledComment>
        </>
      )}
    </CommentCard>
  );
};

export default Comment;
