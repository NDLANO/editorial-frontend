/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken } from '../../support/e2e';
import editorRoutes from './editorRoutes';

// change article ID and run cy-record to add the new fixture data
const ARTICLE_ID = 533;

describe('Status changes', () => {
  beforeEach(() => {
    setToken();
    editorRoutes(ARTICLE_ID);
    cy.apiroute(
      'PUT',
      `**/draft-api/v1/drafts/${ARTICLE_ID}/status/PROPOSAL`,
      `statusChangeToUtkast`,
    );
    cy.apiroute(
      'PUT',
      `**/draft-api/v1/drafts/${ARTICLE_ID}/status/QUEUED_FOR_PUBLISHING`,
      `statusChangeToQueuePublish`,
    );
    cy.apiroute(
      'PUT',
      `**/draft-api/v1/drafts/${ARTICLE_ID}/status/PUBLISHED`,
      `statusChangeToPublish`,
    );

    cy.visit(`/subject-matter/learning-resource/${ARTICLE_ID}/edit/nb`);
    cy.apiwait(['@licenses', `@draft-${ARTICLE_ID}`]);
  });

  it('Can change status corretly', () => {
    // change from published to proposal
    cy.get('[data-cy=footerStatus]')
      .contains('Publisert')
      .click();
    cy.contains('Utkast').click();
    cy.apiwait('@getUsersResponsible');
    cy.get('[data-cy=responsible-select]')
      .click()
      .type('Ed test {enter}');
    cy.contains('Lagre').click();
    cy.get('[data-testid=saveLearningResourceButtonWrapper]').contains('Lagrer');
    cy.apiwait(`@statusChangeToUtkast`);
    cy.get('[data-testid=saveLearningResourceButtonWrapper]').contains('Lagret');

    cy.get('[data-cy="learning-resource-title"]')
      .click()
      .type('Some change');
    cy.get('[data-cy=footerStatus]')
      .contains('Utkast')
      .click();
    cy.contains('Til publisering').click();
    cy.get('[data-cy=responsible-select]')
      .click()
      .type('Ed test {enter}');
    cy.contains('Lagre').click();
    cy.get('[data-testid=saveLearningResourceButtonWrapper]').contains('Lagrer');
    cy.apiwait(`@updateDraft-${ARTICLE_ID}`);
    cy.apiwait(`@statusChangeToQueuePublish`);
    cy.get('[data-testid=saveLearningResourceButtonWrapper]').contains('Lagret');

    cy.get('[data-cy=footerStatus]')
      .contains('Til publisering')
      .click();
    cy.contains('Publiser').click();

    cy.get('[data-testid=saveLearningResourceButtonWrapper]').contains('Lagrer');
    cy.apiwait(`@statusChangeToPublish`);
    cy.get('[data-testid=saveLearningResourceButtonWrapper]').contains('Lagret');
  });
});
