/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken, visitOptions } from '../../support';
import editorRoutes from './editorRoutes';

describe('Learning resource editing', () => {
  beforeEach(() => {
    setToken();
    cy.server({ force404: true });

    editorRoutes();

    cy.visit('/subject-matter/learning-resource/new', visitOptions);
    cy.apiwait('@licenses');
  });

  it('can enter title, ingress and content then save', () => {
    cy.get('[data-testid=saveLearningResourceButtonWrapper] button').first().click({ force: true }); // checking that saving is disabled
    cy.get('[data-cy=learning-resource-title]').type('This is a test title.', {
      force: true,
    });
    cy.get('.article_introduction').type('Test ingress');
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .first()
      .focus()
      .type('This is test content {enter}', {
        force: true,
      });
    cy.get('[data-testid=saveLearningResourceButtonWrapper] button').first().click();
    // cy.url().should('contain', 'subject-matter/learning-resource/9337/edit/nb');
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
        cy.get('input[type="text"]').type('Ola Nordmann', {
          force: true,
        });
        cy.get('[data-cy="contributor-selector"]').select('Originator', {
          force: true,
        });
      });
    cy.get('h2')
      .contains('Rettighetshaver')
      .parent()
      .parent()
      .within(_ => {
        cy.get('[data-cy=addContributor]').click({ force: true });
        cy.get('input[type="text"]').type('Ola Nordmann', {
          force: true,
        });
        cy.get('[data-cy="contributor-selector"]').select('Rightsholder', {
          force: true,
        });
      });
    cy.get('h2')
      .contains('Bearbeider')
      .parent()
      .parent()
      .within(_ => {
        cy.get('[data-cy=addContributor]').click({ force: true });
        cy.get('input[type="text"]').type('Ola Nordmann', {
          force: true,
        });
        cy.get('[data-cy="contributor-selector"]').select('Processor', {
          force: true,
        });
      });
  });
});
