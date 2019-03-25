import { css } from '@emotion/core';
import { colors, spacing, fonts, misc } from '@ndla/core';

export const linkFillButtonCSS = css`
  display: flex;
  padding: ${spacing.xsmall} ${spacing.small};
  background: transparent;
  box-shadow: none;
  border: 0;
  color: ${colors.brand.primary};
  font-family: ${fonts.sans};
  ${fonts.sizes(16, 1.1)};
  font-weight: ${fonts.weight.semibold};
  white-space: nowrap;
  border-radius: ${misc.borderRadius};
  transition: all 200ms ease;
  cursor: pointer;
  .c-icon {
    width: 16px;
    height: 16px;
    margin: 0 3px 0 -3px;
  }
  &:focus,
  &:hover {
    color: #fff;
    background: ${colors.brand.primary};
    transform: translate(1px, 1px);
  }
`;

export const linkFillButtonDeleteCSS = css`
  .c-icon {
    color: ${colors.support.red};
  }
  &:focus,
  &:hover {
    color: #fff;
    background: ${colors.support.red};
    transform: translate(1px, 1px);
    .c-icon {
      color: #fff;
    }
  }
`;
