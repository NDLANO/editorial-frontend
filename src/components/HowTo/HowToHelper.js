/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'react-emotion';
import { spacing, colors } from '@ndla/core';
import { ArticleInModal } from '@ndla/howto';
import { InformationOutline } from '@ndla/icons/common';

const extraPadded = css`
  width: calc(${spacing.normal} * 1.5);
  height: calc(${spacing.normal} * 1.5);
  padding: ${spacing.xsmall};
`;

const normalPadding = css`
  width: ${spacing.normal};
  height: ${spacing.normal};
  padding: 0;
`;

export const HelpIcon = styled(InformationOutline)`
  color: ${colors.brand.tertiary};
  &:hover,
  &:focus {
    color: ${colors.brand.primary};
  }
`;

const HowToHelper = ({ pageId, tooltip, extraIconPadding }) => (
  <ArticleInModal
    pageId={pageId}
    tooltip={tooltip}
    activateButton={
      <HelpIcon css={extraIconPadding ? extraPadded : normalPadding} />
    }
  />
);

HowToHelper.propTypes = {
  pageId: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  extraIconPadding: PropTypes.bool,
};

export default HowToHelper;
