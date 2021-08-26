/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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

export const taxonomyApi = `/taxonomy/v1`;

export const getZendeskWidgetSecret = () => {
  return getEnvironmentVariabel('NDLA_ED_ZENDESK_WIDGET_SECRET', 'something');
};

export const getDefaultLanguage = () => getEnvironmentVariabel('NDLA_DEFAULT_LANGUAGE', 'nb');

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
  brightCoveAccountId: string | undefined;
  checkArticleScript: boolean;
  logEnvironment: string | undefined;
  ndlaApiUrl: string | undefined;
  gaTrackingId: string;
  editorialFrontendDomain: string;
  googleTagManagerId: string | undefined;
  ndlaFrontendDomain: string;
  auth0Domain: string;
  redirectPort: string | undefined;
  host: string | undefined;
  componentName: string | undefined;
  googleSearchEngineId: string | undefined;
  isNdlaProdEnvironment: boolean;
  ndlaEnvironment: string;
  learningpathFrontendDomain: string;
  googleSearchApiKey: string | undefined;
  localConverter: boolean;
  brightcoveApiUrl: string;
  logglyApiKey: string | undefined;
  taxonomyApi: string;
  h5pApiUrl: string | undefined;
  googleSearchApiUrl: string | undefined;
  port: string | undefined;
  ndlaPersonalClientId: string | undefined;
  npkToken: string | undefined;
  zendeskWidgetKey: string | undefined;
  brightcovePlayerId: string | undefined;
  disableCSP: string | undefined;
  usernamePasswordEnabled: boolean;
};

const config: ConfigType = {
  ndlaEnvironment,
  taxonomyApi,
  componentName: getEnvironmentVariabel('npm_package_name'),
  host: getEnvironmentVariabel('EDITORIAL_FRONTEND_HOST', 'localhost'),
  port: getEnvironmentVariabel('EDITORIAL_FRONTEND_PORT', '3000'),
  redirectPort: getEnvironmentVariabel('NDLA_REDIRECT_PORT', '3001'),
  logEnvironment: getEnvironmentVariabel('NDLA_ENVIRONMENT', 'local'),
  logglyApiKey: getEnvironmentVariabel('LOGGLY_API_KEY'),
  isNdlaProdEnvironment: ndlaEnvironment === 'prod',
  ndlaApiUrl: getEnvironmentVariabel('NDLA_API_URL', getNdlaApiUrl(ndlaEnvironment)),
  ndlaFrontendDomain: getEnvironmentVariabel('FRONTEND_DOMAIN', ndlaFrontendDomain()),
  editorialFrontendDomain: getEnvironmentVariabel('EDITORIAL_DOMAIN', editorialFrontendDomain()),
  learningpathFrontendDomain: getEnvironmentVariabel(
    'LEARNINGPATH_DOMAIN',
    learningpathFrontendDomain(),
  ),
  ndlaPersonalClientId: getEnvironmentVariabel('NDLA_PERSONAL_CLIENT_ID', ''),
  auth0Domain: getEnvironmentVariabel('AUTH0_DOMAIN', getAuth0Hostname()),
  brightCoveAccountId: getEnvironmentVariabel('BRIGHTCOVE_ACCOUNT_ID', '123456789'),
  brightcovePlayerId: getEnvironmentVariabel('BRIGHTCOVE_PLAYER_ID', 'Ab1234'),
  brightcoveApiUrl: 'https://cms.api.brightcove.com',
  h5pApiUrl: getEnvironmentVariabel('H5P_API_URL', h5pApiUrl()),
  googleSearchApiUrl: getEnvironmentVariabel('NDLA_GOOGLE_API_URL', 'https://www.googleapis.com'),
  googleSearchApiKey: getEnvironmentVariabel('NDLA_GOOGLE_API_KEY'),
  googleSearchEngineId: getEnvironmentVariabel('NDLA_GOOGLE_SEARCH_ENGINE_ID'),
  localConverter: getEnvironmentVariabel('LOCAL_CONVERTER', 'false') === 'true',
  checkArticleScript: getEnvironmentVariabel('CHECK_ARTICLE_SCRIPT', 'false') === 'true',
  googleTagManagerId: getEnvironmentVariabel('NDLA_GOOGLE_TAG_MANAGER_ID'),
  gaTrackingId: getEnvironmentVariabel('GA_TRACKING_ID', gaTrackingId()),
  npkToken: getEnvironmentVariabel('NPK_TOKEN'),
  zendeskWidgetKey: getEnvironmentVariabel('NDLA_ED_ZENDESK_WIDGET_KEY'),
  disableCSP: getEnvironmentVariabel('DISABLE_CSP', 'false'),
  usernamePasswordEnabled: getEnvironmentVariabel(
    'USERNAME_PASSWORD_ENABLED',
    usernamePasswordEnabled(),
  ),
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
