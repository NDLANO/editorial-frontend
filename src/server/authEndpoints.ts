/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import express, { CookieOptions } from "express";
import {
  authorizationCodeGrant,
  buildAuthorizationUrl,
  buildEndSessionUrl,
  calculatePKCECodeChallenge,
  Configuration,
  discovery,
  randomNonce,
  randomPKCECodeVerifier,
  randomState,
  refreshTokenGrant,
} from "openid-client";
import { constructNewPath } from "../util/urlHelpers";
import { isValidLocale } from "../i18n";
import config from "../config";
import { INTERNAL_SERVER_ERROR, OK } from "./httpCodes";
import { isAccessTokenValid } from "../util/authHelpers";
import {
  ACCESS_TOKEN_COOKIE,
  NONCE_COOKIE,
  PKCE_CODE_COOKIE,
  REFRESH_TOKEN_COOKIE,
  RETURN_TO_COOKIE,
  STATE_COOKIE,
} from "../constants";
import { decodeToken } from "../util/jwtHelper";
import { getCookie } from "@ndla/util";

const DEPLOYED = process.env.IS_VERCEL === "true" || process.env.NDLA_IS_KUBERNETES !== undefined;
const SAME_SITE: CookieOptions["sameSite"] = DEPLOYED ? "strict" : undefined;
const PROTOCOL = DEPLOYED ? "https" : "http";
const PORT = DEPLOYED ? "" : `:${config.port}`;

const stateOptions: CookieOptions = { httpOnly: true, sameSite: DEPLOYED ? "none" : undefined, secure: DEPLOYED };
const pkceOptions: CookieOptions = { httpOnly: true, sameSite: DEPLOYED ? "none" : undefined, secure: DEPLOYED };
const nonceOptions: CookieOptions = { httpOnly: true, sameSite: DEPLOYED ? "none" : undefined, secure: DEPLOYED };
const returnToOptions: CookieOptions = { httpOnly: true, sameSite: DEPLOYED ? "none" : undefined, secure: DEPLOYED };
const accessTokenOptions: CookieOptions = { sameSite: SAME_SITE, secure: DEPLOYED };
const refreshTokenOptions: CookieOptions = {
  httpOnly: true,
  sameSite: SAME_SITE,
  secure: DEPLOYED,
  path: "/auth/refresh",
};

const router = express.Router();

const isSafeRedirect = (url: string) => {
  try {
    const decodedUrl = decodeURIComponent(url);
    return decodedUrl.startsWith("/") && !decodedUrl.startsWith("//");
  } catch (e) {
    return false;
  }
};

let storedOidcConfig: Configuration | undefined = undefined;

// TODO: Should we error out if this doesn't exist?
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

const getConfig = async (): Promise<Configuration> => {
  if (storedOidcConfig) {
    return storedOidcConfig;
  }
  const oidcConfig = await discovery(
    new URL(`https://${config.auth0BrowserDomain}/.well-known/openid-configuration`),
    config.ndlaPersonalClientId!,
    AUTH0_CLIENT_SECRET,
  );
  storedOidcConfig = oidcConfig;
  return oidcConfig;
};

router.get(["/login", "/:lang/login"], async (req, res) => {
  const auth0Cookie = getCookie(ACCESS_TOKEN_COOKIE, req.headers.cookie ?? "") ?? "";
  const auth0Token = decodeToken(auth0Cookie);
  const returnTo =
    typeof req.query.returnTo === "string" && isSafeRedirect(req.query.returnTo) ? req.query.returnTo : "/";
  res.setHeader("Cache-Control", "private");
  const lang = req.params.lang
    ? isValidLocale(req.params.lang)
      ? req.params.lang
      : config.defaultLanguage
    : undefined;
  const redirect = constructNewPath(returnTo, lang);

  if (auth0Token && isAccessTokenValid(auth0Token)) {
    return res.redirect(redirect);
  }

  const codeVerifier = randomPKCECodeVerifier();
  const code_challenge = await calculatePKCECodeChallenge(codeVerifier);
  const oidcConfig = await getConfig();

  const redirect_uri = `${PROTOCOL}://${req.hostname}${PORT}/login/success`;
  const state = randomState();
  const nonce = randomNonce();

  const parameters: Record<string, string> = {
    redirect_uri,
    scope: "openid profile email offline_access",
    code_challenge,
    code_challenge_method: "S256",
    audience: "ndla_system",
    prompt: "login", // Tells auth0 to always show account selection screen on authorize.
    state,
    nonce,
  };

  if (!config.usernamePasswordEnabled) {
    parameters.connection = "google-oauth2";
  }

  const redirectUrl = buildAuthorizationUrl(oidcConfig, parameters);

  res.cookie(STATE_COOKIE, state, stateOptions);
  res.cookie(PKCE_CODE_COOKIE, codeVerifier, pkceOptions);
  res.cookie(NONCE_COOKIE, nonce, nonceOptions);
  res.cookie(RETURN_TO_COOKIE, redirect, returnToOptions);
  return res.redirect(redirectUrl.toString());
});

