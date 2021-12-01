/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import Button from '@ndla/button';
import { colors } from '@ndla/core';
import { css } from '@emotion/core';
import { ReactNode } from 'react';

const menuItemSaveButtonStyle = css`
  &,
  &:disabled {
    height: 24px;
    width: 24px;
    min-width: 24px;
    background-color: ${colors.brand.greyDark};
    border-color: ${colors.brand.greyDark};
    padding: 0;
    line-height: 16.9px;
  }
`;

interface Props {
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
  'data-testid'?: string;
}

const MenuItemSaveButton = ({ children, ...rest }: Props) => {
  return (
    <Button css={menuItemSaveButtonStyle} {...rest}>
      {children}
    </Button>
  );
};

export default MenuItemSaveButton;
