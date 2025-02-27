/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { LocaleType } from "./interfaces";

export function getEnvironmentVariabel(key: string, fallback: string): string;
export function getEnvironmentVariabel(key: string, fallback: boolean): boolean;
export function getEnvironmentVariabel(key: string, fallback?: string): string | undefined;
export function getEnvironmentVariabel(key: string, fallback?: string | boolean): string | boolean | undefined {
  const env = "env";
  const variabel = process?.[env]?.[key]; // Hack to prevent DefinePlugin replacing process.env
  return variabel || fallback;
}

type RuntimeType = "test" | "development" | "production";

const getNdlaApiUrl = (ndlaEnvironment: string): string => {
  switch (ndlaEnvironment) {
    case "local":
      return "http://api-gateway.ndla-local";
    case "prod":
      return "https://api.ndla.no";
    default:
      return `https://api.${ndlaEnvironment}.ndla.no`;
  }
};

const ndlaBaseUrl = (ndlaEnvironment: string) => {
  switch (ndlaEnvironment) {
    case "prod":
      return "ndla.no";
    default:
      return `${ndlaEnvironment}.ndla.no`;
  }
};

const ndlaFrontendDomain = (ndlaEnvironment: string) => {
  switch (ndlaEnvironment) {
    case "local":
      return "http://localhost:30017";
    case "prod":
      return "https://ndla.no";
    default:
      return `https://${ndlaEnvironment}.ndla.no`;
  }
};

const editorialFrontendDomain = (ndlaEnvironment: string) => {
  switch (ndlaEnvironment) {
    case "local":
      return "http://localhost:30019";
    case "prod":
      return "https://ed.ndla.no";
    default:
      return `https://ed.${ndlaEnvironment}.ndla.no`;
  }
};

const learningpathFrontendDomain = (ndlaEnvironment: string) => {
  switch (ndlaEnvironment) {
    case "local":
      return "http://localhost:30007";
    case "prod":
      return "https://stier.ndla.no";
    default:
      return `https://stier.${ndlaEnvironment}.ndla.no`;
  }
};

const h5pApiUrl = (ndlaEnvironment: string) => {
  switch (ndlaEnvironment) {
    case "local":
      return "https://h5p-test.ndla.no";
    case "test":
      return "https://h5p-test.ndla.no";
    case "staging":
      return "https://h5p-staging.ndla.no";
    default:
      return "https://h5p.ndla.no";
  }
};

const getAuth0Hostname = (ndlaEnvironment: string) => {
  switch (ndlaEnvironment) {
    case "prod":
      return "ndla.eu.auth0.com";
    case "staging":
      return "ndla-staging.eu.auth0.com";
    default:
      return "ndla-test.eu.auth0.com";
  }
};

const getTranslateServiceUrl = (ndlaEnvironment: string) => {
  switch (ndlaEnvironment) {
    case "test":
    case "local":
    case "dev":
      return "https://preprod.norskrobot.no:4443";
    case "staging":
      return "https://ndla.norskrobot.no:6443";
    default:
      return "https://ndla.norskrobot.no:4443";
  }
};

const matomoDomain = (ndlaEnvironment: string): string => {
  switch (ndlaEnvironment) {
    case "dev":
    case "local":
    case "test":
      return "tall.test.ndla.no";
    case "prod":
      return "tall.ndla.no";
    default:
      return "tall.ndla.no";
  }
};

export const taxonomyApi = `/taxonomy/v1`;

const getDefaultLanguage = () => getEnvironmentVariabel("NDLA_DEFAULT_LANGUAGE", "nb") as LocaleType;

const usernamePasswordEnabled = (ndlaEnvironment: string) => {
  switch (ndlaEnvironment) {
    case "test":
    case "local":
    case "dev":
      return true;
    default:
      return false;
  }
};

export type ConfigType = {
  brightcoveAccountId: string | undefined;
  logEnvironment: string | undefined;
  ndlaApiUrl: string | undefined;
  ndlaBaseUrl: string;
  editorialFrontendDomain: string;
  googleTagManagerId: string | undefined;
  ndlaFrontendDomain: string;
  auth0Domain: string;
  redirectPort: string | undefined;
  host: string | undefined;
  componentName: string | undefined;
  isNdlaProdEnvironment: boolean;
  ndlaEnvironment: string;
  learningpathFrontendDomain: string;
  localConverter: boolean;
  brightcoveApiUrl: string;
  brightcoveUrl: string;
  logglyApiKey: string | undefined;
  taxonomyApi: string;
  h5pApiUrl: string | undefined;
  port: string | undefined;
  ndlaPersonalClientId: string | undefined;
  brightcoveEdPlayerId: string | undefined;
  brightcovePlayerId: string | undefined;
  brightcove360PlayerId: string | undefined;
  brightcoveCopyrightPlayerId: string | undefined;
  disableCSP: string | undefined;
  usernamePasswordEnabled: boolean;
  h5pMetaEnabled: boolean;
  translateServiceUrl: string;
  isVercel: boolean;
  defaultLanguage: LocaleType;
  runtimeType: RuntimeType;
  enableH5pCopy: boolean;
  licenseAll: string | undefined;
  matomoSiteId: string | undefined;
  matomoUrl: string;
};

