/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import { colors, spacing } from '@ndla/core';
import Button from '@ndla/button';
import styled from '@emotion/styled';

const StyledAddButton = styled(Button)`
  &,
  &:disabled,
  &:hover,
  &:focus {
    white-space: nowrap;
    color: ${colors.brand.grey};
    font-size: 1.2rem;
    border-left: 1px solid #eaeaea;
    border-right: 1px solid #eaeaea;
    background: linear-gradient(180deg, white, #e9eff2 50%, #e9eff2 100%);
    padding: 0 ${spacing.small};
    height: 100%;
  }
`;

interface Props {
  onClick: () => void;
  stripped?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

const AddResourceButton = ({ children, ...rest }: Props) => (
  <StyledAddButton type="button" {...rest}>
    {children}
  </StyledAddButton>
);

export default AddResourceButton;
