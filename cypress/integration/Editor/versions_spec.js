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
    cy.contains('Versjonslogg og merknader')
      .click();
    cy.apiwait(['@licenses', `@draft-${ARTICLE_ID}`, `@articleHistory-${ARTICLE_ID}`, '@getNoteUsers']);
  });

  // it('Can add notes and save', () => {
  //   cy.get('[data-testid=addNote]').click();
  //   cy.get('[data-testid=notesInput]')
  //     .type('Test merknad')
  //     .blur();
  //   cy.get('[data-testid=saveLearningResourceButtonWrapper] button')
  //     .first()
  //     .click();
  //   cy.apiwait('@patchUserData');
  // });
  //
  // it('Open previews', () => {
  //   cy.apiroute('POST', `/article-converter/json/nb/*`, `converted-article-${ARTICLE_ID}`)
  //   cy.get('[data-testid=previewVersion]')
  //     .first()
  //     .click();
  //   cy.get('[data-testid=closePreview]').click();
  //   cy.apiwait(`@converted-article-${ARTICLE_ID}`);
  // });

  it('Can reset to prod', () => {
    // This operation is slow, and even slower on older/limited hardware, hence the additional 5s
    cy.get('[data-testid=resetToVersion]')
      .first()
      .click()
      .wait(5000);
    cy.get('[data-testid=saveLearningResourceButtonWrapper] button')
      .first()
      .click();
    cy.apiwait([`@updateDraft-${ARTICLE_ID}`, "@getUserData", `@articleHistory-${ARTICLE_ID}`, "@patchUserData", "@getNoteUsers"]);
  });
});
