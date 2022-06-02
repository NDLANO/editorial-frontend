/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { spacing, colors } from '@ndla/core';
import { ArticleInModal } from '@ndla/howto';
import { InformationOutline } from '@ndla/icons/common';

const extraPaddedCSS = css`
  width: calc(${spacing.normal} * 1.5);
  height: calc(${spacing.normal} * 1.5);
  padding: ${spacing.xsmall};
`;

export const normalPaddingCSS = css`
  width: ${spacing.normal};
  height: ${spacing.normal};
  padding: 0;
`;

const iconCSS = css`
  color: ${colors.brand.tertiary};

  &:hover,
  &:focus {
    color: ${colors.brand.primary};
  }
`;

export const HelpIcon = styled(InformationOutline)`
  ${iconCSS}
`;

interface Props {
  pageId: string;
  tooltip?: string;
  extraIconPadding?: boolean;
}

const HowToHelper = ({ pageId, tooltip, extraIconPadding }: Props) => (
  <ArticleInModal
    pageId={pageId}
    tooltip={tooltip}
    activateButton={<HelpIcon css={[extraIconPadding ? extraPaddedCSS : normalPaddingCSS]} />}
  />
);

export default HowToHelper;
