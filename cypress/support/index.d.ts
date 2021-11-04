/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    dataCy(value: string): Chainable<Element>;
    apiroute(
      operation: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE',
      url: string,
      alias?: string,
    ): Chainable<Element>;
    apiwait(aliases: string[]): Chainable<Element>;
  }
  interface Interception {
    apiwait(aliases: string[]): Chainable<Interception>;
  }
}
