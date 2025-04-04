/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Auth0DecodedHash } from "auth0-js";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearAccessTokenFromLocalStorage,
  getAccessToken,
  getAccessTokenPersonal,
  personalAuthLogout,
  setAccessTokenInLocalStorage,
} from "../../util/authHelpers";
import handleError from "../../util/handleError";
import { decodeToken, isValid } from "../../util/jwtHelper";
import { toLogin } from "../../util/routeHelpers";

const SessionContext = createContext<[SessionState, Dispatch<SetStateAction<SessionState>>] | undefined>(undefined);

interface Props {
  children: ReactNode;
  initialValue?: SessionState;
}

interface UserData {
  name?: string;
  permissions?: string[];
  ndlaId?: string;
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
  ndlaId: string | undefined;
  userPermissions?: string[];
  authenticated: boolean;
  userNotRegistered: boolean;
  login: (authResult: Auth0DecodedHash) => void;
  logout: (federated: boolean, returnToLogin?: boolean) => void;
}

export const getSessionStateFromLocalStorage = (): SessionState => {
  const token = getAccessToken();
  const isAccessTokenPersonal = getAccessTokenPersonal();
  if (isValid(token) && isAccessTokenPersonal) {
    const decodedToken = decodeToken(token);
    return {
      user: {
        name: decodedToken?.["https://ndla.no/user_name"],
        ndlaId: decodedToken?.["https://ndla.no/ndla_id"],
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
  return <SessionContext value={sessionState}>{children}</SessionContext>;
};

export const useSession = (): SessionProps => {
  const sessionContext = useContext(SessionContext);
  if (sessionContext === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  const [session, setSession] = sessionContext;
  const navigate = useNavigate();

  const setAuthenticated = (authenticated: boolean) => setSession((s) => ({ ...s, authenticated }));
  const setUserNotRegistered = (userNotRegistered: boolean) => setSession((s) => ({ ...s, userNotRegistered }));
  const setUserData = (user: UserData) => setSession((s) => ({ ...s, user }));

  const login = (authResult: Auth0DecodedHash) => {
    try {
      const decoded = isValid(authResult.accessToken ?? null) ? decodeToken(authResult.accessToken!) : undefined;
      const permissions = decoded?.permissions ?? [];
      const scope = decoded?.scope ?? "";
      const combinedPermissions = [...permissions, ...scope.split(" ")];
      const uniquePermissions = [...new Set(combinedPermissions)];

      if (decoded && uniquePermissions.some((permission) => permission.includes(":"))) {
        if (authResult.state) window.location.href = authResult.state;
        setAuthenticated(true);
        setUserData({
          name: decoded["https://ndla.no/user_name"],
          permissions: uniquePermissions,
        });
        setAccessTokenInLocalStorage(authResult.accessToken!, true);
        navigate("/", { replace: true });
      } else {
        setUserNotRegistered(true);
        navigate(`${toLogin()}/failure`, { replace: true });
      }
    } catch (e) {
      handleError(e);
    }
  };

  const logout = (federated: boolean, returnToLogin = false) => {
    try {
      setAuthenticated(false);
      setUserData({});
      personalAuthLogout(federated, returnToLogin);
      clearAccessTokenFromLocalStorage();
    } catch (e) {
      handleError(e);
    }
  };

  return {
    userName: session.user.name,
    ndlaId: session.user.ndlaId,
    userPermissions: session.user.permissions,
    authenticated: !!session.authenticated,
    userNotRegistered: !!session.userNotRegistered,
    login,
    logout,
  };
};
