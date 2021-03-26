/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken, visitOptions } from '../../support';
import editorRoutes from './editorRoutes';

const ARTICLE_ID = 800;

describe('Language handling', () => {
  beforeEach(() => {
    setToken();
    editorRoutes();
    cy.apiroute(
      'GET',
      `/draft-api/v1/drafts/${ARTICLE_ID}?language=nb&fallback=true`,
      `draft-${ARTICLE_ID}`,
    );

    cy.visit(
      `/subject-matter/topic-article/${ARTICLE_ID}/edit/nb`,
      visitOptions,
    );
    cy.apiwait(['@licenses', `@draft-${ARTICLE_ID}`]);
  });

  it('Can change language and fetch the new article', () => {
    cy.get('header button')
      .contains('Legg til')
      .click({ force: true });
  });

  it('Has access to the html-editor', () => {
    cy.get('a[data-testid=edit-markup-link]').should('be.visible');
  });
});
