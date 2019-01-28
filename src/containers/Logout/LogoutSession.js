/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { actions } from '../../modules/session/session';

export class LogoutSession extends React.Component {
  UNSAFE_componentWillMount() {
    const { logout, location } = this.props;
    const query = queryString.parse(location.search);
    console.log(query);
    logout({ federated: false, returnToLogin: query && query.returnToLogin });
  }

  render() {
    return null;
  }
}

LogoutSession.propTypes = {
  logout: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

const mapDispatchToProps = {
  logout: actions.logout,
};

export default connect(
  undefined,
  mapDispatchToProps,
)(LogoutSession);
