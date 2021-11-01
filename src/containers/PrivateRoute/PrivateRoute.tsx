import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { toLogin } from '../../util/routeHelpers';
import { loginPersonalAccessToken } from '../../util/authHelpers';
import { LocationShape } from '../../shapes';
import { useSession } from '../Session/SessionProvider';
const okPaths = ['/login', '/logout'];

type BaseProps<SubProps> = RouteProps &
  Omit<SubProps, keyof RouteComponentProps> & {
    component: React.ComponentType<SubProps>;
  };

type Props<SubProps> = BaseProps<SubProps>;

const PrivateRoute = <T,>({ component, ...rest }: Props<T>) => {
  const Component: React.ComponentType<T> = component;
  const { authenticated } = useSession();

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
        const props = p as T & RouteComponentProps;
        const allProps = { ...props, ...rest };
        if (authenticated) return <Component {...allProps} />;

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
};

PrivateRoute.propTypes = {
  locale: PropTypes.string,
  location: LocationShape,
  // @ts-ignore -- propTypes aren't in the typescript types, but they are available: https://github.com/ReactTraining/react-router/blob/42933fe141819e4662113ab2c320bf86be3490fb/packages/react-router/modules/Route.js#L82
  ...Route.propTypes,
};

export default PrivateRoute;
