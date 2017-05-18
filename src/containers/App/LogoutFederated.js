/*
 * Part of NDLA editorial-frontend.
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from './sessionActions';
import ifAuthenticated from '../../util/ifAuthenticated';

export class LogoutFederated extends React.Component {
  componentWillMount() {
    const { localLogout, authenticated, localIfAuthenticated } = this.props;
    localIfAuthenticated(authenticated, localLogout);
  }

  render() {
    return null;
  }
}

LogoutFederated.propTypes = {
  localLogout: PropTypes.func.isRequired,
  localIfAuthenticated: PropTypes.func.isRequired,
  authenticated: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  localLogout: actions.logoutFederated,
  localIfAuthenticated: ifAuthenticated,
};

export default connect(state => state, mapDispatchToProps)(LogoutFederated);
