/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import Button, { ButtonProps } from '@ndla/button';
import { css } from '@emotion/core';
import { fonts, spacing } from '@ndla/core';
import { ReactNode } from 'react';

const buttonStyle = css`
  margin-right: 1rem;

  &:disabled {
    transform: none;
    color: #fff;
  }
`;

const linkStyle = css`
  ${fonts.sizes(16, 1.25)};
  height: ${spacing.large};
  font-weight: ${fonts.weight.semibold};
  box-shadow: none;
  text-decoration: none;
  &:hover,
  &:focus {
    text-decoration: underline;
  }
`;

interface Props extends ButtonProps {
  children?: ReactNode;
  outline?: boolean;
  link?: boolean;
  submit?: boolean;
}

const ActionButton = ({ children, ...rest }: Props) => {
  return (
    <Button css={rest.link ? linkStyle : buttonStyle} {...rest}>
      {children}
    </Button>
  );
};

export default ActionButton;