router.get("/login/success", async (req, res) => {
  const code = typeof req.query.code === "string" ? req.query.code : undefined;
  res.setHeader("Cache-Control", "private");
  const verifier = getCookie(PKCE_CODE_COOKIE, req.headers.cookie ?? "");
  const state = getCookie(STATE_COOKIE, req.headers.cookie ?? "");
  const nonce = getCookie(NONCE_COOKIE, req.headers.cookie ?? "");
  const returnToCookie = getCookie(RETURN_TO_COOKIE, req.headers.cookie ?? "");
  const returnTo = returnToCookie && isSafeRedirect(returnToCookie) ? returnToCookie : "/";

  if (!code || !verifier || !state || !nonce) {
    res.status(INTERNAL_SERVER_ERROR).send({ error: "Missing code, state, nonce or verifier" });
    return;
  }

  if (req.query.state !== state) {
    res.status(INTERNAL_SERVER_ERROR).send({ error: "State does not match" });
    return;
  }

  const oidcConfig = await getConfig();

  const url = new URL(`${PROTOCOL}://${req.hostname}${PORT}${req.url}`);
  try {
    const tokens = await authorizationCodeGrant(oidcConfig, url, {
      pkceCodeVerifier: verifier,
      idTokenExpected: true,
      expectedState: state,
      expectedNonce: nonce,
    });

    res.cookie(ACCESS_TOKEN_COOKIE, tokens.access_token, {
      ...accessTokenOptions,
      maxAge: tokens.expires_in ? tokens.expires_in * 1000 : undefined,
    });
    // TODO: How do we handle expiration for this? What happens if it expires?
    res.cookie(REFRESH_TOKEN_COOKIE, tokens.refresh_token, refreshTokenOptions);

    res.clearCookie(PKCE_CODE_COOKIE, pkceOptions);
    res.clearCookie(STATE_COOKIE, stateOptions);
    res.clearCookie(NONCE_COOKIE, nonceOptions);
    res.clearCookie(RETURN_TO_COOKIE, returnToOptions);

    return res.redirect(decodeURIComponent(returnTo));
  } catch (e) {
    res.status(INTERNAL_SERVER_ERROR).send({ error: "Login failed" });
  }
});

router.get("/auth/refresh", async (req, res) => {
  const refreshToken = getCookie(REFRESH_TOKEN_COOKIE, req.headers.cookie ?? "");
  res.setHeader("Cache-Control", "private");
  if (!refreshToken?.length) {
    throw new Error("Missing refresh token");
  }

  const oidcConfig = await getConfig();

  try {
    const tokens = await refreshTokenGrant(oidcConfig, refreshToken);
    res.cookie(ACCESS_TOKEN_COOKIE, tokens.access_token, accessTokenOptions);
    res.cookie(REFRESH_TOKEN_COOKIE, tokens.refresh_token, refreshTokenOptions);
    res.status(OK).json(tokens.access_token);
  } catch (e) {
    res.status(INTERNAL_SERVER_ERROR).send({ error: "Failed to refresh token" });
  }
});

router.get(["/logout", "/:lang/logout"], async (req, res) => {
  const relog = req.query.relog === "true";
  const redirect = relog ? constructNewPath("/login", req.params.lang) : "/";
  res.setHeader("Cache-Control", "private");

  const post_logout_redirect_uri = `${PROTOCOL}://${req.hostname}${PORT}${redirect}`;
  const oidcConfig = await getConfig();

  res.clearCookie(ACCESS_TOKEN_COOKIE, accessTokenOptions);
  res.clearCookie(REFRESH_TOKEN_COOKIE, refreshTokenOptions);

  // TODO: Do we need something more here?
  const redirectUrl = buildEndSessionUrl(oidcConfig, {
    // id_token_hint: authToken?.["id_token"],
    post_logout_redirect_uri,
  });

  return res.redirect(redirectUrl.toString());
});

export default router;
