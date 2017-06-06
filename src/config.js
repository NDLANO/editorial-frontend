/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const environment = {
  development: {
    isProduction: false,
  },
  production: {
    isProduction: true,
  },
}[process.env.NODE_ENV || 'development'];

const ndlaEnvironment = process.env.NDLA_ENVIRONMENT || 'test';
const apiDomain = () => {
  switch (process.env.NDLA_ENVIRONMENT) {
    case 'local':
      return 'http://proxy.ndla-local';
    case 'prod':
      return 'https://api.ndla.no';
    default:
      return `https://${ndlaEnvironment}.api.ndla.no`;
  }
};

const editorialFrontendDomain = () => {
  switch (process.env.NDLA_ENVIRONMENT) {
    case 'local':
      return 'http://localhost:30017';
    case 'prod':
      return 'https://ndla-frontend.api.ndla.no';
    default:
      return `https://ndla-frontend.${ndlaEnvironment}.api.ndla.no`;
  }
};

module.exports = Object.assign(
  {
    componentName: process.env.npm_package_name,
    host: process.env.EDITORIAL_FRONTEND_HOST || 'localhost',
    port: process.env.EDITORIAL_FRONTEND_PORT || '3000',
    redirectPort: process.env.NDLA_REDIRECT_PORT || '3001',
    logEnvironment: process.env.NDLA_ENVIRONMENT || 'local',
    logglyApiKey: process.env.LOGGLY_API_KEY,
    ndlaApiUrl: process.env.NDLA_API_URL || apiDomain(),
    editorialFrontendDomain: editorialFrontendDomain(),
    auth0ClientID: process.env.AUTH0_CLIENT_ID || '',
    auth0Domain: process.env.AUTH0_DOMAIN || '',
  },
  environment,
);
