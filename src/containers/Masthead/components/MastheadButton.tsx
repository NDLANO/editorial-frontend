/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Cross } from '@ndla/icons/action';
import { Menu } from '@ndla/icons/common';
import { useTranslation } from 'react-i18next';
import { colors, fonts, spacing, misc } from '@ndla/core';
import { css } from '@emotion/core';

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

interface Props {
  open: boolean;
  onClick: () => void;
}

const MastheadButton = ({ open, onClick }: Props) => {
  const { t } = useTranslation();
  return (
    <button type="button" onClick={onClick} css={buttonStyle}>
      {open ? (
        <>
          <Cross css={crossCss} />
          <span>{t('masthead.menu.close')}</span>
        </>
      ) : (
        <>
          <Menu />
          <span>{t('menu.title')}</span>
        </>
      )}
    </button>
  );
};

export default MastheadButton;
