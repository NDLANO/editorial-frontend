/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { LocaleType } from './interfaces';

export function getEnvironmentVariabel(key: string, fallback: string): string;
export function getEnvironmentVariabel(key: string, fallback: boolean): boolean;
export function getEnvironmentVariabel(key: string, fallback?: string): string | undefined;
export function getEnvironmentVariabel(
  key: string,
  fallback?: string | boolean,
): string | boolean | undefined {
  const env = 'env';
  const variabel = process[env][key]; // Hack to prevent DefinePlugin replacing process.env
  return variabel || fallback;
}

const ndlaEnvironment = getEnvironmentVariabel('NDLA_ENVIRONMENT', 'test');

export const getNdlaApiUrl = (env: string): string => {
  switch (env) {
    case 'local':
      return 'http://api-gateway.ndla-local';
    case 'prod':
      return 'https://api.ndla.no';
    default:
      return `https://api.${ndlaEnvironment}.ndla.no`;
  }
};

export const ndlaBaseUrl = () => {
  switch (ndlaEnvironment) {
    case 'prod':
      return 'ndla.no';
    default:
      return `${ndlaEnvironment}.ndla.no`;
  }
};

const ndlaFrontendDomain = () => {
  switch (ndlaEnvironment) {
    case 'local':
      return 'http://localhost:30017';
    case 'prod':
      return 'https://ndla.no';
    default:
      return `https://${ndlaEnvironment}.ndla.no`;
  }
};

const editorialFrontendDomain = () => {
  switch (ndlaEnvironment) {
    case 'local':
      return 'http://localhost:30019';
    case 'prod':
      return 'https://ed.ndla.no';
    default:
      return `https://ed.${ndlaEnvironment}.ndla.no`;
  }
};

const gaTrackingId = () => {
  if (process.env.NODE_ENV !== 'production') {
    return '';
  }

  switch (ndlaEnvironment) {
    case 'prod':
      return 'UA-9036010-36';
    case 'staging':
      return 'UA-9036010-36';
    default:
      return '';
  }
};

const learningpathFrontendDomain = () => {
  switch (ndlaEnvironment) {
    case 'local':
      return 'http://localhost:30007';
    case 'prod':
      return 'https://stier.ndla.no';
    default:
      return `https://stier.${ndlaEnvironment}.ndla.no`;
  }
};

const h5pApiUrl = () => {
  switch (ndlaEnvironment) {
    case 'local':
      return 'https://h5p-test.ndla.no';
    case 'test':
      return 'https://h5p-test.ndla.no';
    case 'staging':
      return 'https://h5p-staging.ndla.no';
    default:
      return 'https://h5p.ndla.no';
  }
};

export const getAuth0Hostname = () => {
  switch (ndlaEnvironment) {
    case 'prod':
      return 'ndla.eu.auth0.com';
    case 'staging':
      return 'ndla-staging.eu.auth0.com';
    default:
      return 'ndla-test.eu.auth0.com';
  }
};

const getTranslateServiceUrl = () => {
  switch (ndlaEnvironment) {
    case 'test':
    case 'local':
    case 'dev':
      return 'https://preprod.norskrobot.no:4443';
    default:
      return 'https://ndla.norskrobot.no:4443';
  }
};

export const taxonomyApi = `/taxonomy/v1`;

export const getZendeskWidgetSecret = () => {
  return getEnvironmentVariabel('NDLA_ED_ZENDESK_SECRET_KEY', 'something');
};

export const getDefaultLanguage = () =>
  getEnvironmentVariabel('NDLA_DEFAULT_LANGUAGE', 'nb') as LocaleType;

const usernamePasswordEnabled = () => {
  switch (ndlaEnvironment) {
    case 'test':
    case 'local':
    case 'dev':
      return true;
    default:
      return false;
  }
};

export type ConfigType = {
  brightcoveAccountId: string | undefined;
  checkArticleScript: boolean;
  logEnvironment: string | undefined;
  ndlaApiUrl: string | undefined;
  ndlaBaseUrl: string;
  gaTrackingId: string;
  editorialFrontendDomain: string;
  googleTagManagerId: string | undefined;
  ndlaFrontendDomain: string;
  auth0Domain: string;
  redirectPort: string | undefined;
  host: string | undefined;
  componentName: string | undefined;
  isNdlaProdEnvironment: boolean;
  versioningEnabled: string;
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
  zendeskWidgetKey: string | undefined;
  brightcoveEdPlayerId: string | undefined;
  brightcovePlayerId: string | undefined;
  brightcove360PlayerId: string | undefined;
  brightcoveCopyrightPlayerId: string | undefined;
  disableCSP: string | undefined;
  usernamePasswordEnabled: boolean;
  translateServiceUser: string;
  translateServiceToken: string;
  translateServiceUrl: string;
};

