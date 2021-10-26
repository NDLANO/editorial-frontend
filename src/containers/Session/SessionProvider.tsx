import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
  [SessionState, React.Dispatch<React.SetStateAction<SessionState>>] | undefined
>(undefined);

interface Props {
  children: ReactNode;
  initialValue?: SessionState;
}

interface UserData {
  name?: string;
  scope?: string;
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
  userAccess?: string;
  authenticated: boolean;
  userNotRegistered: boolean;
  login: (accessToken: string) => void;
  logout: (federated: boolean, returnToLogin?: boolean) => void;
}

export const getSessionStateFromLocalStorage = () => {
  const token = getAccessToken();
  const isAccessTokenPersonal = getAccessTokenPersonal();
  if (isValid(token) && isAccessTokenPersonal) {
    const decodedToken = decodeToken(token);
    return {
      user: {
        name: decodedToken?.['https://ndla.no/user_name'],
        scope: decodedToken?.scope,
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
  const history = useHistory();

  const setAuthenticated = (authenticated: boolean) => setSession(s => ({ ...s, authenticated }));
  const setUserNotRegistered = (userNotRegistered: boolean) =>
    setSession(s => ({ ...s, userNotRegistered }));
  const setUserData = (user: UserData) => setSession(s => ({ ...s, user }));

  const login = (accessToken: string) => {
    try {
      const decoded = decodeToken(accessToken);
      if (!decoded?.scope?.includes(':')) {
        setUserNotRegistered(true);
      }
      setAuthenticated(true);
      setUserData({ name: decoded?.['https://ndla.no/user_name'], scope: decoded?.scope });
      setAccessTokenInLocalStorage(accessToken, true);
      history.replace('/');
    } catch (e) {
      console.error(e);
      history.replace(`${toLogin()}/failure`);
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
    userAccess: session.user.scope,
    authenticated: !!session.authenticated,
    userNotRegistered: !!session.userNotRegistered,
    login,
    logout,
  };
};
