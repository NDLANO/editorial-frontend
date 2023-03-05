/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ElementType, ReactNode } from 'react';
import { css } from '@emotion/react';
import { colors, fonts, spacing } from '@ndla/core';

const currentStyle = css`
  color: #${colors.brand.primary};
  background: transparent;
  &:focus,
  &:hover:not([disabled]) {
    color: #fff;
    background: ${colors.brand.primary};
    transform: translate(1px, 1px);
  }
  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const languagePillStyle = css`
  background: ${colors.brand.light};
  color: ${colors.brand.primary};
  box-shadow: none;
  border-radius: ${spacing.xsmall};
  padding: ${spacing.xsmall} ${spacing.small};
  ${fonts.sizes(16, 1.1)};
  font-weight: ${fonts.weight.semibold};
  margin-right: ${spacing.xsmall};
  transition: all 200ms ease;
  display: flex;
  align-items: center;

  .c-icon {
    margin-right: ${spacing.xsmall};
  }
`;

interface Props {
  children: ReactNode;
  component?: ElementType;
  isSubmitting?: boolean;
  current?: boolean;
  to?: string;
}

const LanguagePill = ({
  children,
  isSubmitting = false,
  component: Component = 'div',
  current,
  ...rest
}: Props) => {
  return (
    <Component
      disabled={isSubmitting}
      css={[languagePillStyle, !current ? currentStyle : '']}
      {...rest}>
      {children}
    </Component>
  );
};

export default LanguagePill;
