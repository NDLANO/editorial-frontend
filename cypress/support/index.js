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
export const visitOptions = {
  onBeforeLoad: win => {
    win.fetch = null; //eslint-disable-line
  },
};

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
    cy.request(options).then(res => {
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
    localStorage.setItem(
      'access_token_expires_at',
      expiresIn(token) * 1000 + new Date().getTime(),
    );
    localStorage.setItem('access_token_personal', true);
  }
};

// Prevents promts to fix electron hanging: https://github.com/cypress-io/cypress/issues/2118
Cypress.on('window:before:load', function (win) {
  const original = win.EventTarget.prototype.addEventListener
  win.EventTarget.prototype.addEventListener = function () {
    if (arguments && arguments[0] === 'beforeunload') {
      return
    }
    return original.apply(this, arguments)
  }

  Object.defineProperty(win, 'onbeforeunload', {
    get: function () { },
    set: function () { }
  })
})
