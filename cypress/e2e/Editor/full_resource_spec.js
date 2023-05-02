/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken } from '../../support/e2e';
import editorRoutes from './editorRoutes';

describe('Edit article with everything', () => {
  const ARTICLE_ID = 532;
  beforeEach(() => {
    setToken();
    editorRoutes(ARTICLE_ID);

    cy.visit(`/subject-matter/learning-resource/${ARTICLE_ID}/edit/nb`);
    cy.get('[data-cy="slate-editor"]');
    cy.apiwait([`@draft-${ARTICLE_ID}`, '@statusMachine', '@licenses', '@taxonomyTopics']);
    cy.get('article span').contains('Cypress test').should('exist');
  });

  it('Can change language and fetch the new article', () => {
    cy.apiroute('GET', `/draft-api/v1/drafts/${ARTICLE_ID}?language=en&fallback=true`, 'draftEN');
    cy.get('header button').contains('Legg til språk').click().wait(200);
    cy.get('header a').contains('Engelsk').click();
    cy.apiwait(['@draftEN', '@statusMachine', '@taxonomyTopics', '@taxonomyResources']);
    cy.get('article span').contains('Water english').should('exist');
  });

  it('Can edit the published date', () => {
    // check that article is not dirty
    cy.get('[data-testid=saveLearningResourceButtonWrapper] button').first().should('be.disabled');
    cy.get('span[name=published] > button').click();
    cy.get('.flatpickr-day ').first().click();
    cy.get('[data-cy=responsible-select]').click().type('Ed test {enter}');
    cy.get('[data-testid=saveLearningResourceButtonWrapper] button').first().click();
    cy.apiwait(['@getUserData', '@patchUserData']);
  });

  it('Has access to the html-editor', () => {
    cy.get('a[data-testid=edit-markup-link]').should('be.visible');
  });
});
