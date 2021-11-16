/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ComponentType, ReactNode } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
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
const StyledLanguagePill = styled.span<{ disabled: boolean; current: any }>`
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

  ${props => !props.current && currentStyle}
`;

interface Props {
  children: ReactNode[] | ReactNode;
  withComponent?: ComponentType<any>;
  isSubmitting?: boolean;
  current?: boolean;
  to?: string;
}

const LanguagePill = ({
  children,
  withComponent,
  isSubmitting = false,
  current,
  ...rest
}: Props) => {
  const StyledLanguagePillWithComponent =
    withComponent && !isSubmitting
      ? StyledLanguagePill.withComponent(withComponent)
      : StyledLanguagePill;
  return (
    <StyledLanguagePillWithComponent disabled={isSubmitting} current={current} {...rest}>
      {children}
    </StyledLanguagePillWithComponent>
  );
};

export default LanguagePill;
