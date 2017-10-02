import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { toLogin } from '../../util/routeHelpers';

const PrivateRoute = ({ authenticated, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: toLogin(),
            state: { from: props.location },
          }}
        />
      )}
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  location: PropTypes.shape({}),
};

const mapStateToProps = state => ({
  authenticated: state.session.authenticated,
});

export default connect(mapStateToProps)(PrivateRoute);
