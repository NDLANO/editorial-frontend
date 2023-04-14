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

    cy.visit(`/subject-matter/learning-resource/${ARTICLE_ID}/edit/nb`);
    cy.apiwait(['@licenses', `@draft-${ARTICLE_ID}`]);
  });

  it('Can change status corretly', () => {
    // change from published to in progress
    cy.get('[data-cy=footerStatus]').contains('Publisert').click();

    cy.get('*[id^="react-select-3-option"]').contains('I arbeid').click();

    cy.apiwait('@getUsersResponsible');
    cy.get('[data-cy=responsible-select]').click().type('Ed test {enter}');
    cy.contains('Lagre').click();
    cy.contains('button', 'Ok').click();
    cy.contains('Lagre').click();
    cy.get('[data-testid=saveLearningResourceButtonWrapper]').contains('Lagrer');
    cy.apiwait(`@updateDraft-${ARTICLE_ID}`);
    cy.get('[data-testid=saveLearningResourceButtonWrapper]').contains('Lagret');

    cy.apiroute('PATCH', `/draft-api/v1/drafts/${ARTICLE_ID}`, `updatedDraft-${ARTICLE_ID}`);

    cy.get('[data-cy="learning-resource-title"]').click().type('Some change');
    cy.get('[data-cy=footerStatus]').contains('I arbeid').click();
    cy.contains('Sisteblikk').click();
    cy.get('[data-cy=responsible-select]').click().type('Ed test {enter}');
    cy.contains('Lagre').click();
    cy.contains('button', 'Ok').click();
    cy.contains('Lagre').click();
    cy.get('[data-testid=saveLearningResourceButtonWrapper]').contains('Lagrer');
    cy.apiwait(`@updatedDraft-${ARTICLE_ID}`);

    cy.get('[data-testid=saveLearningResourceButtonWrapper]').contains('Lagret');
    cy.apiroute('PATCH', `/draft-api/v1/drafts/${ARTICLE_ID}`, `finalDraft-${ARTICLE_ID}`);

    cy.get('[data-cy=footerStatus]').contains('Sisteblikk').click();
    cy.contains('Publiser').click();

    cy.get('[data-testid=saveLearningResourceButtonWrapper]').contains('Lagrer');
    cy.apiwait(`@finalDraft-${ARTICLE_ID}`);
    cy.get('[data-testid=saveLearningResourceButtonWrapper]').contains('Lagret');
  });
});
