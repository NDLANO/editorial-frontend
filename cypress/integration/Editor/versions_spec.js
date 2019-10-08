/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions, setToken } from '../../support';
import editorRoutes from './editorRoutes';

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

    editorRoutes(ARTICLE_ID);

    cy.visit(
      `/nb/subject-matter/learning-resource/${ARTICLE_ID}/edit/nb`,
      visitOptions,
    );
    cy.apiwait(['@licenses', '@draft']);
    cy.wait(500);
    cy.get('button')
      .contains('Versjonslogg og merknader')
      .click();
    cy.apiwait('@articleHistory');
  });

  it.only('Can add notes and save', () => {
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
    cy.get('[data-testid=previewVersion]')
      .first()
      .click();
    cy.wait('@transformedArticle');
  });

  it('Can reset to prod', () => {
    cy.get('[data-testid=resetToVersion]').click();

    cy.get('[data-testid=saveLearningResourceButton]').click();
    cy.wait('@updateDraft');
  });
});
