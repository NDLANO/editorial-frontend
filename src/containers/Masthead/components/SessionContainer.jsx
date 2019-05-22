/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FocusTrapReact from 'focus-trap-react';
import { css } from '@emotion/core';
import { User } from '@ndla/icons/common';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import { colors, spacing, animations, shadows } from '@ndla/core';
import { Link, withRouter } from 'react-router-dom';
import { toLogoutSession, toLogin } from '../../../util/routeHelpers';
import { getAccessTokenPersonal } from '../../../util/authHelpers';
import { StyledMenuItem } from './StyledMenuItem';

const animateDownCss = css`
  ${animations.fadeInBottom()}
`;

const userIconCss = css`
  color: ${colors.brand.grey};
  margin-right: ${spacing.xsmall};
`;

const dropDownContainerCSS = css`
  position: absolute;
  z-index: 9999;
  background: #fff;
  padding: ${spacing.normal};
  box-shadow: ${shadows.levitate1};
`;

const AuthSiteNavItem = ({ t, onClick }) => (
  <div
    css={css`
      transform: translateY(${spacing.normal});
    `}>
    <div css={[dropDownContainerCSS, animateDownCss]}>
      <StyledMenuItem to={toLogoutSession()} onClick={onClick}>
        {t('logoutProviders.localLogout')}
      </StyledMenuItem>
    </div>
  </div>
);

AuthSiteNavItem.propTypes = {
  name: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export class SessionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.toggleOpen = this.toggleOpen.bind(this);
  }

  toggleOpen(updatedState) {
    this.setState(prevState => ({
      open: updatedState === undefined ? !prevState.open : updatedState,
    }));
  }

  render() {
    const { t, userName, authenticated, close: closeNavMenu } = this.props;
    const { open } = this.state;
    const isAccessTokenPersonal = getAccessTokenPersonal();

    return (
      <div>
        {authenticated && isAccessTokenPersonal ? (
          <div>
            <User css={userIconCss} className="c-icon--22" />
            <Button
              onClick={() => {
                this.toggleOpen();
                closeNavMenu();
              }}
              link>
              {userName}
            </Button>
          </div>
        ) : (
          <Link to={toLogin()}>{t('siteNav.login')}</Link>
        )}
        {open && (
          <FocusTrapReact
            active
            focusTrapOptions={{
              onDeactivate: () => {
                this.toggleOpen(false);
              },
              clickOutsideDeactivates: true,
              escapeDeactivates: true,
            }}>
            <div>
              <AuthSiteNavItem
                t={t}
                name={userName}
                onClick={this.toggleOpen}
              />
            </div>
          </FocusTrapReact>
        )}
      </div>
    );
  }
}

SessionContainer.propTypes = {
  userName: PropTypes.string,
  authenticated: PropTypes.bool.isRequired,
  close: PropTypes.func,
};

SessionContainer.defaultProps = {
  authenticated: false,
  userName: '',
};

export default withRouter(injectT(SessionContainer));
