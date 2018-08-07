/**
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from '../../modules/session/session';

export class LogoutFederated extends React.Component {
  componentWillMount() {
    const { logout } = this.props;
    logout({ federated: true });
  }

  render() {
    return null;
  }
}

LogoutFederated.propTypes = {
  logout: PropTypes.func.isRequired,
  authenticated: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  logout: actions.logout,
};

export default connect(
  undefined,
  mapDispatchToProps,
)(LogoutFederated);
