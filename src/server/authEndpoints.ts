/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import express from "express";
import {
  authorizationCodeGrant,
  buildAuthorizationUrl,
  buildEndSessionUrl,
  calculatePKCECodeChallenge,
  Configuration,
  discovery,
  randomPKCECodeVerifier,
  refreshTokenGrant,
} from "openid-client";
import { constructNewPath } from "../util/urlHelpers";
import { isValidLocale } from "../i18n";
import config from "../config";
import { INTERNAL_SERVER_ERROR, OK } from "./httpCodes";
import { isAccessTokenValid } from "../util/authHelpers";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "../constants";
import { decodeToken } from "../util/jwtHelper";
import { getCookie } from "@ndla/util";

let storedOidcConfig: Configuration | undefined = undefined;
const router = express.Router();

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
  const state = typeof req.query.state === "string" ? req.query.state : "";
  res.setHeader("Cache-Control", "private");
  const lang = req.params.lang
    ? isValidLocale(req.params.lang)
      ? req.params.lang
      : config.defaultLanguage
    : undefined;
  const redirect = constructNewPath(state, lang);

  if (auth0Token && isAccessTokenValid(auth0Token)) {
    return res.redirect(redirect);
  }

  const codeVerifier = randomPKCECodeVerifier();
  const code_challenge = await calculatePKCECodeChallenge(codeVerifier);
  const oidcConfig = await getConfig();

  const port = req.protocol === "http" ? `:${config.port}` : "";
  // TODO: Proper redirect
  const redirect_uri = `${req.protocol}://${req.hostname}${port}/login/success`;

  const parameters: Record<string, string> = {
    redirect_uri,
    scope: "openid profile email offline_access",
    code_challenge,
    code_challenge_method: "S256",
    audience: "ndla_system",
    prompt: "login", // Tells auth0 to always show account selection screen on authorize.
  };

  if (!config.usernamePasswordEnabled) {
    parameters.connection = "google-oauth2";
  }

  const redirectUrl = buildAuthorizationUrl(oidcConfig, parameters);

  redirectUrl.searchParams.append("returnTo", redirect);

  res.cookie("PKCE_code", codeVerifier, { httpOnly: true });
  return res.redirect(redirectUrl.toString());
});

router.get("/login/success", async (req, res) => {
  const code = typeof req.query.code === "string" ? req.query.code : undefined;
  const state = typeof req.query.state === "string" ? req.query.state : "/";
  res.setHeader("Cache-Control", "private");
  const verifier = getCookie("PKCE_code", req.headers.cookie ?? "");
  if (!code || !verifier) {
    throw new Error("Missing code or verifier");
  }

  const oidcConfig = await getConfig();

  const port = req.protocol === "http" ? `:${config.port}` : "";
  // TODO: Redirect
  const url = new URL(`${req.protocol}://${req.hostname}${port}${req.url}`);
  try {
    const tokens = await authorizationCodeGrant(oidcConfig, url, {
      pkceCodeVerifier: verifier,
      idTokenExpected: true,
    });

    // TODO: Make these more secure
    res.cookie(ACCESS_TOKEN_COOKIE, tokens.access_token);
    res.cookie(REFRESH_TOKEN_COOKIE, tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/auth/refresh",
    });
    return res.redirect(state);
  } catch (e) {
    res.status(INTERNAL_SERVER_ERROR).send({ error: "Login failed" });
  }
});

// TODO: Fix and test
router.get("/auth/refresh", async (req, res) => {
  const refreshToken = getCookie(REFRESH_TOKEN_COOKIE, req.headers.cookie ?? "");
  res.setHeader("Cache-Control", "private");
  if (!refreshToken?.length) {
    throw new Error("Missing refresh token");
  }

  const oidcConfig = await getConfig();

  try {
    const tokens = await refreshTokenGrant(oidcConfig, refreshToken);
    // TODO: Make these more secure
    res.cookie(ACCESS_TOKEN_COOKIE, tokens.access_token);
    res.cookie(REFRESH_TOKEN_COOKIE, tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/auth/refresh",
    });
    res.status(OK).json(tokens.access_token);
  } catch (e) {
    res.status(INTERNAL_SERVER_ERROR).send({ error: "Failed to refresh token" });
  }
});

router.get(["/logout", "/:lang/logout"], async (req, res) => {
  const relog = req.query.relog === "true";
  const redirect = relog ? constructNewPath("/login", req.params.lang) : "/";
  res.setHeader("Cache-Control", "private");

  const port = req.protocol === "http" ? `:${config.port}` : "";
  const post_logout_redirect_uri = `${req.protocol}://${req.hostname}${port}${redirect}`;
  const oidcConfig = await getConfig();

  // TODO: Do we need options here?
  res.clearCookie(ACCESS_TOKEN_COOKIE);
  res.clearCookie(REFRESH_TOKEN_COOKIE);

  const redirectUrl = buildEndSessionUrl(oidcConfig, {
    // id_token_hint: authToken?.["id_token"],
    post_logout_redirect_uri,
  });

  return res.redirect(redirectUrl.toString());
});

export default router;
