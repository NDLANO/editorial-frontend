/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import editorRoutes from './editorRoutes';

const ARTICLE_ID = 800;

describe('Learning resource editing', () => {
  beforeEach(() => {
    cy.setToken();
    editorRoutes(ARTICLE_ID);

    cy.visit(`/subject-matter/learning-resource/${ARTICLE_ID}/edit/nb`);
    cy.apiwait('@licenses');
  });

  it('can enter title, ingress and content then save', () => {
    cy.get('[data-testid=saveLearningResourceButtonWrapper] button').should('be.disabled');
    cy.get('[data-cy=learning-resource-title]')
      .click()
      .should('have.focus')
      .type('This is a test title.');
    cy.get('[data-cy=learning-resource-ingress]')
      .click()
      .should('have.focus')
      .type('Test ingress');
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .click()
      .should('have.focus')
      .type('This is test content {enter}');
    cy.get('[data-testid=saveLearningResourceButtonWrapper] button')
      .first()
      .click();
    cy.apiwait('@patchUserData');
    cy.get('[data-testid=saveLearningResourceButtonWrapper] button').contains('Lagret');
  });

  it('Can add all contributors', () => {
    cy.contains('Lisens og bruker').click();
    cy.apiwait('@agreements');
    cy.get('h2')
      .contains('Opphavsperson')
      .parent()
      .parent()
      .within(_ => {
        cy.get('[data-cy=addContributor]').click();
        cy.get('input[type="text"]')
          .last()
          .type('Ola Nordmann')
          .blur();
        cy.get('[data-cy="contributor-selector"]')
          .last()
          .select('originator');
        cy.get('[data-cy="contributor-selector"]')
          .first()
          .should('have.value', 'writer');
      });
    cy.get('h2')
      .contains('Rettighetshaver')
      .parent()
      .parent()
      .within(_ => {
        cy.get('[data-cy=addContributor]').click();
        cy.get('input[type="text"]')
          .type('Ola Nordmann')
          .blur();
        cy.get('[data-cy="contributor-selector"]').select('rightsholder');
      });
    cy.get('h2')
      .contains('Bearbeider')
      .parent()
      .parent()
      .within(_ => {
        cy.get('[data-cy=addContributor]').click();
        cy.get('input[type="text"]')
          .last()
          .type('Ola Nordmann')
          .blur();
        cy.get('[data-cy="contributor-selector"]')
          .last()
          .select('processor');
      });
  });
});
