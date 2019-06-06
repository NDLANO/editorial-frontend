/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions, setToken } from '../../support';

const ARTICLE_ID = 14872;

describe('Workflow features', () => {
  beforeEach(() => {
    setToken();
    cy.server({ force404: true });
    cy.apiroute(
      'GET',
      '/draft-api/v1/drafts/tags/?language=nb&size=7000',
      'tags',
    );
    cy.apiroute(
      'GET',
      `/draft-api/v1/drafts/${ARTICLE_ID}?language=nb&fallback=true`,
      'draft',
    );
    cy.apiroute('GET', '/draft-api/v1/drafts/licenses/', 'licenses');
    cy.route(
      'PATCH',
      `/draft-api/v1/drafts/${ARTICLE_ID}`,
      'fixture:draft.json',
    ).as('updateDraft');
    cy.apiroute(
      'GET',
      '/draft-api/v1/drafts/status-state-machine/',
      'statusMachine',
    );
    cy.visit(
      `/nb/subject-matter/learning-resource/${ARTICLE_ID}/edit/nb`,
      visitOptions,
    );
    cy.apiwait(['@tags', '@licenses', '@draft']);
  });

  it.skip('Can add notes, change status, save as new', () => {
    cy.route(
      'PATCH',
      `/draft-api/v1/drafts/${ARTICLE_ID}`,
      'fixture:draft.json',
    ).as('updateDraft');
    cy.get('button')
      .contains('Arbeidsflyt')
      .click();
    cy.get('[data-testid=addNote]').click();
    cy.get('[data-testid=notesInput]').type('Test merknad');

    // test that changing status and save as new don't work when note is added
    cy.get('button')
      .contains('Kladd')
      .click();
    cy.get('div').contains('Du må lagre endringene dine');
    cy.get('[data-testid=saveAsNew]').click();
    cy.get('div').contains('Du må lagre endringene dine');

    cy.get('[data-testid=saveLearningResourceButton]').click();
    cy.wait('@updateDraft');

    cy.route(
      'PUT',
      `/draft-api/v1/drafts/${ARTICLE_ID}/status/DRAFT`,
      'fixture:draft.json',
    ).as('newStatus');
    cy.get('button')
      .contains('Kladd')
      .click();
    cy.wait('@newStatus');
  });

  it.skip('Open previews', () => {
    cy.get('button')
      .contains('Arbeidsflyt')
      .click();
    cy.route(
      'POST',
      '/article-converter/json/nb/transform-article',
      'fixture:transformedArticle.json',
    ).as('transformedArticle');
    cy.get('[data-testid=preview]').click();
    cy.wait('@transformedArticle');
  });

  it.skip('Can reset to prod', () => {
    cy.get('[data-testid=resetToProd]').click();

    cy.apiroute(
      'GET',
      `/article-api/v2/articles/${ARTICLE_ID}?language=nb&fallback=true`,
      'originalArticle',
    );
    cy.get('button')
      .contains('Reset')
      .click();
    cy.apiwait('@originalArticle');
    cy.get('[data-testid=saveLearningResourceButton]').click();
    cy.wait('@updateDraft');
  });
});
