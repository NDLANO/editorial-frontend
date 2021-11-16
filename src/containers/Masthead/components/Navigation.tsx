/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import BEMHelper from 'react-bem-helper';
import { useTranslation } from 'react-i18next';
import { colors, spacing } from '@ndla/core';
// @ts-ignore
import { Logo } from '@ndla/ui';
import FocusTrapReact from 'focus-trap-react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import MastheadButton from './MastheadButton';
import MastheadSearch from '../MastheadSearch';
import SessionContainer from './SessionContainer';
import NavigationMenu from './NavigationMenu';
import Overlay from '../../../components/Overlay';
import config from '../../../config';
import { NAVIGATION_HEADER_MARGIN } from '../../../constants';

export const classes = new BEMHelper({
  name: 'navigation',
  prefix: 'c-',
});

const logoCSS = css`
  transform: translateY(3px);
`;

const StyledSplitter = styled.div`
  height: ${spacing.medium};
  width: 1px;
  background: ${colors.brand.greyLighter};
  margin: 0 ${spacing.normal};
`;

const StyledNavigationWrapper = styled.div`
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
  right: 0;
  padding: ${spacing.xsmall};
  background: ${config.ndlaEnvironment === 'ff' ? colors.brand.accent : '#fff'};
`;

const StyledHeaderItems = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 972px;
  margin: 0 auto;
  > div {
    display: flex;
    align-items: center;
  }
`;
const StyledWrapper = styled.div`
  margin-bottom: ${NAVIGATION_HEADER_MARGIN};
`;

const Navigation = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);

  const toggleOpen = () => {
    setOpen(prevState => !prevState);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <StyledWrapper>
      <FocusTrapReact
        active={open}
        focusTrapOptions={{
          onDeactivate: closeMenu,
          clickOutsideDeactivates: true,
          escapeDeactivates: true,
        }}>
        <StyledNavigationWrapper>
          <StyledHeaderItems>
            <div>
              <MastheadButton onClick={toggleOpen} open={open} />
              <StyledSplitter />
              <MastheadSearch close={closeMenu} />
            </div>
            <div>
              <SessionContainer close={closeMenu} />
              <StyledSplitter />
              <div css={logoCSS}>
                <Logo to="/" label={t('logo.altText')} />
              </div>
            </div>
          </StyledHeaderItems>
          {open && <NavigationMenu close={closeMenu} />}
        </StyledNavigationWrapper>
      </FocusTrapReact>
      {open && <Overlay modifiers={'lighter'} />}
    </StyledWrapper>
  );
};

export default Navigation;
