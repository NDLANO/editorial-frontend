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
import { withTranslation } from 'react-i18next';
import { colors, spacing } from '@ndla/core';
import { Link, withRouter } from 'react-router-dom';
import { toLogoutSession, toLogin } from '../../../util/routeHelpers';
import { getAccessTokenPersonal } from '../../../util/authHelpers';
import StyledListButton from '../../../components/StyledListButton';
import Overlay from '../../../components/Overlay';
import { StyledDropdownOverlay } from '../../../components/Dropdown';

const userIconCss = css`
  color: ${colors.brand.grey};
  margin-right: ${spacing.xsmall};
`;

const StyledLink = StyledListButton.withComponent(Link);

const AuthSiteNavItem = ({ logoutText, onClick }) => (
  <StyledDropdownOverlay withArrow>
    <StyledLink to={toLogoutSession()} onClick={onClick}>
      {logoutText}
    </StyledLink>
  </StyledDropdownOverlay>
);

AuthSiteNavItem.propTypes = {
  logoutText: PropTypes.string,
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
          <>
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
                  logoutText={t('logoutProviders.localLogout')}
                  onClick={this.toggleOpen}
                />
              </div>
            </FocusTrapReact>
            <Overlay />
          </>
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

export default withRouter(withTranslation()(SessionContainer));
