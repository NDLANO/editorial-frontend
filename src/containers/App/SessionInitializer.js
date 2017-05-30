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
import * as actions from './sessionActions';

export class SessionInitializer extends React.Component {
  componentWillMount() {
    const { loginSuccess, location: { hash }, history } = this.props;
    actions.auth.parseHash({ hash, _idTokenVerification: false }, (err, authResult) => {
      if (authResult && authResult.idToken) {
        loginSuccess({ idToken: authResult.idToken, history });
      }
    });
  }

  render() {
    return <div />;
  }
}

SessionInitializer.propTypes = {
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
  loginSuccess: PropTypes.func.isRequired,
  location: PropTypes.shape({ hash: PropTypes.string }),
};

const mapDispatchToProps = {
  loginSuccess: actions.loginSuccess,
};
export default connect(() => {}, mapDispatchToProps)(SessionInitializer);
