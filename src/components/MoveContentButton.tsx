/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import darken from 'polished/lib/color/darken';
import { css } from '@emotion/core';
import { injectT, tType } from '@ndla/i18n';
import { colors } from '@ndla/core';
import Button from '@ndla/button';
import { ChevronLeft } from '@ndla/icons/common';

const moveContentButtonStyle = css`
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
  onMouseDown: () => void;
}

const MoveContentButton = ({ onMouseDown, t }: Props & tType) => {
  return (
    <Button
      css={moveContentButtonStyle}
      title={t('learningResourceForm.fields.rightAside.moveContent')}
      stripped
      onMouseDown={onMouseDown}>
      <ChevronLeft />
    </Button>
  );
};

export default injectT(MoveContentButton);
