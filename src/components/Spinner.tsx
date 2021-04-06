/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import styled from '@emotion/styled';
import { keyframes, css, SerializedStyles } from '@emotion/core';
import { colors } from '@ndla/core';

const spinnerKeyframeStyle = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

const commonAbsoluteAndFixedStyle = css`
  top: 40%;
  left: 50%;
  right: 50%;
  z-index: 999;
`;

export type SpinnerAppearance = 'fixed' | 'absolute' | 'small';

const appeareances: { [key in SpinnerAppearance]: SerializedStyles } = {
  fixed: css`
    position: fixed;
    ${commonAbsoluteAndFixedStyle}
  `,
  absolute: css`
    position: absolute;
    ${commonAbsoluteAndFixedStyle}
  `,
  small: css`
    width: 1em;
    height: 1em;
  `,
};

const SpinnerWrapper = styled.div`
  height: 600px;
  display: flex;
  align-items: center;
`;

interface Props {
  appearance?: SpinnerAppearance;
  withWrapper?: boolean;
}

const StyledSpinner = styled('div')<Props>`
  border: 0.4em solid ${colors.brand.greyLight};
  border-bottom-color: ${colors.brand.primary};
  border-radius: 50%;
  margin: 0 auto;
  width: 3em;
  height: 3em;
  animation: ${spinnerKeyframeStyle} 0.7s linear infinite;
  ${p => {
    if (p.appearance !== undefined) return appeareances[p.appearance];
  }}
`;

const Spinner = ({ appearance, withWrapper, ...rest }: Props) => {
  const spinner = <StyledSpinner appearance={appearance} {...rest} />;
  if (withWrapper) return <SpinnerWrapper>{spinner}</SpinnerWrapper>;
  return spinner;
};

export default Spinner;
