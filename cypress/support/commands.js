// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('apiroute', (method, url, alias) => {
  if (Cypress.env('USE_FIXTURES')) {
    return cy.intercept({method, url}, { fixture: `${alias}`}).as(alias);
  }
  return cy.intercept({method, url}).as(alias);
});

const readResponseBody = body => {
  const fr = new FileReader();
  const jsonBody = JSON.stringify(body);
  const blob = new Blob([jsonBody], {type:"application/json"});

  return new Promise((resolve, reject) => {
    fr.onerror = () => {
      fr.abort();
      reject(new DOMException('Problem parsing body.'));
    };

    fr.onload = () => {
      resolve(fr.result);
    };
    fr.readAsText(blob);
  });
};

Cypress.Commands.add('apiwait', aliases => {
  if (Cypress.env('RECORD_FIXTURES')) {
    let originalXhr = null;
    return cy
      .wait(aliases)
      .then((xhr) => {
        originalXhr = xhr;
        if (Array.isArray(xhr)) {
          return xhr;
        }
        return [xhr];
      })
      .then(xhrs =>
        // If response.body fails, that means you are trying to mock the same path with several fixtures
        Promise.all(xhrs.map(xhr => readResponseBody(xhr.response.body))),
      )
      .then(jsons =>
        cy.task(
          'writeFixtures',
          jsons.map((json, i) => ({
            xhr: originalXhr,
            name: Array.isArray(aliases)
              ? aliases[i].replace('@', '')
              : aliases.replace('@', ''),
            json: json,
          })),
        ),
      )
      .then(() => originalXhr);
  }

  return cy.wait(aliases);
});
