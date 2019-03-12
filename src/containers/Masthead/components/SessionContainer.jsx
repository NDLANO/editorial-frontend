/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { User } from '@ndla/icons/common';
import { Cross } from '@ndla/icons/action';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import { colors } from '@ndla/core';
import { Link, withRouter } from 'react-router-dom';
import {
  toLogoutFederated,
  toLogoutSession,
  toLogin,
} from '../../../util/routeHelpers';
import Overlay from '../../../components/Overlay';
import { getAccessTokenPersonal } from '../../../util/authHelpers';

const AuthSiteNavItem = ({ t, name, authenticated, onClick }) => {
  const isAccessTokenPersonal = getAccessTokenPersonal();
  if (authenticated && isAccessTokenPersonal) {
    return [
      <p key="sitenav_username">{name}</p>,
      <p key="sitenav_logout">
        <Link to={toLogoutSession()} onClick={onClick}>
          [{t('logoutProviders.localLogout')}]
        </Link>
      </p>,
      <p key="sitenav_logout_federated">
        <Link to={toLogoutFederated()} onClick={onClick}>
          [{t('logoutProviders.federatedLogout')}]
        </Link>
      </p>,
    ];
  }
  return (
    <p>
      <Link to={toLogin()} onClick={onClick}>
        {t('siteNav.login')}
      </Link>
    </p>
  );
};

AuthSiteNavItem.propTypes = {
  authenticated: PropTypes.bool.isRequired,
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

  toggleOpen() {
    this.setState(prevState => ({ open: !prevState.open }));
  }

  render() {
    const { t, userName, authenticated } = this.props;
    return (
      <div>
        <Button
          color={colors.brand.grey}
          onClick={this.toggleOpen}
          stripped>
          <User className="c-icon--medium" />
          {userName}
        </Button>
        {this.state.open && (
          <div>
            <AuthSiteNavItem
              t={t}
              name={userName}
              authenticated={authenticated}
              onClick={this.toggleOpen}
            />
            <Button
              onClick={this.toggleOpen}
              stripped
              css={`
                position: absolute;
                right: 0;
                top: 0;
              `}>
              <Cross className="c-icon--medium" />
            </Button>
          </div>
        )}
        {this.state.open ? (
          <Overlay
            onExit={this.toggleOpen}
            modifiers={['white-opacity', 'zIndex']}
          />
        ) : null}
      </div>
    );
  }
}

SessionContainer.propTypes = {
  userName: PropTypes.string,
  authenticated: PropTypes.bool.isRequired,
};

SessionContainer.defaultProps = {
  authenticated: false,
  userName: '',
};

export default withRouter(injectT(SessionContainer));
