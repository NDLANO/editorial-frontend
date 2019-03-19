import { css } from 'react-emotion';
import { colors, spacing, fonts, shadows } from '@ndla/core';

export const menuItemCss = css`
  display: flex;
  width: 100%;
  padding: ${spacing.small};
  background: transparent;
  box-shadow: none;
  border: 0;
  color: ${colors.brand.primary};
  font-family: ${fonts.sans};
  font-weight: ${fonts.weight.semibold};
  white-space: nowrap;
  ${fonts.sizes(18, 1.1)};
  &:focus,
  &:hover {
    background: ${colors.brand.lighter} !important;
  }
`;

export const dropDownContainerCSS = css`
  position: absolute;
  z-index: 9999;
  background: #fff;
  padding: ${spacing.normal};
  box-shadow: ${shadows.levitate1};
`;
