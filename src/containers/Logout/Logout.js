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
import LogoutFederated from './LogoutFederated';
import LogoutSession from './LogoutSession';
import LogoutProviders from './LogoutProviders';

const Logout = ({ match }) => (
  <OneColumn cssModifier="clear">
    <Switch>
      <Route path={`${match.url}/federated`} component={LogoutFederated} />
      <Route path={`${match.url}/session`} component={LogoutSession} />
      <Route component={LogoutProviders} />
    </Switch>
  </OneColumn>
);

Logout.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Logout;
