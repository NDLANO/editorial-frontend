// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import { expiresIn } from '../../src/util/jwtHelper';

// Alternatively you can use CommonJS syntax:
// require('./commands')
const visitOptions = {
  onBeforeLoad: win => {
    win.fetch = null; //eslint-disable-line
  },
};

export const beforeEachHelper = visitUrl => {
  const options = {
    method: 'POST',
    url: 'https://ndla.eu.auth0.com/oauth/token',
    body: {
      client_id: Cypress.env('NDLA_EDITORIAL_CLIENT_ID'),
      client_secret: Cypress.env('NDLA_EDITORIAL_CLIENT_SECRET'),
      grant_type: 'client_credentials',
      audience: 'ndla_system',
    },
    json: true,
  };
  cy.request(options)
    .then(res => {
      localStorage.setItem('access_token', res.body.access_token);
      localStorage.setItem(
        'access_token_expires_at',
        expiresIn(res.body.access_token) * 1000 + new Date().getTime(),
      );
      localStorage.setItem('access_token_personal', true);
    })
    .then(() => {
      cy.visit(visitUrl, visitOptions);
    });
};
