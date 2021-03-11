/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions, setToken } from '../../support';
import editorRoutes from './editorRoutes';

describe('Workflow features', () => {
  const ARTICLE_ID = 532;
  before(() => {
    // change article ID and run cy-record to add the new fixture data
    setToken();
    cy.server({
      force404: true,
      whitelist: xhr => {
        if (xhr.url.indexOf('sockjs-node/') > -1) return true;
        //return the default cypress whitelist filer
        return xhr.method === 'GET' && /\.(jsx?|html|css)(\?.*)?$/.test(xhr.url);
      },
    });

    editorRoutes(ARTICLE_ID);

    cy.visit(`/nb/subject-matter/learning-resource/${ARTICLE_ID}/edit/nb`, visitOptions);
    cy.apiwait(['@licenses', `@draft-${ARTICLE_ID}`]);
    cy.wait(500);
    cy.get('button')
      .contains('Versjonslogg og merknader')
      .click();
    cy.apiwait(`@articleHistory-${ARTICLE_ID}`);
  });

  beforeEach(() => {
    setToken();
    cy.server({ force404: true });

    editorRoutes(ARTICLE_ID);
  });

  it('Can add notes and save', () => {
    cy.get('[data-testid=addNote]').click();
    cy.get('[data-testid=notesInput]')
      .type('Test merknad')
      .blur();
    cy.get('[data-testid=saveLearningResourceButtonWrapper] button')
      .first()
      .click();
    cy.apiwait(`@updateDraft-${ARTICLE_ID}`);
  });

  it('Open previews', () => {
    cy.route(
      'POST',
      '/article-converter/json/nb/transform-article?draftConcept=true&previewH5p=true',
      'fixture:transformedArticle.json',
    ).as('transformedArticle');
    cy.get('[data-testid=previewVersion]')
      .first()
      .click();
    cy.wait('@transformedArticle');
    cy.get('[data-testid=closePreview]').click();
  });

  it('Can reset to prod', () => {
    cy.get('[data-testid=resetToVersion]')
      .first()
      .click();
    cy.get('[data-testid=closeAlert]').click();
    cy.get('[data-testid=saveLearningResourceButtonWrapper] button')
      .first()
      .click();
    cy.apiwait(`@updateDraft-${ARTICLE_ID}`);
  });
});
