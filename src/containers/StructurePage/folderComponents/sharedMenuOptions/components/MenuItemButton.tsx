/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef, ReactNode } from 'react';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';

const StyledMenuItemButton = styled(ButtonV2)`
  display: flex;
  align-items: center;
  margin: 0 ${spacing.xxsmall};
`;

interface Props {
  children: ReactNode;
  'data-testid'?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const MenuItemButton = forwardRef<HTMLButtonElement, Props>(({ children, ...rest }, ref) => (
  <StyledMenuItemButton ref={ref} variant="stripped" {...rest}>
    {children}
  </StyledMenuItemButton>
));

export default MenuItemButton;
