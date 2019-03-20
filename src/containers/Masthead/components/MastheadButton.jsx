/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Cross } from '@ndla/icons/action';
import { Menu } from '@ndla/icons/common';
import { injectT } from '@ndla/i18n';
import { css } from 'react-emotion';
import { colors, fonts, spacing, misc } from '@ndla/core';

const buttonStyle = css`
  background: transparent;
  padding: ${spacing.small} ${spacing.normal};
  ${fonts.sizes(16, 1.625)};
  font-weight: ${fonts.weight.normal};
  border-radius: ${misc.borderRadius};
  border: 2px solid ${colors.brand.primary};
  color: ${colors.brand.primary};
  transition: 200ms all ease;
  display: flex;
  align-items: center;

  svg {
    margin-right: ${spacing.xsmall};
  }
  &:hover {
    border: 2px solid transparent;
    background: ${colors.brand.primary};
    color: ${colors.white};
  }
  &:active,
  &:focus {
    border: 2px solid ${colors.brand.lighter};
    background: ${colors.white};
    color: ${colors.brand.primary};
  }
`;

const crossCss = css`
  width: 22px;
  height: 22px;
`;

const MastheadButton = ({ children, color, minWidth, open, onClick, t }) => (
  <button type="button" onClick={onClick} css={buttonStyle}>
    {open ? (
      <>
        <Cross css={crossCss} />
        <span>{t('masthead.closeMenu')}</span>
      </>
    ) : (
      <>
        <Menu />
        <span>{t('masthead.menu')}</span>
      </>
    )}
  </button>
);

MastheadButton.propTypes = {
  color: PropTypes.string,
  minWidth: PropTypes.number,
  open: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

MastheadButton.defaultProps = {
  color: colors.brand.grey,
  minWidth: 0,
};

export default injectT(MastheadButton);
