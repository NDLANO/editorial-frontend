import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth0DecodedHash } from 'auth0-js';
import {
  clearAccessTokenFromLocalStorage,
  getAccessToken,
  getAccessTokenPersonal,
  personalAuthLogout,
  setAccessTokenInLocalStorage,
} from '../../util/authHelpers';
import { decodeToken, isValid } from '../../util/jwtHelper';
import { toLogin } from '../../util/routeHelpers';

const SessionContext = createContext<
  [SessionState, Dispatch<SetStateAction<SessionState>>] | undefined
>(undefined);

interface Props {
  children: ReactNode;
  initialValue?: SessionState;
}

interface UserData {
  name?: string;
  permissions?: string[];
}

interface SessionState {
  user: UserData;
  authenticated: boolean;
  userNotRegistered: boolean;
}

export const initialState: SessionState = {
  user: {},
  authenticated: false,
  userNotRegistered: true,
};

export interface SessionProps {
  userName?: string;
  userPermissions?: string[];
  authenticated: boolean;
  userNotRegistered: boolean;
  login: (accessToken: Auth0DecodedHash) => void;
  logout: (federated: boolean, returnToLogin?: boolean) => void;
}

export const getSessionStateFromLocalStorage = (): SessionState => {
  const token = getAccessToken();
  const isAccessTokenPersonal = getAccessTokenPersonal();
  if (isValid(token) && isAccessTokenPersonal) {
    const decodedToken = decodeToken(token);
    return {
      user: {
        name: decodedToken?.['https://ndla.no/user_name'],
        permissions: decodedToken?.permissions,
      },
      authenticated: true,
      userNotRegistered: false,
    };
  }
  return initialState; // Return initial state if token is undefined
};

export const SessionProvider = ({ children, initialValue = initialState }: Props) => {
  const sessionState = useState<SessionState>(initialValue);
  return <SessionContext.Provider value={sessionState}>{children}</SessionContext.Provider>;
};

export const useSession = (): SessionProps => {
  const sessionContext = useContext(SessionContext);
  if (sessionContext === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  const [session, setSession] = sessionContext;
  const navigate = useNavigate();

  const setAuthenticated = (authenticated: boolean) => setSession(s => ({ ...s, authenticated }));
  const setUserNotRegistered = (userNotRegistered: boolean) =>
    setSession(s => ({ ...s, userNotRegistered }));
  const setUserData = (user: UserData) => setSession(s => ({ ...s, user }));

  const login = (authResult: Auth0DecodedHash) => {
    try {
      const decoded = isValid(authResult.accessToken ?? null)
        ? decodeToken(authResult.accessToken!)
        : undefined;
      const permissions = decoded?.permissions ?? [];
      const scopes = decoded?.scope ?? '';
      const combinedPermissions = [...permissions, ...scopes.split(' ')];
      const uniquePermissions = [...new Set(combinedPermissions)];

      if (decoded && uniquePermissions.some(permission => permission.includes(':'))) {
        if (authResult.state) window.location.href = authResult.state;
        setAuthenticated(true);
        setUserData({
          name: decoded['https://ndla.no/user_name'],
          permissions: uniquePermissions,
        });
        setAccessTokenInLocalStorage(authResult.accessToken!, true);
        navigate('/', { replace: true });
      } else {
        setUserNotRegistered(true);
        navigate(`${toLogin()}/failure`, { replace: true });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const logout = (federated: boolean, returnToLogin = false) => {
    try {
      setAuthenticated(false);
      setUserData({});
      personalAuthLogout(federated, returnToLogin);
      clearAccessTokenFromLocalStorage();
    } catch (e) {
      console.error(e);
    }
  };

  return {
    userName: session.user.name,
    userPermissions: session.user.permissions,
    authenticated: !!session.authenticated,
    userNotRegistered: !!session.userNotRegistered,
    login,
    logout,
  };
};
