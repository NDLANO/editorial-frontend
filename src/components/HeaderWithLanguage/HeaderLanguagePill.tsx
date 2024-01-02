/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ElementType, HTMLProps, ReactNode } from 'react';
import { css } from '@emotion/react';
import { colors, fonts, spacing } from '@ndla/core';

const languagePillStyle = css`
  color: ${colors.brand.primary};
  background: transparent;
  padding: ${spacing.xsmall} ${spacing.small};
  box-shadow: none;
  border-radius: ${spacing.xsmall};
  font-weight: ${fonts.weight.semibold};
  transition: all 200ms ease;
  margin-right: ${spacing.xsmall};
  ${fonts.sizes(16, 1.1)};
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
  &[data-current='true'] {
    background: ${colors.brand.light};
    color: ${colors.brand.primary};
    display: flex;
    align-items: center;

    [data-icon] {
      margin-right: ${spacing.xsmall};
    }
  }
`;

interface Props extends HTMLProps<HTMLElement> {
  children: ReactNode;
  component?: ElementType;
  isSubmitting?: boolean;
  current?: boolean;
  to?: string;
}

const LanguagePill = ({ children, isSubmitting = false, component: Component = 'div', current, ...rest }: Props) => {
  return (
    <Component disabled={isSubmitting} data-current={current} css={languagePillStyle} {...rest}>
      {children}
    </Component>
  );
};

export default LanguagePill;
