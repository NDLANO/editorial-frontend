/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import Button from '@ndla/button';

const EditButton = styled(Button)`
  transition: color 200ms ease;
  color: ${props => (props.isActive ? '#fff' : colors.brand.grey)};
  padding: ${spacing.xsmall};
  display: flex;
  align-items: center;
  justify-content: center;

  &:focus,
  &:hover {
    color: #fff;
  }
`;
interface Props {
  isActive?: boolean;
  children: React.ReactNode;
  stripped: boolean;
  tabIndex: number;
  onClick: (evt: MouseEvent) => void;
}

const ImageEditorButton = ({ isActive, children, ...rest }: Props) => (
  <EditButton isActive={isActive} {...rest}>
    {children}
  </EditButton>
);

export default ImageEditorButton;
