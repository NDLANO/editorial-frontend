/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';

interface StyledFieldProps {
  right?: boolean;
  isTitle?: boolean;
  noBorder?: boolean;
}

export const StyledField = styled.div<StyledFieldProps>`
  margin-top: 2rem;
  position: relative;

  & > select {
    width: 100%;
    display: block;
  }

  & label {
    font-size: 1.5rem;
  }
  &[data-no-border='true'] {
    & input {
      border: none;
      padding: 0;
      margin: 0;
      outline: none;
    }
  }
  &[data-right='true'] {
    text-align: right;
    margin-right: ${spacing.small};
  }
  &[data-is-title='true'] {
    & input {
      font-size: 2.11111rem;
    }

    & div {
      font-size: 2.11111rem;
    }
  }
`;

const Field = ({ children, className, noBorder = false, title = false, right = false }: Props) => (
  <StyledField
    data-no-border={noBorder}
    data-right={right}
    data-is-title={title}
    className={className}
  >
    {children}
  </StyledField>
);

interface Props {
  className?: string;
  children: ReactNode;
  noBorder?: boolean;
  right?: boolean;
  title?: boolean;
}

export default Field;
