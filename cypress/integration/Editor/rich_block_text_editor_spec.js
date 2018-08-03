/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { beforeEachHelper } from '../../support';

beforeEach(() => {
  beforeEachHelper('/subject-matter/learning-resource/new');
});

describe('Learning resource editing', () => {
  it('should be able to create a new learning resource', () => {
    cy.server();
    cy.fixture('saveLearningResource').as('saveResponse');
    cy
      .route({
        method: 'POST',
        url: `/draft-api/v1/drafts/`,
        status: 201,
        response: '@saveResponse',
      })
      .as('savedLR');

    cy.get('[data-testid=saveLearningResourceButton').click({ force: true }); // check that saving is disabled
    cy
      .get('[data-cy=learning-resource-title]')
      .type('This is a test title.', { force: true });
    cy.get('.article_introduction').type('Test ingress', { force: true });
    cy
      .get('[data-cy=slate-editor] div')
      .first()
      .focus()
      .type('This is test content {enter}', {
        force: true,
      });
    /*  
        cy.get('[slate-block-picker]').click();
        cy.get('[daya-cy=create-block]').click();     
    cy.get('[daya-cy=create-factAside]').click();
      cy.get('[daya-cy=create-table]').click();
      cy.get('[daya-cy=create-bodybox]').click();
      cy.get('[daya-cy=create-details]').click();
      cy.get('[daya-cy=create-image]').click();
      cy.get('[daya-cy=create-video]').click();
      cy.get('[daya-cy=create-audio]').click();
      cy.get('[daya-cy=create-h5p]').click(); 
      */

    /* 
      Test Lisens og bruker 
      */
    cy
      .get('button > span')
      .contains('Lisens og bruker')
      .click({ force: true });
    cy
      .get('button > span')
      .contains('Innhold')
      .click({ force: true });
    cy
      .get('label')
      .contains('Opphavsperson')
      .parent()
      .within(_ => {
        cy.get('[data-cy=addContributor]').click({ force: true });
        cy
          .get('.c-field__add-contributor > input')
          .type('Ola Nordmann', { force: true });
        cy
          .get('[data-cy="contributor-selector"]')
          .select('Originator', { force: true });
      });
    cy
      .get('label')
      .contains('Rettighetshaver')
      .parent()
      .within(_ => {
        cy.get('[data-cy=addContributor]').click({ force: true });
        cy
          .get('.c-field__add-contributor > input')
          .type('Ola Nordmann', { force: true });
        cy
          .get('[data-cy="contributor-selector"]')
          .select('Rightsholder', { force: true });
      });
    cy
      .get('label')
      .contains('Bearbeider')
      .parent()
      .within(_ => {
        cy.get('[data-cy=addContributor]').click({ force: true });
        cy
          .get('.c-field__add-contributor > input')
          .type('Ola Nordmann', { force: true });
        cy
          .get('[data-cy="contributor-selector"]')
          .select('Processor', { force: true });
      });

    cy.get('[data-testid=saveLearningResourceButton').click({ force: true });
    cy.url().should('contain', 'subject-matter/learning-resource/9337/edit/nb');
  });
});
