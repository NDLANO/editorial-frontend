/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions, setToken } from '../../support';

const ARTICLE_ID = 533;

describe('Workflow features', () => {
  beforeEach(() => {
    setToken();
    cy.server({
      force404: true,
      whitelist: xhr => {
        if (xhr.url.indexOf('sockjs-node/') > -1) return true;
        //return the default cypress whitelist filer
        return (
          xhr.method === 'GET' && /\.(jsx?|html|css)(\?.*)?$/.test(xhr.url)
        );
      },
    });
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
    cy.wait(500);
  });

  it('Can add notes, change status, save as new', () => {
    cy.apiroute(
      'GET',
      `/draft-api/v1/drafts/${ARTICLE_ID}/history?language=nb&fallback=true`,
      'articleHistory',
    );
    cy.route(
      'PATCH',
      `/draft-api/v1/drafts/${ARTICLE_ID}`,
      'fixture:draft.json',
    ).as('updateDraft');
    cy.get('button')
      .contains('Versjonslogg og merknader')
      .click();
    cy.apiwait('@articleHistory');
    cy.get('[data-testid=addNote]').click();
    cy.get('[data-testid=notesInput]').type('Test merknad');

    cy.get('[data-testid=saveLearningResourceButton]').click();
    cy.wait('@updateDraft');
  });

  it('Open previews', () => {
    cy.route(
      'POST',
      '/article-converter/json/nb/transform-article',
      'fixture:transformedArticle.json',
    ).as('transformedArticle');
    cy.get('button')
      .contains('Kvalitetssikring')
      .click();
    cy.get('button')
      .contains(/Forhåndsvis$/)
      .click({ force: true });
    cy.wait('@transformedArticle');
  });

  it('Can reset to prod', () => {
    cy.get('footer button')
      .contains('Endringer')
      .click();
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