const getServerSideConfig = (): ConfigType => {
  const ndlaEnvironment = getEnvironmentVariabel("NDLA_ENVIRONMENT", "test");
  return {
    ndlaEnvironment,
    taxonomyApi,
    componentName: getEnvironmentVariabel("npm_package_name", "editorial-frontend"),
    host: getEnvironmentVariabel("EDITORIAL_FRONTEND_HOST", "localhost"),
    port: getEnvironmentVariabel("EDITORIAL_FRONTEND_PORT", "3000"),
    redirectPort: getEnvironmentVariabel("NDLA_REDIRECT_PORT", "3001"),
    logEnvironment: getEnvironmentVariabel("NDLA_ENVIRONMENT", "local"),
    logglyApiKey: getEnvironmentVariabel("LOGGLY_API_KEY"),
    isNdlaProdEnvironment: ndlaEnvironment === "prod",
    ndlaApiUrl: getEnvironmentVariabel("NDLA_API_URL", getNdlaApiUrl(ndlaEnvironment)),
    ndlaBaseUrl: ndlaBaseUrl(ndlaEnvironment),
    ndlaFrontendDomain: getEnvironmentVariabel("FRONTEND_DOMAIN", ndlaFrontendDomain(ndlaEnvironment)),
    editorialFrontendDomain: getEnvironmentVariabel("EDITORIAL_DOMAIN", editorialFrontendDomain(ndlaEnvironment)),
    learningpathFrontendDomain: getEnvironmentVariabel(
      "LEARNINGPATH_DOMAIN",
      learningpathFrontendDomain(ndlaEnvironment),
    ),
    defaultLanguage: getDefaultLanguage(),
    ndlaPersonalClientId: getEnvironmentVariabel("NDLA_PERSONAL_CLIENT_ID", ""),
    auth0Domain: getEnvironmentVariabel("AUTH0_DOMAIN", getAuth0Hostname(ndlaEnvironment)),
    brightcoveAccountId: getEnvironmentVariabel("BRIGHTCOVE_ACCOUNT_ID", "4806596774001"),
    brightcoveEdPlayerId: getEnvironmentVariabel("BRIGHTCOVE_PLAYER_ED_ID", "Ab1234"),
    brightcovePlayerId: getEnvironmentVariabel("BRIGHTCOVE_PLAYER_ID", "Ab1234"),
    brightcove360PlayerId: getEnvironmentVariabel("BRIGHTCOVE_PLAYER_360_ID", "Ab1234"),
    brightcoveCopyrightPlayerId: getEnvironmentVariabel("BRIGHTCOVE_PLAYER_COPYRIGHT_ID", "Ab1234"),
    brightcoveApiUrl: "https://cms.api.brightcove.com",
    brightcoveUrl: "https://studio.brightcove.com/products/videocloud/home",
    h5pApiUrl: getEnvironmentVariabel("H5P_API_URL", h5pApiUrl(ndlaEnvironment)),
    localConverter: getEnvironmentVariabel("LOCAL_CONVERTER", "false") === "true",
    googleTagManagerId: getEnvironmentVariabel("NDLA_GOOGLE_TAG_MANAGER_ID"),
    disableCSP: getEnvironmentVariabel("DISABLE_CSP", "false"),
    usernamePasswordEnabled: getEnvironmentVariabel(
      "USERNAME_PASSWORD_ENABLED",
      usernamePasswordEnabled(ndlaEnvironment),
    ),
    h5pMetaEnabled: getEnvironmentVariabel("H5PMETA_ENABLED", "false") === "true",
    translateServiceUrl: getEnvironmentVariabel("NDKM_URL", getTranslateServiceUrl(ndlaEnvironment)),
    isVercel: getEnvironmentVariabel("IS_VERCEL", "false") === "true",
    runtimeType: getEnvironmentVariabel("NODE_ENV", "development") as "test" | "development" | "production",
    enableH5pCopy: getEnvironmentVariabel("ENABLE_H5P_COPY", "true") === "true",
    licenseAll: getEnvironmentVariabel("LICENSE_ALL"),
    matomoSiteId: getEnvironmentVariabel("MATOMO_SITE_ID"),
    matomoUrl: getEnvironmentVariabel("MATOMO_URL", matomoDomain(ndlaEnvironment)),
  };
};

export function getUniversalConfig(): ConfigType {
  if (typeof window === "undefined" || process.env.NODE_ENV === "test") {
    return getServerSideConfig();
  }

  return window.config;
}

export default getUniversalConfig();
