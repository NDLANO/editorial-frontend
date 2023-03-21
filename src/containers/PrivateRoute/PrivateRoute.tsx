import { Navigate, useLocation } from 'react-router-dom';
import { toLogin } from '../../util/routeHelpers';
import { loginPersonalAccessToken } from '../../util/authHelpers';
import { useSession } from '../Session/SessionProvider';
const okPaths = ['/login', '/logout'];

interface Props {
  component: JSX.Element;
}

const PrivateRoute = ({ component }: Props) => {
  const { authenticated } = useSession();
  const location = useLocation();

  if (
    !authenticated &&
    window.location.pathname &&
    !okPaths.find(okPath => window.location.pathname.includes(okPath))
  ) {
    const lastPath = `${window.location.pathname}${window.location.search ?? ''}`;
    localStorage.setItem('lastPath', lastPath);
    loginPersonalAccessToken('google-oauth2');
    return <div />;
  }

  if (!authenticated) {
    return <Navigate to={{ pathname: toLogin() }} state={{ from: location }} />;
  }
  return component;
};

export default PrivateRoute;
