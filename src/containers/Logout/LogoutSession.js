/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../modules/session/sessionActions';

export class LogoutSession extends React.Component {
  componentWillMount() {
    const { logout } = this.props;
    logout({ federated: false });
  }

  render() {
    return null;
  }
}

LogoutSession.propTypes = {
  logout: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  logout: actions.logout,
};

export default connect(undefined, mapDispatchToProps)(LogoutSession);
