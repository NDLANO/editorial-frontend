/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { injectT } from '@ndla/i18n';
import { withRouter } from 'react-router-dom';
import { colors, spacing } from '@ndla/core';
import { Logo } from '@ndla/ui';
import FocusTrapReact from 'focus-trap-react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import MastheadButton from './MastheadButton';
import MastheadSearch from '../MastheadSearch';
import SessionContainer from './SessionContainer';
import NavigationMenu from './NavigationMenu';
import Overlay from '../../../components/Overlay';

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
  background: #fff;
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
  margin-bottom: ${spacing.spacingUnit * 2}px;
`;

export class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.toggleOpen = this.toggleOpen.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  toggleOpen() {
    this.setState(prevState => ({ open: !prevState.open }));
  }

  closeMenu() {
    this.setState({ open: false });
  }

  render() {
    const { open } = this.state;
    const { t, userName, authenticated } = this.props;

    return (
      <StyledWrapper>
        <FocusTrapReact
          active={open}
          focusTrapOptions={{
            onDeactivate: this.closeMenu,
            clickOutsideDeactivates: true,
            escapeDeactivates: true,
          }}>
          <StyledNavigationWrapper>
            <StyledHeaderItems>
              <div>
                <MastheadButton onClick={this.toggleOpen} open={open} />
                <StyledSplitter />
                <MastheadSearch t={t} close={this.closeMenu} />
              </div>
              <div>
                <SessionContainer
                  userName={userName}
                  authenticated={authenticated}
                  close={this.closeMenu}
                />
                <StyledSplitter />
                <div css={logoCSS}>
                  <Logo to="/" label="Nasjonal digital læringsarena" />
                </div>
              </div>
            </StyledHeaderItems>
            {open && <NavigationMenu close={this.closeMenu} />}
          </StyledNavigationWrapper>
        </FocusTrapReact>
        {open && <Overlay modifiers={'lighter'} />}
      </StyledWrapper>
    );
  }
}

Navigation.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  userName: PropTypes.string,
};

export default withRouter(injectT(Navigation));
