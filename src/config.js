/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const getEnvironmentVariabel = (key, fallback = undefined) => {
  const env = 'env';
  const variabel = process[env][key]; // Hack to prevent DefinePlugin replacing process.env
  return variabel || fallback;
};

const ndlaEnvironment = getEnvironmentVariabel('NDLA_ENVIRONMENT', 'test');

export const getNdlaApiUrl = env => {
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
  switch (process.env.NDLA_ENVIRONMENT) {
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

const config = {
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
  ndlaFrontendDomain: ndlaFrontendDomain(),
  editorialFrontendDomain: editorialFrontendDomain(),
  learningpathFrontendDomain: learningpathFrontendDomain(),
  ndlaPersonalClientId: getEnvironmentVariabel('NDLA_PERSONAL_CLIENT_ID', ''),
  auth0Domain: getAuth0Hostname(),
  brightCoveAccountId: getEnvironmentVariabel('BRIGHTCOVE_ACCOUNT_ID', '123456789'),
  brightcovePlayerId: getEnvironmentVariabel('BRIGHTCOVE_PLAYER_ID', 'Ab1234'),
  brightcoveApiUrl: 'https://cms.api.brightcove.com',
  h5pApiUrl: getEnvironmentVariabel('H5P_API_URL', h5pApiUrl()),
  googleSearchApiUrl: getEnvironmentVariabel('NDLA_GOOGLE_API_URL', 'https://www.googleapis.com'),
  googleSearchApiKey: getEnvironmentVariabel('NDLA_GOOGLE_API_KEY'),
  googleSearchEngineId: getEnvironmentVariabel('NDLA_GOOGLE_SEARCH_ENGINE_ID'),
  localConverter: getEnvironmentVariabel('LOCAL_CONVERTER', false),
  checkArticleScript: getEnvironmentVariabel('CHECK_ARTICLE_SCRIPT', false),
  googleTagManagerId: getEnvironmentVariabel('NDLA_GOOGLE_TAG_MANAGER_ID'),
  gaTrackingId: gaTrackingId(),
  npkToken: getEnvironmentVariabel('NPK_TOKEN'),
  zendeskWidgetKey: getEnvironmentVariabel('NDLA_ED_ZENDESK_WIDGET_KEY'),
  disableCSP: getEnvironmentVariabel('DISABLE_CSP', 'false'),
};

export function getUniversalConfig() {
  if (typeof window === 'undefined') {
    return config;
  }

  return process.env.BUILD_TARGET === 'server' || process.env.NODE_ENV === 'unittest'
    ? config
    : window.config;
}

export default getUniversalConfig();