const config: ConfigType = {
  ndlaEnvironment,
  taxonomyApi,
  componentName: getEnvironmentVariabel('npm_package_name', 'editorial-frontend'),
  host: getEnvironmentVariabel('EDITORIAL_FRONTEND_HOST', 'localhost'),
  port: getEnvironmentVariabel('EDITORIAL_FRONTEND_PORT', '3000'),
  redirectPort: getEnvironmentVariabel('NDLA_REDIRECT_PORT', '3001'),
  logEnvironment: getEnvironmentVariabel('NDLA_ENVIRONMENT', 'local'),
  logglyApiKey: getEnvironmentVariabel('LOGGLY_API_KEY'),
  isNdlaProdEnvironment: ndlaEnvironment === 'prod',
  versioningEnabled: getEnvironmentVariabel('ENABLE_VERSIONING', 'true'),
  ndlaApiUrl: getEnvironmentVariabel('NDLA_API_URL', getNdlaApiUrl(ndlaEnvironment)),
  ndlaBaseUrl: ndlaBaseUrl(),
  ndlaFrontendDomain: getEnvironmentVariabel('FRONTEND_DOMAIN', ndlaFrontendDomain()),
  editorialFrontendDomain: getEnvironmentVariabel('EDITORIAL_DOMAIN', editorialFrontendDomain()),
  learningpathFrontendDomain: getEnvironmentVariabel(
    'LEARNINGPATH_DOMAIN',
    learningpathFrontendDomain(),
  ),
  ndlaPersonalClientId: getEnvironmentVariabel('NDLA_PERSONAL_CLIENT_ID', ''),
  auth0Domain: getEnvironmentVariabel('AUTH0_DOMAIN', getAuth0Hostname()),
  brightcoveAccountId: getEnvironmentVariabel('BRIGHTCOVE_ACCOUNT_ID', '123456789'),
  brightcoveEdPlayerId: getEnvironmentVariabel('BRIGHTCOVE_PLAYER_ED_ID', 'Ab1234'),
  brightcovePlayerId: getEnvironmentVariabel('BRIGHTCOVE_PLAYER_ID', 'Ab1234'),
  brightcove360PlayerId: getEnvironmentVariabel('BRIGHTCOVE_PLAYER_360_ID', 'Ab1234'),
  brightcoveCopyrightPlayerId: getEnvironmentVariabel('BRIGHTCOVE_PLAYER_COPYRIGHT_ID', 'Ab1234'),
  brightcoveApiUrl: 'https://cms.api.brightcove.com',
  brightcoveUrl: 'https://studio.brightcove.com/products/videocloud/home',
  h5pApiUrl: getEnvironmentVariabel('H5P_API_URL', h5pApiUrl()),
  localConverter: getEnvironmentVariabel('LOCAL_CONVERTER', 'false') === 'true',
  checkArticleScript: getEnvironmentVariabel('CHECK_ARTICLE_SCRIPT', 'false') === 'true',
  googleTagManagerId: getEnvironmentVariabel('NDLA_GOOGLE_TAG_MANAGER_ID'),
  gaTrackingId: getEnvironmentVariabel('GA_TRACKING_ID', gaTrackingId()),
  zendeskWidgetKey: getEnvironmentVariabel('NDLA_ED_ZENDESK_WIDGET_KEY'),
  disableCSP: getEnvironmentVariabel('DISABLE_CSP', 'false'),
  usernamePasswordEnabled: getEnvironmentVariabel(
    'USERNAME_PASSWORD_ENABLED',
    usernamePasswordEnabled(),
  ),
  translateServiceUser: getEnvironmentVariabel('NDKM_USER', ''),
  translateServiceToken: getEnvironmentVariabel('NDKM_TOKEN', ''),
  translateServiceUrl: getEnvironmentVariabel('NDKM_URL', getTranslateServiceUrl()),
};

export function getUniversalConfig(): ConfigType {
  if (typeof window === 'undefined') {
    return config;
  }

  return process.env.BUILD_TARGET === 'server' || process.env.NODE_ENV === 'unittest'
    ? config
    : window.config;
}

export default getUniversalConfig();
