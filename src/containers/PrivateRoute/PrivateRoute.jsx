import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
// import { Redirect, Route } from 'react-router-dom';
// import { toLogin } from '../../util/routeHelpers';
import { loginPersonalAccessToken } from '../../util/authHelpers';
const okPaths = ['/login', '/logout', '', '/'];

const PrivateRoute = ({ authenticated, component: Component, ...rest }) => {
  if (
    !authenticated &&
    !okPaths.find(okPath => window.location.pathname.includes(okPath))
  ) {
    localStorage.setItem('lastPath', window.location.pathname);
    console.log('yes vis meg det ', window.location.pathname);
    console.log({
      authenticated,
      path: window.location.pathname,
      isLogin: /$\/login/.test(window.location.pathname),
    });
    return loginPersonalAccessToken('google-oauth2');
  }

  return (
    <Route
      {...rest}
      render={props =>
        authenticated ? (
          <Component {...props} />
        ) : (
          <div />
          // <Redirect
          //   to={{
          //     pathname: toLogin(),
          //     state: { from: props.location },
          //   }}
          // />
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
