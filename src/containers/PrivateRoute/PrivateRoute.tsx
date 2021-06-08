import React from 'react';
import PropTypes from 'prop-types';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { toLogin } from '../../util/routeHelpers';
import { loginPersonalAccessToken } from '../../util/authHelpers';
import { LocationShape } from '../../shapes';
import { ReduxState } from '../../interfaces';
const okPaths = ['/login', '/logout'];

type BaseProps<SubProps extends {}> = SubProps & {
  component: React.ComponentType<SubProps>;
};

const mapStateToProps = (state: ReduxState) => ({
  authenticated: state.session.authenticated,
});

const reduxConnector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof reduxConnector>;
type Props<SubProps> = BaseProps<SubProps> & PropsFromRedux;

/* FIXME: If we could make this component generic and take in the SubProps (now passed as `any`)
          to `Props` here and in the assertion in the render function of the <Route /> component
          it would allow us to do actual type checking on components used with `PrivateRoute`.
          An issue with some comments on the issue:
              https://github.com/piotrwitek/react-redux-typescript-guide/issues/55
 */
function PrivateRoute({ component: Component, authenticated, ...rest }: Props<any>) {
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
      render={p => {
        const props = p as any & RouteComponentProps;
        if (authenticated) return <Component {...props} />;

        return (
          <Redirect
            to={{
              pathname: toLogin(),
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
}

PrivateRoute.propTypes = {
  locale: PropTypes.string,
  authenticated: PropTypes.bool.isRequired,
  location: LocationShape,
  // @ts-ignore -- propTypes aren't in the typescript types, but they are available: https://github.com/ReactTraining/react-router/blob/42933fe141819e4662113ab2c320bf86be3490fb/packages/react-router/modules/Route.js#L82
  ...Route.propTypes,
};

const connected = reduxConnector(PrivateRoute);
export default connected;
