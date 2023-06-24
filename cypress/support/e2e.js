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
let isMockToken = true;

const setLocalStorage = (tokenToSet, realToken) => {
  token = tokenToSet;
  isMockToken = !realToken;
  const expAt = expiresIn(tokenToSet) * 1000 + new Date().getTime();
  localStorage.setItem('access_token', tokenToSet);
  localStorage.setItem('access_token_expires_at', expAt);
  localStorage.setItem('access_token_personal', true);
};

const fetchAndSetToken = () => {
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
    setLocalStorage(res.body.access_token, true);
  });
};
const mockTokenAllPermissions =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJuZGxhX3N5c3RlbSIsImV4cCI6MzI1MTg3MDY0MzAsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImh0dHBzOi8vbmRsYS5uby9uZGxhX2lkIjoieHh4eXl5IiwiaWF0IjoxNjg3NTY0ODkwLCJpc3MiOiJodHRwczovL25kbGEuZXUuYXV0aDAuY29tLyIsInBlcm1pc3Npb25zIjpbImFydGljbGVzOnB1Ymxpc2giLCJhcnRpY2xlczp3cml0ZSIsImF1ZGlvOndyaXRlIiwiY29uY2VwdDphZG1pbiIsImNvbmNlcHQ6d3JpdGUiLCJkcmFmdHM6YWRtaW4iLCJkcmFmdHM6cHVibGlzaCIsImRyYWZ0czp3cml0ZSIsImRyYWZ0czpodG1sIiwiZnJvbnRwYWdlOndyaXRlIiwiaW1hZ2VzOndyaXRlIiwibGVhcm5pbmdwYXRoOmFkbWluIiwibGVhcm5pbmdwYXRoOnB1Ymxpc2giLCJsZWFybmluZ3BhdGg6d3JpdGUiLCJ0YXhvbm9teTphZG1pbiIsInRheG9ub215OndyaXRlIl0sInN1YiI6Inh4eHl5eUBjbGllbnRzIn0.1SVkHhIe_A47fSTyVNnsSfOGvqaulddKEJho2iG--l4';

export const setToken = () => {
  const needRealToken = Cypress.env('RECORD_FIXTURES');
  if (!needRealToken) {
    console.log('Running against mocks so using mock-token');
    setLocalStorage(mockTokenAllPermissions, false);
  } else if (token && !isMockToken) {
    console.log('Reusing already fetched token');
    setLocalStorage(token, !isMockToken);
  } else {
    console.log('Recording fixtures so fetching real token');
    fetchAndSetToken();
  }
};

// Prevents promts to fix electron hanging: https://github.com/cypress-io/cypress/issues/2118
Cypress.on('window:before:unload', (e) => {
  e.stopImmediatePropagation();
});
