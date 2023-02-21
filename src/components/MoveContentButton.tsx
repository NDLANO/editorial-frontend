/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import Button from '@ndla/button';
import { colors } from '@ndla/core';
import { ChevronLeft } from '@ndla/icons/common';
import { darken } from 'polished';
import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

const StyledMoveContentButton = styled(Button)`
  position: absolute;
  top: 0.1rem;
  right: 1.2rem;
  color: ${colors.support.green};

  &:hover,
  &:focus {
    color: ${darken(0.2, colors.support.green)};
  }
`;

interface Props {
  onMouseDown?: MouseEventHandler;
}

const MoveContentButton = ({ onMouseDown }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledMoveContentButton
      contentEditable={false}
      tabIndex={-1}
      title={t('learningResourceForm.fields.rightAside.moveContent')}
      stripped
      onMouseDown={onMouseDown}>
      <ChevronLeft />
    </StyledMoveContentButton>
  );
};

export default MoveContentButton;
