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
import { Redirect, Route } from 'react-router-dom';

export const PrivateRoute = ({ authenticated, component: Component, ...rest }) => {
  console.log('Private route authenticated', authenticated);
  return (<Route
    {...rest} render={props => (
    authenticated ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: props.location },
        }}
      />
    ))}
  />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
};

export default connect(state => state)(PrivateRoute);
