/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken } from '../../support/e2e';
import editorRoutes from './editorRoutes';

describe('Workflow features', () => {
  const ARTICLE_ID = 532;
  beforeEach(() => {
    // change article ID and run cy-record to add the new fixture data
    setToken();
    editorRoutes(ARTICLE_ID);

    cy.visit(`/subject-matter/learning-resource/${ARTICLE_ID}/edit/nb`);
    cy.contains('Versjonslogg og merknader').click();
    cy.apiwait([
      '@licenses',
      `@draft-${ARTICLE_ID}`,
      `@articleHistory-${ARTICLE_ID}`,
      '@getNoteUsers',
    ]);
    cy.get('[data-testid=addNote]').should('be.visible');
  });

  it('Can add notes and responsible then save', () => {
    cy.get('[data-testid=addNote]').click();
    cy.get('[data-testid=notesInput]').click().should('have.focus').type('Test merknad');
    cy.get('[data-cy=responsible-select]').click().type('Ed test {enter}');
    cy.get('[data-testid=saveLearningResourceButtonWrapper] button').first().click();
    cy.apiwait('@patchUserData');
    cy.get('[data-testid=notesInput]').should('not.exist');
    cy.get('[id=learning-resource-workflow]').find('tr').its('length').should('eq', 10);
  });

  it('Open previews', () => {
    cy.apiroute('POST', `/graphql-api/graphql`, `converted-article-${ARTICLE_ID}`);
    cy.get('[data-testid=previewVersion]').first().click();
    cy.apiwait(`@converted-article-${ARTICLE_ID}`);
    cy.get(`article`).its('length').should('eq', 3);
    cy.get('[data-cy=close-modal-button]').should('exist').click();
  });

  it('Can reset to prod', () => {
    // This operation is slow, and even slower on older/limited hardware, hence the additional 5s
    cy.apiroute('GET', `/article-api/v2/articles/${ARTICLE_ID}*`, `article-${ARTICLE_ID}`);
    cy.get('[data-testid=resetToVersion]').first().click();
    cy.contains('Innhold er tilbakestilt');
    cy.apiwait('@getUsersResponsible');
    cy.get('[data-cy=responsible-select]').click().type('Ed test {enter}');
    cy.get('[data-testid=saveLearningResourceButtonWrapper] button').first().click();
    cy.apiwait([
      `@article-${ARTICLE_ID}`,
      `@updateDraft-${ARTICLE_ID}`,
      '@getUserData',
      `@articleHistory-${ARTICLE_ID}`,
      '@patchUserData',
      '@getNoteUsers',
    ]);
  });
});
