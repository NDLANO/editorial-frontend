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
      return 'http://proxy.ndla-local';
    case 'prod':
      return 'https://api.ndla.no';
    default:
      return `https://${ndlaEnvironment}.api.ndla.no`;
  }
};

const editorialFrontendDomain = () => {
  switch (ndlaEnvironment) {
    case 'local':
      return 'http://localhost:30017';
    case 'prod':
      return 'https://ndla.no';
    default:
      return `https://ndla-frontend.${ndlaEnvironment}.api.ndla.no`;
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
      return 'http://localhost:30017';
    case 'prod':
      return 'https://stier.ndla.no';
    default:
      return `https://learningpath-frontend.${ndlaEnvironment}.api.ndla.no`;
  }
};

const h5pApiUrl = () => {
  switch (ndlaEnvironment) {
    case 'local':
      return 'https://h5p-test.ndla.no';
    case 'test':
      return 'https://h5p-test.ndla.no';
    default:
      return 'https://h5p.ndla.no';
  }
};

const getAuth0Hostname = () => {
  switch (process.env.NDLA_ENVIRONMENT) {
    case 'prod':
      return 'ndla.eu.auth0.com';
    case 'staging':
      return 'ndla-staging.eu.auth0.com';
    default:
      return 'ndla-test.eu.auth0.com';
  }
};

const explanationFrontendDomain = () => {
  if (process.env.LOCAL_NOTION) {
    return 'http://localhost:3100';
  }
  return `https://explanations-frontend.${ndlaEnvironment}.api.ndla.no`;
};

const config = {
  ndlaEnvironment,
  componentName: getEnvironmentVariabel('npm_package_name'),
  host: getEnvironmentVariabel('EDITORIAL_FRONTEND_HOST', 'localhost'),
  port: getEnvironmentVariabel('EDITORIAL_FRONTEND_PORT', '3000'),
  redirectPort: getEnvironmentVariabel('NDLA_REDIRECT_PORT', '3001'),
  logEnvironment: getEnvironmentVariabel('NDLA_ENVIRONMENT', 'local'),
  logglyApiKey: getEnvironmentVariabel('LOGGLY_API_KEY'),
  isNdlaProdEnvironment: ndlaEnvironment === 'prod',
  ndlaApiUrl: getEnvironmentVariabel(
    'NDLA_API_URL',
    getNdlaApiUrl(ndlaEnvironment),
  ),
  editorialFrontendDomain: editorialFrontendDomain(),
  learningpathFrontendDomain: learningpathFrontendDomain(),
  ndlaPersonalClientId: getEnvironmentVariabel('NDLA_PERSONAL_CLIENT_ID', ''),
  auth0Domain: getAuth0Hostname(),
  brightCoveAccountId: getEnvironmentVariabel(
    'BRIGHTCOVE_ACCOUNT_ID',
    '123456789',
  ),
  brightcovePlayerId: getEnvironmentVariabel('BRIGHTCOVE_PLAYER_ID', 'Ab1234'),
  brightcoveApiUrl: 'https://cms.api.brightcove.com',
  h5pApiUrl: getEnvironmentVariabel('H5P_API_URL', h5pApiUrl()),
  googleSearchApiUrl: getEnvironmentVariabel(
    'NDLA_GOOGLE_API_URL',
    'https://www.googleapis.com',
  ),
  googleSearchApiKey: getEnvironmentVariabel('NDLA_GOOGLE_API_KEY'),
  googleSearchEngineId: getEnvironmentVariabel('NDLA_GOOGLE_SEARCH_ENGINE_ID'),
  enableFullTaxonomy: ndlaEnvironment === 'test' || ndlaEnvironment === 'local',
  localConverter: getEnvironmentVariabel('LOCAL_CONVERTER', false),
  checkArticleScript: getEnvironmentVariabel('CHECK_ARTICLE_SCRIPT', false),
  googleTagManagerId: getEnvironmentVariabel('NDLA_GOOGLE_TAG_MANAGER_ID'),
  gaTrackingId: gaTrackingId(),
  explanationFrontendDomain: explanationFrontendDomain(),
};

export function getUniversalConfig() {
  if (typeof window === 'undefined') {
    return config;
  }

  return process.env.BUILD_TARGET === 'server' ||
    process.env.NODE_ENV === 'unittest'
    ? config
    : window.config;
}

export default getUniversalConfig();
