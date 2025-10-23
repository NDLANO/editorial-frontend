/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { decodeToken } from "../../util/jwtHelper";

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
}

export const getSessionStateFromCookie = (cookie: string | undefined): SessionState => {
  const decodedToken = decodeToken(cookie);
  if (decodedToken) {
    return {
      user: {
        name: decodedToken["https://ndla.no/user_name"],
        ndlaId: decodedToken["https://ndla.no/ndla_id"],
        permissions: decodedToken.permissions,
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
  const [session] = sessionContext;

  return {
    userName: session.user.name,
    ndlaId: session.user.ndlaId,
    userPermissions: session.user.permissions,
    authenticated: !!session.authenticated,
    userNotRegistered: !!session.userNotRegistered,
  };
};
