/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { JwtPayload } from "jwt-decode";
import { getCookie } from "@ndla/util";
import { ACCESS_TOKEN_COOKIE } from "../constants";
import { NewMessageType } from "../containers/Messages/MessagesProvider";
import { decodeToken } from "./jwtHelper";

let createMessageRef: (newMessage: NewMessageType) => void | undefined;

export const getAccessToken = () => getCookie(ACCESS_TOKEN_COOKIE, document.cookie);

export const isActiveToken = (maybeToken: JwtPayload | string | null | undefined) => {
  const token = typeof maybeToken === "string" ? decodeToken(maybeToken) : maybeToken;
  if (!token?.exp) return false;
  const expiryDate = new Date((token.exp - 60) * 1000); // add 60 second buffer
  return new Date().getTime() < expiryDate.getTime();
};

export const renewAuth = async (): Promise<string> => {
  try {
    const res = await fetch("auth/refresh", { credentials: "include" });
    return await res.json();
  } catch (err) {
    createMessageRef({
      id: "errorMessage.auth0.renewal",
      type: "auth0",
      translationKey: "errorMessage.auth0",
      timeToLive: 0,
    });
    return Promise.reject(err);
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

  const token = decodeToken(getCookie(ACCESS_TOKEN_COOKIE, document.cookie));
  const timeout = token?.exp ? new Date(token.exp * 1000).getTime() - new Date().getTime() : 0;

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
