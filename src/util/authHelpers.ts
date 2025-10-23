/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { JwtPayload } from "jwt-decode";
import { getCookie } from "@ndla/util";
import config from "../config";
import { ACCESS_TOKEN_COOKIE } from "../constants";
import { NewMessageType } from "../containers/Messages/MessagesProvider";
import { decodeToken } from "./jwtHelper";

let createMessageRef: (newMessage: NewMessageType) => void | undefined;

const NDLA_API_URL = config.ndlaApiUrl;

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

const apiBaseUrl = (() => {
  if (config.runtimeType === "test") {
    return "http://ndla-api";
  }

  return NDLA_API_URL ?? locationOrigin;
})();

export { locationOrigin, apiBaseUrl };

const tokenExpiryDate = (maybeToken: JwtPayload | string | undefined | null) => {
  if (!maybeToken) return undefined;
  const token = typeof maybeToken === "string" ? decodeToken(maybeToken) : maybeToken;
  if (!token?.exp) return undefined;
  return new Date(token.exp * 1000);
};

export const getMilisecondsUntilAccessTokenExpires = (tokenString: string | undefined) => {
  const token = decodeToken(tokenString);
  return token?.exp ? new Date(token.exp * 1000).getTime() - new Date().getTime() : 0;
};

export const getAccessToken = () => getCookie(ACCESS_TOKEN_COOKIE, document.cookie);

export const isTokenValid = (maybeToken: JwtPayload | string | null | undefined) => {
  const expiryDate = tokenExpiryDate(maybeToken);
  if (!expiryDate) return false;
  // TODO: Consider adding a buffer here
  return new Date().getTime() < expiryDate.getTime();
  // const token = typeof maybeToken === "string" ? decodeToken(maybeToken) : maybeToken;
  // if (!token?.exp) return false;
  // // return new Date().getTime() < (token.exp - 60) * 1000; // Add 60 second buffer
  // const expiresIn = !(token?.exp && token?.iat) ? 0 : (token.exp - token.iat - 60) * 1000; // Add 60 second buffer
  // return new Date().getTime() < expiresIn;
};

// export const isAccessTokenValid = (expiresCookie: string | undefined) =>
//   new Date().getTime() < getAccessTokenExpiresAt(expiresCookie) - 10000; // 10000ms is 10 seconds

export const renewAuth = async (): Promise<string> => {
  // TODO: Do something here with errors
  const res = await fetch("auth/refresh", { credentials: "include" });
  return await res.json();
  // if (localStorage.getItem("access_token_personal") !== "true") return;
  // return new Promise((resolve, reject) => {
  //   auth.checkSession({ scope: "openid profile email" }, (err, authResult) => {
  //     if (authResult && authResult.accessToken) {
  //       setAccessTokenInLocalStorage(authResult.accessToken, true);
  //       resolve(authResult.accessToken);
  //     } else {
  //       createMessageRef?.({
  //         id: "errorMessage.auth0.renewal",
  //         type: "auth0",
  //         translationKey: "errorMessage.auth0",
  //         translationObject: { message: err?.errorDescription || err?.error_description },
  //         timeToLive: 0,
  //       });
  //       reject();
  //     }
  //   });
  // });
};

let tokenRenewalTimeout: ReturnType<typeof setTimeout>;

export const scheduleRenewal = async (createMessage?: (newMessage: NewMessageType) => void, ignoreRenew = false) => {
  if (!createMessageRef && createMessage) {
    createMessageRef = createMessage;
  }
  if (ignoreRenew) {
    return;
  }
  const timeout = getMilisecondsUntilAccessTokenExpires(getCookie(ACCESS_TOKEN_COOKIE, document.cookie));

  if (timeout > 0) {
    tokenRenewalTimeout.close();
    tokenRenewalTimeout = setTimeout(async () => {
      await renewAuth();
      scheduleRenewal();
    }, timeout);
  } else {
    await renewAuth();
    scheduleRenewal();
  }
};
