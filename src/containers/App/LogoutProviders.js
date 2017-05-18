/*
 * Part of NDLA editorial-frontend.
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { OneColumn } from 'ndla-ui';
import { connect } from 'react-redux';
import * as actions from './sessionActions';
import ifAuthenticated from '../../util/ifAuthenticated';

export class LogoutProviders extends React.Component {
  componentWillMount() {
    // const { localLogout, authenticated, localIfAuthenticated } = this.props;
    // localIfAuthenticated(authenticated, localLogout);
  }

  render() {
    return (
      <OneColumn cssModifier="narrow">
        <div>
          <ul className="vertical-menu">
            <li className="vertical-menu_item"><a href="/logoutFederated" className="login-button login-button-google c-button">Logg ut globalt</a></li>
            <li className="vertical-menu_item"><a href="/logout" className="login-button login-button-fb c-button">Logg ut lokalt</a></li>
          </ul>
        </div>
      </OneColumn>
    );
  }
}

LogoutProviders.propTypes = {
  localLogout: PropTypes.func.isRequired,
  localIfAuthenticated: PropTypes.func.isRequired,
  authenticated: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  localLogout: actions.logout,
  localIfAuthenticated: ifAuthenticated,
};

export default connect(state => state, mapDispatchToProps)(LogoutProviders);
