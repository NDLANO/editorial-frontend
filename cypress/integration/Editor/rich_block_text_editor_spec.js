/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { beforeEachHelper } from '../../support';
import t from '../../../src/phrases/phrases-nb';

beforeEach(() => beforeEachHelper('/subject-matter/learning-resource/new'));

describe('Learning resource editing', () => {
  it('can enter title, ingress and content then save', () => {
    cy.server();
    cy.fixture('saveLearningResource').as('saveResponse');
    cy.route({
      method: 'POST',
      url: `/draft-api/v1/drafts/`,
      status: 201,
      response: '@saveResponse',
    }).as('savedLR');

    cy.get('[data-testid=saveLearningResourceButton]').click({ force: true }); // checking that saving is disabled
    cy.get('[data-cy=learning-resource-title]').type('This is a test title.', {
      force: true,
    });
    cy.get('.article_introduction').type('Test ingress', { force: true });
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .first()
      .focus()
      .type('This is test content {enter}', {
        force: true,
      });
    cy.get('[data-testid=saveLearningResourceButton').click({ force: true });
    cy.url().should('contain', 'subject-matter/learning-resource/9337/edit/nb');
  });
  it('can enter all types of blocks', () => {
    cy.server();
    cy.route('GET', '/get_brightcove_token', '');
    cy.route(
      'GET',
      'https://cms.api.brightcove.com/v1/accounts/4806596774001/videos/?limit=10&offset=0&q=',
      'fixture:editor/videoSearch.json',
    );
    cy.get('[data-cy=slate-editor] [data-slate-editor=true]')
      .first()
      .focus();
    cy.get('[data-cy=slate-block-picker]').click({ force: true });
    cy.get('[data-cy=create-block]').click({ force: true });
    cy.get('[data-cy=slate-block-picker]')
      .last()
      .click({ force: true });
    cy.get('[data-cy=create-factAside]')
      .last()
      .click({ force: true });
    cy.get('[data-cy=remove-fact-aside]').click({ force: true });

    cy.get('[data-cy=slate-block-picker]')
      .last()
      .click({ force: true });
    cy.get('[data-cy=create-bodybox]')
      .last()
      .click({ force: true });
    cy.get('[data-cy=slate-block-picker]')
      .last()
      .click({ force: true });
    cy.get('[data-cy=create-details]')
      .last()
      .click({ force: true });
    cy.get('[data-cy=slate-block-picker]')
      .last()
      .click({ force: true });
    cy.get('[data-cy=create-image]')
      .last()
      .click({ force: true });
    cy.get('button > img')
      .first()
      .parent()
      .click();
    cy.contains(t.imageSearch.useImage).click();
    /*     cy.get('[data-cy=slate-block-picker]')
      .last()
      .click({ force: true });
    cy.get('[data-cy=create-video]')
      .last()
      .click({ force: true });
    cy.contains(t.videoSearch.addVideo).click(); */
    cy.get('[data-cy=slate-block-picker]')
      .last()
      .click({ force: true });
    cy.get('[data-cy=create-audio]')
      .last()
      .click({ force: true });
    cy.contains(t.audioSearch.useAudio)
      .first()
      .click({ force: true });
    /* cy.get('[data-cy=slate-block-picker]').click({ force: true });
    cy.get('[data-cy=create-h5p]').click(); */
    cy.get('[data-cy=slate-block-picker]')
      .last()
      .click({ force: true });
    cy.get('[data-cy=create-related]')
      .last()
      .click({ force: true });
    cy.get('[data-testid=relatedWrapper]').click({ force: true });
  });

  it('Can add all contributors', () => {
    cy.get('button > span')
      .contains('Lisens og bruker')
      .click({ force: true });
    cy.get('button > span')
      .contains('Innhold')
      .click({ force: true });
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
