/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken, visitOptions } from '../../support';
import editorRoutes from './editorRoutes';

const ARTICLE_ID = 800;

describe('Learning resource editing', () => {
  beforeEach(() => {
    setToken();
    editorRoutes(ARTICLE_ID);

    cy.visit(`/nb/subject-matter/learning-resource/${ARTICLE_ID}/edit/nb`, visitOptions);
    cy.apiwait('@licenses');
    cy.wait(600);
  });

  it('can enter title, ingress and content then save', () => {
    cy.get('[data-testid=saveLearningResourceButtonWrapper] button')
      .first()
      .click({ force: true }); // checking that saving is disabled
    cy.get('[data-cy=learning-resource-title]').type('This is a test title.', { force: true });
    cy.get('[data-cy=learning-resource-ingress]').type('Test ingress', { force: true });
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .first()
      .focus()
      .type('This is test content {enter}', { force: true });
    cy.get('[data-testid=saveLearningResourceButtonWrapper] button')
      .first()
      .click();
  });

  it('Can add all contributors', () => {
    cy.get('button > span')
      .contains('Lisens og bruker')
      .click();
    cy.apiwait('@agreements');
    cy.get('button > span')
      .contains('Innhold')
      .click();
    cy.get('h2')
      .contains('Opphavsperson')
      .parent()
      .parent()
      .within(_ => {
        cy.get('[data-cy=addContributor]').click({ force: true });
        cy.get('input[type="text"]')
          .last()
          .type('Ola Nordmann', { force: true })
          .blur();
        cy.get('[data-cy="contributor-selector"]')
          .last()
          .select('originator', { force: true });
        cy.get('[data-cy="contributor-selector"]')
          .first()
          .should('have.value', 'writer');
      });
    cy.get('h2')
      .contains('Rettighetshaver')
      .parent()
      .parent()
      .within(_ => {
        cy.get('[data-cy=addContributor]').click({ force: true });
        cy.get('input[type="text"]')
          .type('Ola Nordmann', { force: true })
          .blur();
        cy.get('[data-cy="contributor-selector"]').select('rightsholder', { force: true });
      });
    cy.get('h2')
      .contains('Bearbeider')
      .parent()
      .parent()
      .within(_ => {
        cy.get('[data-cy=addContributor]').click({ force: true });
        cy.get('input[type="text"]')
          .last()
          .type('Ola Nordmann', { force: true })
          .blur();
        cy.get('[data-cy="contributor-selector"]')
          .last()
          .select('processor', { force: true });
      });
  });
});
