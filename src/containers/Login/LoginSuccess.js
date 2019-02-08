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
import { actions } from '../../modules/session/session';
import { parseHash } from '../../util/authHelpers';

export class LoginSuccess extends React.Component {
  async componentDidMount() {
    const {
      loginSuccess,
      location: { hash },
      history,
    } = this.props;

    const authResult = await parseHash(hash);
    if (authResult && authResult.accessToken) {
      loginSuccess({ accessToken: authResult.accessToken, history });
    }
  }

  render() {
    return <div />;
  }
}

LoginSuccess.propTypes = {
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
  loginSuccess: PropTypes.func.isRequired,
  location: PropTypes.shape({ hash: PropTypes.string }),
};

const mapDispatchToProps = {
  loginSuccess: actions.loginSuccess,
};
export default connect(
  undefined,
  mapDispatchToProps,
)(LoginSuccess);
