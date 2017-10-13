/**
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { OneColumn } from 'ndla-ui';
import LoginFailure from './LoginFailure';
import LoginSuccess from './LoginSuccess';
import LoginProviders from './LoginProviders';

export const Login = ({ match }) => (
  <OneColumn cssModifier="clear">
    <div className="u-2/3@desktop u-push-1/3@desktop">
      <Switch>
        <Route path={`${match.url}/success`} component={LoginSuccess} />
        <Route path={`${match.url}/failure`} component={LoginFailure} />
        <Route component={LoginProviders} />
      </Switch>
    </div>
  </OneColumn>
);

Login.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Login;
