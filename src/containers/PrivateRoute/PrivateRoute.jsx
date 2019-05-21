import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { toLogin } from '../../util/routeHelpers';
import { loginPersonalAccessToken } from '../../util/authHelpers';
const okPaths = ['/login', '/logout'];

const PrivateRoute = ({ authenticated, component: Component, ...rest }) => {
  if (
    !authenticated &&
    window.location.pathname &&
    !okPaths.find(okPath => window.location.pathname.includes(okPath))
  ) {
    const lastPath = `${window.location.pathname}${
      window.location.search ? window.location.search : ''
    }`;
    localStorage.setItem('lastPath', lastPath);
    loginPersonalAccessToken('google-oauth2');
    return <div />;
  }

  return (
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
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  location: PropTypes.shape({}),
};

const mapStateToProps = state => ({
  authenticated: state.session.authenticated,
});

export default connect(mapStateToProps)(PrivateRoute);
