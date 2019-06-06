/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken, visitOptions } from '../../support';

const ARTICLE_ID = 14872;

describe('Language handling', () => {
  beforeEach(() => {
    setToken();
    cy.server({ force404: true });
    cy.apiroute('GET', '/draft-api/v1/drafts/tags/**', 'tags');
    cy.route(
      'GET',
      `/draft-api/v1/drafts/${ARTICLE_ID}?language=nb&fallback=true`,
    ).as('draft');
    cy.apiroute(
      'GET',
      `/draft-api/v1/drafts/${ARTICLE_ID}?language=nn&fallback=true`,
      'draftNN',
    );
    cy.apiroute('GET', '/draft-api/v1/drafts/licenses/', 'licenses');
    cy.visit(
      `/subject-matter/learning-resource/${ARTICLE_ID}/edit/nb`,
      visitOptions,
    );
    cy.wait(['@tags', '@licenses', '@draft']);
  });

  it('Can change language and fetch the new article', () => {
    cy.get('header [role="button"]')
      .contains('Nynorsk')
      .click({ force: true });
    cy.apiwait('@draftNN');
  });
});
