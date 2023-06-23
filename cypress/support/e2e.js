// ***********************************************************
// This example support/index.tsx is processed and
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
import decode from 'jwt-decode';
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')
/*export const visitOptions = {
  onBeforeLoad: win => {
    win.fetch = null; //eslint-disable-line
  },
};*/

export function expiresIn(token) {
  const decoded = decode(token);
  if (!(decoded.exp && decoded.iat)) return 0;
  return decoded.exp - decoded.iat - 60; // Add 60 second buffer
}

let token = '';

export const setToken = () => {
  if (!token) {
    const options = {
      method: 'POST',
      url: 'https://ndla-test.eu.auth0.com/oauth/token',
      body: {
        client_id: Cypress.env('NDLA_END_TO_END_TESTING_CLIENT_ID'),
        client_secret: Cypress.env('NDLA_END_TO_END_TESTING_CLIENT_SECRET'),
        grant_type: Cypress.env('NDLA_END_TO_END_TESTING_GRANT_TYPE'),
        audience: Cypress.env('NDLA_END_TO_END_TESTING_AUDIENCE'),
      },
      json: true,
    };
    cy.request(options).then((res) => {
      localStorage.setItem('access_token', res.body.access_token);
      localStorage.setItem(
        'access_token_expires_at',
        expiresIn(res.body.access_token) * 1000 + new Date().getTime(),
      );
      localStorage.setItem('access_token_personal', true);
      token = res.body.access_token;
    });
  } else {
    localStorage.setItem('access_token', token);
    localStorage.setItem('access_token_expires_at', expiresIn(token) * 1000 + new Date().getTime());
    localStorage.setItem('access_token_personal', true);
  }
};

// Prevents promts to fix electron hanging: https://github.com/cypress-io/cypress/issues/2118
Cypress.on('window:before:unload', (e) => {
  e.stopImmediatePropagation();
});
