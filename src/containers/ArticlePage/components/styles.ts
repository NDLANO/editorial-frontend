/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { css } from "@emotion/react";
import { colors, fonts, misc, spacing } from "@ndla/core";

export const COMMENT_COLOR = colors.support.yellowLight;

export const textAreaStyles = css`
  width: 100%;
  border-radius: ${misc.borderRadius};
  min-height: 25px;
  background-color: ${COMMENT_COLOR};
  font-family: ${fonts.sans};
  font-weight: ${fonts.weight.light};
  ${fonts.size.text.button};
  padding: 0 ${spacing.xxsmall};
`;

export const slateContentStyles = css`
  line-break: normal;
  p {
    margin: 0;
  }
  li {
    margin: 0;
    padding: 0;
    ${fonts.size.text.button};
  }
  [data-resource="content-link"] {
    color: ${colors.brand.primary};
    box-shadow: inset 0 -1px;
  }
`;

export const formControlStyles = css`
  [data-comment] {
    ${textAreaStyles};
    ${slateContentStyles};
    border: 1px solid transparent;
    &[data-open="false"] {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-height: 30px;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    &:active,
    &:focus-visible {
      border: 1px solid ${colors.brand.primary};
    }
  }
`;
