/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import { css, SerializedStyles } from '@emotion/core';
import darken from 'polished/lib/color/darken';
import { colors } from '@ndla/core';
import DeleteForeverButton from './DeleteForeverButton';

const deleteButtonStyle = css`
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
  style?: string | SerializedStyles;
  children?: ReactNode;
  stripped?: boolean;
  onMouseDown?: (event: MouseEvent) => void;
  'data-cy'?: string;
  onClick?: (event: Event) => void;
  title?: string;
  tabIndex?: string;
}

export const DeleteButton = ({ children, style, ...rest }: Props) => (
  <DeleteForeverButton
    data-cy="close-related-button"
    stripped
    css={[deleteButtonStyle, style]}
    {...rest}
  />
);

export default DeleteButton;
