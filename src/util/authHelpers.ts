/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Auth0Client, AuthenticationError } from "@auth0/auth0-spa-js";
import { expiresIn, ndlaId, ndlaUserName, ndlaUserEmail } from "./jwtHelper";
import config from "../config";
import { NewMessageType } from "../containers/Messages/MessagesProvider";

let createMessageRef: (newMessage: NewMessageType) => void | undefined;

const NDLA_API_URL = config.ndlaApiUrl;
const AUTH0_DOMAIN = config.auth0Domain;
const NDLA_PERSONAL_CLIENT_ID = config.ndlaPersonalClientId;

const locationOrigin = (() => {
  if (config.runtimeType === "test") {
    return "http://ndla-frontend";
  }

  if (typeof window === "undefined") {
    return "";
  }
  if (typeof window.location.origin === "undefined") {
    return [window.location.protocol, "//", window.location.host, ":", window.location.port].join("");
  }

  return window.location.origin;
})();

export const auth0Domain = (() => {
  if (config.runtimeType === "test") {
    return "http://auth-ndla";
  }
  return AUTH0_DOMAIN;
})();

export const ndlaPersonalClientId = (() => {
  if (config.runtimeType === "test") {
    return "123456789";
  }
  return NDLA_PERSONAL_CLIENT_ID;
})();

const apiBaseUrl = (() => {
  if (config.runtimeType === "test") {
    return "http://ndla-api";
  }

  return NDLA_API_URL ?? locationOrigin;
})();

export { locationOrigin, apiBaseUrl };

const auth = new Auth0Client({
  clientId: ndlaPersonalClientId ?? "",
  domain: auth0Domain || "",
  authorizationParams: {
    audience: "ndla_system",
    redirect_uri: `${locationOrigin}/login/success`,
  },
});

export async function parseHash() {
  const res = await auth.handleRedirectCallback();
  const accessToken = await auth.getTokenSilently();

  return {
    accessToken,
    state: res.appState?.state,
  };
}

export function setAccessTokenInLocalStorage(accessToken: string, personal: boolean) {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("access_token_expires_at", (expiresIn(accessToken) * 1000 + new Date().getTime()).toString());
  localStorage.setItem("access_token_personal", personal.toString());
}

export const clearAccessTokenFromLocalStorage = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("access_token_expires_at");
  localStorage.removeItem("access_token_personal");
};

export const getAccessTokenPersonal = () => localStorage.getItem("access_token_personal") === "true";

export const getAccessTokenExpiresAt = () => {
  const expiresAt = localStorage.getItem("access_token_expires_at");
  return expiresAt ? JSON.parse(expiresAt) : 0;
};

export const getAccessToken = () => localStorage.getItem("access_token");

export const getNdlaId = () => ndlaId(getAccessToken());
export const getNdlaUserName = () => ndlaUserName(getAccessToken());
export const getNdlaUserEmail = () => ndlaUserEmail(getAccessToken());

export const isAccessTokenValid = () => new Date().getTime() < getAccessTokenExpiresAt() - 10000; // 10000ms is 10 seconds

export const renewPersonalAuth = async () => {
  try {
    await auth.checkSession({
      authorizationParams: {
        scope: "openid profile email",
      },
    });
    const token = await auth.getTokenSilently();
    setAccessTokenInLocalStorage(token, true);
    return token;
  } catch (e) {
    const err = e as AuthenticationError;
    createMessageRef?.({
      id: "errorMessage.auth0.renewal",
      type: "auth0",
      translationKey: "errorMessage.auth0",
      translationObject: {
        message: err?.error_description,
      },
      timeToLive: 0,
    });
    throw e;
  }
};

export const renewAuth = async () => {
  if (localStorage.getItem("access_token_personal") === "true") {
    return renewPersonalAuth();
  }
};

let tokenRenewalTimeout: ReturnType<typeof setTimeout>;

export const scheduleRenewal = async (createMessage?: (newMessage: NewMessageType) => void, ignoreRenew = false) => {
  if (!createMessageRef && createMessage) {
    createMessageRef = createMessage;
  }
  if (ignoreRenew) {
    return;
  }
  if (localStorage.getItem("access_token_personal") !== "true") {
    return null;
  }
  const expiresAt = getAccessTokenExpiresAt();

  const timeout = expiresAt - Date.now();

  if (timeout > 0) {
    tokenRenewalTimeout = setTimeout(async () => {
      await renewAuth();
      scheduleRenewal();
    }, timeout);
  } else {
    await renewAuth();
    scheduleRenewal();
  }
};

export function loginPersonalAccessToken(type: string) {
  const connection = config.usernamePasswordEnabled ? undefined : type;
  auth.loginWithRedirect({
    authorizationParams: {
      connection,
      prompt: "login", // Tells auth0 to always show account selection screen on authorize.
    },
    appState: {
      state: localStorage.getItem("lastPath") ?? undefined,
    },
  });
}

export const personalAuthLogout = (federated: boolean, returnToLogin: boolean) => {
  clearTimeout(tokenRenewalTimeout);

  const options = {
    returnTo: returnToLogin ? `${locationOrigin}/login` : `${locationOrigin}`,
    clientID: ndlaPersonalClientId,
  };

  if (federated) {
    return auth.logout({
      logoutParams: {
        returnTo: options.returnTo,
        client_id: options.clientID,
        federated, // N.B. federated is parsed  as a flag by auth0. So you are logged out federated even if it is false
      },
    });
  }

  return auth.logout({
    logoutParams: {
      returnTo: options.returnTo,
      client_id: options.clientID,
    },
  });
};
