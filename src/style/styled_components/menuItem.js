import { css } from 'react-emotion';
import { spacing, shadows } from '@ndla/core';

export const dropDownContainerCSS = css`
  position: absolute;
  z-index: 9999;
  background: #fff;
  padding: ${spacing.normal};
  box-shadow: ${shadows.levitate1};
`;
