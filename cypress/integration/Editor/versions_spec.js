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
  beforeEach(() => {
    // change article ID and run cy-record to add the new fixture data
    setToken();
    editorRoutes(ARTICLE_ID);

    cy.visit(`/nb/subject-matter/learning-resource/${ARTICLE_ID}/edit/nb`, visitOptions);
    cy.apiwait(['@licenses', `@draft-${ARTICLE_ID}`]);
    cy.contains('Versjonslogg og merknader')
      .click();
    cy.apiwait(`@articleHistory-${ARTICLE_ID}`);
    cy.wait('@getNoteUsers');
  });

  it('Can add notes and save', () => {
    cy.get('[data-testid=addNote]').click();
    cy.get('[data-testid=notesInput]')
      .type('Test merknad')
      .blur();
    cy.get('[data-testid=saveLearningResourceButtonWrapper] button')
      .first()
      .click();
  });

  it('Open previews', () => {
    cy.apiroute('POST', `/article-converter/json/nb/*`, `converted-article-${ARTICLE_ID}`)
    cy.get('[data-testid=previewVersion]')
      .first()
      .click();
    cy.apiwait(`@converted-article-${ARTICLE_ID}`)
    cy.get('[data-testid=closePreview]').click();
  });

  it('Can reset to prod', () => {
    cy.get('[data-testid=resetToVersion]')
      .first()
      .click();
    cy.get('[data-testid=saveLearningResourceButtonWrapper] button')
      .first()
      .click();
    cy.apiwait(`@updateDraft-${ARTICLE_ID}`);
  });
});
