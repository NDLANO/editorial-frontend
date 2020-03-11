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
    cy.apiwait('@tags');
    cy.apiwait('@licenses');
  });

  it('can enter title, ingress and content then save', () => {
    cy.get('[data-testid=saveLearningResourceButton]').click({ force: true }); // checking that saving is disabled
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
    cy.get('[data-testid=saveLearningResourceButton').click();
    // cy.url().should('contain', 'subject-matter/learning-resource/9337/edit/nb');
  });

  it('can enter all types of blocks', () => {
    /* cy.route('GET', '/get_brightcove_token', ''); */
    /*     cy.route(
      'GET',
      'https://cms.api.brightcove.com/v1/accounts/4806596774001/videos/?limit=10&offset=0&q=',
      'fixture:editor/videoSearch.json',
    ); */
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .first()
      .focus();
    cy.get('[data-cy=slate-block-picker]').click({ force: true });
    cy.get('[data-cy=create-block]').click();
    cy.get('[data-cy=slate-block-picker]')
      .last()
      .click({ force: true });
    cy.get('[data-cy=create-factAside]')
      .last()
      .click();
    cy.get('[data-cy=remove-fact-aside]').click();
    cy.get('[data-cy=slate-block-picker]')
      .last()
      .click({ force: true });
    cy.get('[data-cy=create-bodybox]')
      .last()
      .click();
    cy.get('[data-cy=slate-block-picker]')
      .last()
      .click({ force: true });
    cy.get('[data-cy=create-details]')
      .last()
      .click();
    /*     cy.get('[data-cy=slate-block-picker]')
      .last()
      .click({ force: true });
    cy.get('[data-cy=create-image]')
      .last()
      .click();
    cy.get('button > img')
      .first()
      .parent()
      .click();
    cy.contains(t.imageSearch.useImage).click(); */

    /*     cy.get('[data-cy=slate-block-picker]')
      .last()
      .click( );
    cy.get('[data-cy=create-video]')
      .last()
      .click( );
    cy.contains(t.videoSearch.addVideo).click(); */
    /*     cy.get('[data-cy=slate-block-picker]')
      .last()
      .click({ force: true });
    cy.get('[data-cy=create-audio]')
      .last()
      .click();
    cy.contains(t.audioSearch.useAudio)
      .first()
      .click(); */
    /* cy.get('[data-cy=slate-block-picker]').click( );
    cy.get('[data-cy=create-h5p]').click(); */
    cy.get('[data-cy=slate-block-picker]')
      .last()
      .click({ force: true });
    cy.get('[data-cy=create-related]')
      .last()
      .click();
    cy.apiwait('@relatedArticles');
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

  it('Navigate around SlateBlockPicker', () => {
    const beforeEach = () => {
      cy.get('[data-slate-object=block] > p').first().click();
      cy.get('[cy="slate-block-picker-button"]').should('have.css', 'z-index', '10');
      cy.get('[data-cy=slate-block-picker]').click();
    };

    const afterEach = () => {
      cy.get('[cy="slate-block-picker-button"]').should('have.css', 'z-index', '-1');
      cy.get('[data-cy="learning-resource-title"]').click();
    };

    beforeEach();
    cy.get('[data-cy=create-factAside]').click();
    cy.get('[data-cy=remove-fact-aside]').click();
    afterEach();

    beforeEach();
    cy.get('[data-cy=create-table]').click();
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]').focus();
    cy.get('[data-cy=table-remove]').click();
    afterEach();

    beforeEach();
    cy.get('[data-cy=create-bodybox]').click();
    cy.get('[data-cy="remove-bodybox"]').click();
    afterEach();

    beforeEach();
    cy.get('[data-cy=create-details]')
      .last()
      .click();
    afterEach();

  });
});
