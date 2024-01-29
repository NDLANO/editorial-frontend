/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import auth0, { Auth0DecodedHash, Auth0ParseHashError } from "auth0-js";
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
    const oldLoc = window.location;
    window.location = {
      ...oldLoc,
      origin: [window.location.protocol, "//", window.location.host, ":", window.location.port].join(""),
    };
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

const auth = new auth0.WebAuth({
  clientID: ndlaPersonalClientId ?? "",
  domain: auth0Domain || "",
  responseType: "token",
  redirectUri: `${locationOrigin}/login/success`,
  audience: "ndla_system",
});

export function parseHash(hash: string): Promise<Auth0DecodedHash> {
  return new Promise((resolve, reject) => {
    auth.parseHash(
      {
        hash,
        _idTokenVerification: false,
      },
      (err: Auth0ParseHashError | null, authResult: Auth0DecodedHash | null) => {
        if (!err && authResult) {
          resolve(authResult);
        } else {
          reject(err);
        }
      },
    );
  });
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

export const renewPersonalAuth = () =>
  new Promise((resolve, reject) => {
    auth.checkSession(
      {
        scope: "openid profile email",
      },
      (err, authResult) => {
        if (authResult && authResult.accessToken) {
          setAccessTokenInLocalStorage(authResult.accessToken, true);
          resolve(authResult.accessToken);
        } else {
          createMessageRef?.({
            id: "errorMessage.auth0.renewal",
            type: "auth0",
            translationKey: "errorMessage.auth0",
            translationObject: {
              message: err?.errorDescription || err?.error_description,
            },
            timeToLive: 0,
          });
          reject();
        }
      },
    );
  });

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
  auth.authorize({
    connection,
    state: localStorage.getItem("lastPath") ?? undefined,
    prompt: "login", // Tells auth0 to always show account selection screen on authorize.
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
      ...options,
      federated, // N.B. federated is parsed  as a flag by auth0. So you are logged out federated even if it is false
    });
  }

  return auth.logout(options);
};
