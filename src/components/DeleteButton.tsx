/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, ReactNode } from 'react';
import { darken } from 'polished';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import DeleteForeverButton from './DeleteForeverButton';

const StyledDeleteButton = styled(DeleteForeverButton)`
  position: absolute;
  top: 0.1rem;
  right: 0.2rem;
  color: ${colors.support.red};

  &:hover,
  &:focus {
    color: ${darken(0.2, colors.support.red)};
  }
`;

interface Props {
  children?: ReactNode;
  stripped?: boolean;
  onMouseDown?: (event: MouseEvent) => void;
  'data-cy'?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  tabIndex?: string;
}

export const DeleteButton = ({ children, ...rest }: Props) => (
  <StyledDeleteButton data-cy="close-related-button" stripped {...rest} />
);

export default DeleteButton;
