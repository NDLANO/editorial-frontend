/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken, visitOptions } from '../../support';
import editorRoutes from './editorRoutes';

describe('Edit article with everything', () => {
  const ARTICLE_ID = 532;
  before(() => {
    setToken();
    editorRoutes();

    cy.apiroute('GET', `/draft-api/v1/drafts/${ARTICLE_ID}?language=nb&fallback=true`, `draft-${ARTICLE_ID}`);
    cy.visit(`/subject-matter/learning-resource/${ARTICLE_ID}/edit/nb`, visitOptions);
  });

  beforeEach(() => {
    setToken();
    editorRoutes();
  });

  it('Can change language and fetch the new article', () => {
    cy.apiroute('GET', `/draft-api/v1/drafts/${ARTICLE_ID}?language=nn&fallback=true`, 'draftNN');
    cy.get('header button')
      .contains('Legg til språk')
      .click({ force: true });
    cy.get('header a')
      .contains('Nynorsk')
      .click({ force: true });
    cy.wait('@draftNN')
  });

  it('Can edit the published date', () => {
    cy.apiroute('PATCH', `/draft-api/v1/drafts/${ARTICLE_ID}`, `updateDraft-${ARTICLE_ID}`);
    // check that article is not dirty
    cy.get('[data-testid=saveLearningResourceButtonWrapper] button')
      .first()
      .should('be.disabled');
    cy.get('span[name=published] > button').click();
    cy.get('.flatpickr-day ')
      .first()
      .click();
    cy.get('[data-testid=saveLearningResourceButtonWrapper] button')
      .first()
      .click();
    cy.apiwait(['@getUserData', '@patchUserData']);
  });

  it('Has access to the html-editor', () => {
    cy.get('a[data-testid=edit-markup-link]').should('be.visible');
  });
});
