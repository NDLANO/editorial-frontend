/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import Button from '@ndla/button';
import { spacing } from '@ndla/core';
import styled from '@emotion/styled';

const StyledMenuItemButton = styled(Button)`
  display: flex;
  align-items: center;
  margin: calc(${spacing.small} / 2);
`;

interface Props {
  children: ReactNode;
  stripped?: boolean;
  'data-testid'?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const MenuItemButton = ({ children, ...rest }: Props) => {
  return <StyledMenuItemButton {...rest}>{children}</StyledMenuItemButton>;
};

export default MenuItemButton;
